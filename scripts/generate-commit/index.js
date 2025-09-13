import fs from "fs/promises";
import ollama from "ollama";
import { execSync } from "child_process";
import chalk from "chalk";
import ora from "ora";

async function loadPrompt(templatePath) {
  return await fs.readFile(templatePath, "utf-8");
}

async function generateCommitMessage(diffText) {
  const context = await loadPrompt("./scripts/generate-commit/CONTEXT.md");
  const prompt = `${context}\n\nGit diff:\n${diffText}`;

  const response = await ollama.chat({
    model: "gemma3:4b",
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

export async function main() {
  let spinner;
  try {
    // Автоматично додати всі файли у staging
    execSync("git add .", { stdio: "inherit" });

    const realDiff = execSync("git diff --staged").toString().trim();

    if (!realDiff) {
      console.log(chalk.hex("#DBA4FF")("There are no changes to the commit."));
      return;
    }

    spinner = ora(
      chalk.hex("#DBA4FF")("Generating commit message... Please wait.")
    ).start();
    const rawCommitMessage = await generateCommitMessage(realDiff);
    const commitMessage = sanitizeMessage(rawCommitMessage);
    spinner.succeed(
      chalk.hex("#DBA4FF")("Done! Your commit message is ready.")
    );

    console.log(
      chalk.hex("#DBA4FF").bold("\n📝 Your commit message here:")
    );
    console.log(chalk.hex("#DBA4FF")(`"${commitMessage}"`));
    
    // execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });

  } catch (error) {
    if (spinner) {
      spinner.fail(chalk.hex("#DBA4FF")("💥 Сталася помилка."));
    }
    console.error(chalk.hex("#DBA4FF")(`💥 Помилка: ${error.message}`));
  }
}

main();
