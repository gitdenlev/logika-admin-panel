#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import { main as commitMain } from "./generate-commit/index.js";
import { main as commentsMain } from "./generate-comments/index.js";

// Вітання
console.log(chalk.blue(figlet.textSync("Voro", { horizontalLayout: "full" })));

console.log(chalk.cyan("🚀 Welcome to Code Helper\n"));

async function mainMenu() {
  const choices = [
    {
      name:
        chalk.green("✨ Commit Fusion") +
        chalk.gray(" - Generate smart commit messages"),
      value: "commit",
    },
    {
      name:
        chalk.yellow("📝 Echo Notes") + chalk.gray(" - Add AI comments to your code"),
      value: "comments",
    },
    {
      name: chalk.red("❌ Exit"),
      value: "exit",
    },
  ];

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: chalk.bold("Choose an action:"),
      choices,
    },
  ]);

  if (answer.action === "commit") {
    await commitMain();
  } else if (answer.action === "comments") {
    await commentsMain();
  } else {
    console.log(chalk.blue("👋 Goodbye!"));
    process.exit(0);
  }
}

mainMenu();
