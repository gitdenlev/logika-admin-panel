import fs from "fs/promises";
import ollama from "ollama";
import chalk from "chalk";
import boxen from "boxen";
import ora from "ora";
import path from "path";

// Common box settings for a consistent look
const BOX_WIDTH = 46;
const PADDING = 1;

// Load base prompt from context.txt
async function loadPrompt(templatePath) {
  try {
    return await fs.readFile(templatePath, "utf-8");
  } catch (error) {
    console.error(chalk.red("💥 Помилка: ") + "Не вдалося завантажити файл контексту.");
    throw error;
  }
}

// Generate comments for a given code snippet
async function generateComment(codeSnippet) {
  const basePrompt = await loadPrompt(
    "./scripts/generate-comments/context.txt"
  );

  const prompt = `${basePrompt}  Add comments to the following code:
${codeSnippet}`;

  const response = await ollama.chat({
    model: "llama3.2:latest",
    messages: [{ role: "user", content: prompt }],
  });

  return response.message.content.trim();
}

// Main CLI runner
async function main() {
  // Display CLI banner
  console.log(
    boxen(
      chalk.cyan.bold("📝 Code Comments CLI") + "\n" + chalk.gray("Powered by Ollama"),
      {
        padding: PADDING,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
        width: BOX_WIDTH,
      }
    )
  );

  let filePath = process.argv[2];
  if (!filePath) {
    const msg =
      chalk.yellow("⚠️  Будь ласка, вкажіть шлях до файлу.") +
      "\n\n" +
      chalk.cyan("Приклад: npm run comments @/app/pages");

    console.log(
      boxen(msg, {
        padding: PADDING,
        borderStyle: "round",
        borderColor: "yellow",
        width: BOX_WIDTH,
      })
    );
    return;
  }

  if (filePath.startsWith("@/")) {
    const baseDir = path.resolve(process.cwd(), "./");
    filePath = path.join(baseDir, filePath.slice(2));
  }

  const spinner = ora(chalk.blue("🔄 Генерація коментарів... Будь ласка, зачекайте.")).start();

  try {
    const code = await fs.readFile(filePath, "utf-8");
    const commentedCode = await generateComment(code);
    await fs.writeFile(filePath, commentedCode, "utf-8");

    spinner.succeed(chalk.green("✅ Успіх!"));

    const successMsg =
      chalk.white("Коментарі додано до файлу:\n") +
      chalk.cyan(filePath);

    console.log(
      boxen(successMsg, {
        padding: PADDING,
        borderStyle: "double",
        borderColor: "green",
        width: BOX_WIDTH,
      })
    );
  } catch (error) {
    spinner.fail(chalk.red("💥 Помилка!"));
    const errorMsg =
      chalk.red.bold("Виникла проблема:") +
      "\n\n" +
      chalk.yellow(error.message);

    console.error(
      boxen(errorMsg, {
        padding: PADDING,
        borderStyle: "bold",
        borderColor: "red",
        width: BOX_WIDTH,
      })
    );
  }
}

main();
