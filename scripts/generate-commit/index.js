import fs from "fs/promises";
import ollama from "ollama";
import { execSync } from "child_process";
import boxen from "boxen";
import chalk from "chalk";

async function loadPrompt(templatePath) {
  return await fs.readFile(templatePath, "utf-8");
}

async function generateCommitMessage(diffText) {
  const context = await loadPrompt("./scripts/generate-commit/context.txt");
  const prompt = `${context}\n\nGit diff:\n${diffText}`;

  const response = await ollama.chat({
    model: "llama3.2:latest",
    messages: [{ role: "user", content: prompt }],
  });

  return response.message.content.trim();
}

function sanitizeMessage(raw) {
  return raw.split("\n")[0].replace(/^"+|"+$/g, "");
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

async function main() {
  try {
    const realDiff = execSync("git diff --staged").toString().trim();

    if (!realDiff) {
      logBox("No staged changes. Use 'git add' first.", "yellow", "⚠️");
      return;
    }

    logBox("Generating commit message... Please wait.", "blue", "🤖");

    const rawCommitMessage = await generateCommitMessage(realDiff);
    const commitMessage = sanitizeMessage(rawCommitMessage);

    logBox(
      `Full AI suggestion:\n\n${chalk.white(rawCommitMessage)}`,
      "cyan",
      "📝"
    );
    logBox(
      `Commit message to be used:\n\n${chalk.green(`"${commitMessage}"`)}`,
      "green",
      "✨"
    );

    execSync("git add .");
    execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });

    logBox("Commit created successfully!", "green", "✅");
  } catch (error) {
    logBox(`Error: ${error.message}`, "red", "💥");
  }
}

main();
