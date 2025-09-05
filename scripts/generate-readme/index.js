import fs from "fs/promises";
import ollama from "ollama";
import chalk from "chalk";
import ora from "ora";
import path from "path";

async function loadPrompt(templatePath) {
  try {
    return await fs.readFile(templatePath, "utf-8");
  } catch (error) {
    console.error(
      chalk.hex("#DBA4FF")("💥 Error: ") + "Failed to load context file."
    );
    throw error;
  }
}

async function generateReadme(projectContent) {
  const basePrompt = await loadPrompt(
    "./scripts/generate-readme/CONTEXT.md"
  );

  const prompt = `${basePrompt}\n\nProject Content:\n${projectContent}`;

  const response = await ollama.chat({
    model: "llama3.2:latest",
    messages: [{ role: "user", content: prompt }],
  });

  return response.message.content.trim();
}

async function main() {
  let projectPath = process.argv[2];
  if (!projectPath) {
    console.log(
      chalk.hex("#DBA4FF")("⚠️  Please provide a project path or file to generate README.md for.")
    );
    console.log(
      chalk.hex("#DBA4FF")("Example: npm run readme @/app/pages/student/dashboard")
    );
    return;
  }

  if (projectPath.startsWith("@/")) {
    const baseDir = path.resolve(process.cwd(), "./");
    projectPath = path.join(baseDir, projectPath.slice(2));
  }

  const spinner = ora(
    chalk.hex("#DBA4FF")("Generating README.md... Please wait.")
  ).start();

  try {
    let contentToAnalyze = "";
    const stats = await fs.stat(projectPath);

    if (stats.isDirectory()) {
      const files = await fs.readdir(projectPath);
      for (const file of files) {
        const filePath = path.join(projectPath, file);
        const fileStats = await fs.stat(filePath);
        if (fileStats.isFile() && !file.startsWith('.')) { // Avoid hidden files
          contentToAnalyze += `--- ${file} ---\n`;
          contentToAnalyze += await fs.readFile(filePath, "utf-8");
          contentToAnalyze += "\n\n";
        }
      }
    } else if (stats.isFile()) {
      contentToAnalyze = await fs.readFile(projectPath, "utf-8");
    } else {
      throw new Error("Provided path is neither a file nor a directory.");
    }

    const readmeContent = await generateReadme(contentToAnalyze);
    const outputFileName = stats.isDirectory() ? path.join(projectPath, "README.md") : path.join(path.dirname(projectPath), "README.md");
    await fs.writeFile(outputFileName, readmeContent, "utf-8");

    spinner.succeed(chalk.hex("#DBA4FF")("✅ Success!"));

    console.log(
      chalk.hex("#DBA4FF")("README.md generated at: ") +
        chalk.hex("#DBA4FF")(outputFileName)
    );
  } catch (error) {
    spinner.fail(chalk.hex("#DBA4FF")("💥 Error!"));
    console.error(
      chalk.hex("#DBA4FF").bold("An issue occurred:") +
        "\n\n" +
        chalk.hex("#DBA4FF")(error.message)
    );
  }
}

main();
