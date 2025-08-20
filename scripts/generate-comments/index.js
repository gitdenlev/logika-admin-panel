import fs from "fs/promises";
import ollama from "ollama";
import chalk from "chalk";
import boxen from "boxen";

// Common box settings for consistent look
const BOX_WIDTH = 46;
const PADDING = 1;

// Load base prompt from context.txt
async function loadPrompt(templatePath) {
  return await fs.readFile(templatePath, "utf-8");
}

// Generate comments for a given code snippet
async function generateComment(codeSnippet) {
  const basePrompt = await loadPrompt(
    "./scripts/generate-comments/context.txt"
  );

  const prompt = `${basePrompt}\n\nAdd comments to the following code:\n${codeSnippet}`;

  const response = await ollama.chat({
    model: "llama3.2:latest",
    messages: [{ role: "user", content: prompt }],
  });

  return response.message.content.trim();
}

// Main CLI runner
async function main() {
  try {
    const filePath = process.argv[2];
    if (!filePath) {
      const msg =
        chalk.yellow("⚠️  Please provide a file path.") +
        "\n\n" +
        chalk.cyan("Example: npm run comments ./src/app.js");

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

    console.log(
      boxen(chalk.blue("🔄 Generating comments... Please wait."), {
        padding: PADDING,
        borderStyle: "classic",
        borderColor: "blue",
        width: BOX_WIDTH,
      })
    );

    const code = await fs.readFile(filePath, "utf-8");
    const commentedCode = await generateComment(code);

    await fs.writeFile(filePath, commentedCode, "utf-8");

    const successMsg =
      chalk.green.bold("✅ Success!") +
      "\n\n" +
      chalk.white("Comments have been added to file:\n") +
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
    const errorMsg =
      chalk.red.bold("💥 Error:") + "\n\n" + chalk.yellow(error.message);

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