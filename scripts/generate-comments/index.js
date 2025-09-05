import fs from "fs/promises";
import ollama from "ollama";
import chalk from "chalk";
import ora from "ora";
import path from "path";

// Load base prompt from context.txt
async function loadPrompt(templatePath) {
  try {
    return await fs.readFile(templatePath, "utf-8");
  } catch (error) {
    console.error(
      chalk.hex("#DBA4FF")("Error: ") + "Failed to load context file."
    );
    throw error;
  }
}

// Generate comments for a given code snippet
async function generateComment(codeSnippet) {
  const basePrompt = await loadPrompt(
    "./scripts/generate-comments/context.txt"
  );

  const prompt = `${basePrompt}  Add comments to the following code:\n${codeSnippet}`;

  const response = await ollama.chat({
    model: "llama3.2:latest",
    messages: [{ role: "user", content: prompt }],
  });

  return response.message.content.trim();
}

// Main CLI runner
async function main() {
  // Display CLI

  let filePath = process.argv[2];
  if (!filePath) {
    console.log(chalk.hex("#DBA4FF")("Please provide a file path."));
    console.log(chalk.hex("#DBA4FF")("Example: npm run comments @/app/pages"));
    return;
  }

  if (filePath.startsWith("@/")) {
    const baseDir = path.resolve(process.cwd(), "./");
    filePath = path.join(baseDir, filePath.slice(2));
  }

  const spinner = ora(
    chalk.hex("#DBA4FF")("Generating comments... Please wait.")
  ).start();

  try {
    const code = await fs.readFile(filePath, "utf-8");
    const commentedCode = await generateComment(code);
    await fs.writeFile(filePath, commentedCode, "utf-8");

    spinner.succeed(chalk.hex("#DBA4FF")("Success!"));

    console.log(
      chalk.hex("#DBA4FF")("Comments added to file: ") +
        chalk.hex("#DBA4FF")(filePath)
    );
  } catch (error) {
    spinner.fail(chalk.hex("#DBA4FF")("Error!"));
    console.error(
      chalk.hex("#DBA4FF").bold("An issue occurred:") +
        "\n\n" +
        chalk.hex("#DBA4FF")(error.message)
    );
  }
}

main();
