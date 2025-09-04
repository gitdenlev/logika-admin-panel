import fs from "fs/promises";
import ollama from "ollama";
import { execSync } from "child_process";
import boxen from "boxen";
import chalk from "chalk";
import ora from "ora";

async function loadPrompt(templatePath) {
  return await fs.readFile(templatePath, "utf-8");
}

async function generateCommitMessage(diffText) {
  const context = await loadPrompt("./scripts/generate-commit/CONTEXT.md");
  const prompt = `${context}\n\nGit diff:\n${diffText}`;

  const response = await ollama.chat({
    model: "llama3.2:latest",
    messages: [{ role: "user", content: prompt }],
  });

  return response.message.content.trim();
}

function sanitizeMessage(raw) {
  let firstLine = raw.split("\n")[0].trim();

  firstLine = firstLine.replace(/^"+|"+$/g, "");

  if (firstLine.length > 80) {
    firstLine = firstLine.slice(0, 77) + "...";
  }

  return firstLine;
}

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

export async function main() {
  let spinner;
  try {
    // Автоматично додати всі файли у staging
    execSync("git add .", { stdio: "inherit" });

    const realDiff = execSync("git diff --staged").toString().trim();

    if (!realDiff) {
      logBox("Зміни для коміту відсутні.", "yellow", "⚠️");
      return;
    }

    spinner = ora(
      chalk.cyan("🤖 Генеруємо повідомлення для коміту... Будь ласка, зачекайте.")
    ).start();
    const rawCommitMessage = await generateCommitMessage(realDiff);
    const commitMessage = sanitizeMessage(rawCommitMessage);
    spinner.succeed(
      chalk.green("✨ Повідомлення для коміту успішно згенеровано!")
    );

    logBox(
      `Повідомлення, що буде використано:\n\n${chalk.bold.green(
        `"${commitMessage}"`
      )}`,
      "green",
      "📝"
    );

    execSync(`git commit -m \"${commitMessage}\"`, { stdio: "inherit" });

    logBox("Коміт успішно створено!", "green", "✅");
  } catch (error) {
    if (spinner) {
      spinner.fail(chalk.red("💥 Сталася помилка."));
    }
    logBox(`Помилка: ${error.message}`, "red", "💥");
  }
}

main();
