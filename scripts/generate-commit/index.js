import fs from "fs/promises";
import ollama from "ollama";
import { execSync } from "child_process";
import boxen from "boxen";
import chalk from "chalk";
import ora from "ora";

/**
 * Завантажує текст шаблону промпта з файлу.
 * @param {string} templatePath Шлях до файлу з шаблоном.
 * @returns {Promise<string>} Вміст файлу.
 */
async function loadPrompt(templatePath) {
  try {
    return await fs.readFile(templatePath, "utf-8");
  } catch (error) {
    throw new Error(
      `Failed to load prompt from ${templatePath}: ${error.message}`
    );
  }
}

/**
 * Генерує повідомлення коміту, використовуючи Ollama.
 * @param {string} diffText Текст git diff.
 * @returns {Promise<string>} Згенероване повідомлення.
 */
async function generateCommitMessage(diffText) {
  const context = await loadPrompt("./scripts/generate-commit/context.txt");
  const prompt = `${context}\n\nGit diff:\n${diffText}`;

  const response = await ollama.chat({
    model: "llama3.2:latest",
    messages: [{ role: "user", content: prompt }],
  });

  return response.message.content.trim();
}

/**
 * Очищає згенероване повідомлення.
 * @param {string} raw Необроблене повідомлення.
 * @returns {string} Очищене повідомлення, обмежене 80 символами.
 */
function sanitizeMessage(raw) {
  let firstLine = raw.split("\n")[0].trim();

  firstLine = firstLine.replace(/^"+|"+$/g, "");

  if (firstLine.length > 80) {
    firstLine = firstLine.slice(0, 77) + "...";
  }

  return firstLine;
}

/**
 * Виводить повідомлення в красивій рамці.
 * @param {string} message Повідомлення для виведення.
 * @param {string} color Колір рамки.
 * @param {string} icon Іконка для відображення.
 */
function logBox(message, color = "blue", icon = "ℹ️") {
  console.log(
    boxen(`${icon}  ${message}`, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: color,
    })
  );
}

/**
 * Основна функція застосунку.
 */
async function main() {
  try {
    const gitAddSpinner = ora(chalk.blue("Staging files...")).start();
    execSync("git add .", { stdio: "pipe" });
    gitAddSpinner.succeed(chalk.green("All files staged."));

    const realDiff = execSync("git diff --staged").toString().trim();

    if (!realDiff) {
      logBox("No staged changes. Nothing to commit.", "yellow", "⚠️");
      return;
    }

    const generationSpinner = ora(
      chalk.blue("Generating commit message...")
    ).start();

    const rawCommitMessage = await generateCommitMessage(realDiff);
    const commitMessage = sanitizeMessage(rawCommitMessage);

    generationSpinner.succeed(chalk.green("Commit message generated!"));

    logBox(
      `Commit message to be used:\n\n${chalk.green(`"${commitMessage}"`)}`,
      "green",
      "✨"
    );

    const gitCommitSpinner = ora(chalk.blue("Creating commit...")).start();
    execSync(`git commit -m "${commitMessage}"`, { stdio: "pipe" });
    gitCommitSpinner.succeed(chalk.green("Commit created successfully!"));
  } catch (error) {
    // Всі помилки будуть відображені через ora.fail
    ora().fail(chalk.red(`Error: ${error.message}`));
    // Важливо: execSync також викидає помилки, якщо команда не спрацювала
    // тому `ora().fail` перехопить їх автоматично.
  }
}

main();
