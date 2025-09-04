import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import { execSync } from "child_process";
import boxen from "boxen";

// Вітання
console.log(
  chalk.cyan(figlet.textSync("Voro CLI", { horizontalLayout: "full" }))
);

console.log(
  boxen(chalk.green("🚀 Вітаємо у вашому особистому помічнику з кодування!"), {
    padding: 1,
    margin: { bottom: 1 },
    borderStyle: "round",
    borderColor: "green",
    title: "Code Helper",
    titleAlignment: "center",
  })
);

async function mainMenu() {
  const choices = [
    {
      name:
        chalk.green("✨ Commit Fusion") +
        chalk.gray(" - Згенерувати розумне повідомлення для коміту"),
      value: "commit",
    },
    {
      name:
        chalk.yellow("📝 Echo Notes") +
        chalk.gray(" - Додати коментарі до вашого коду за допомогою AI"),
      value: "comments",
    },
    new inquirer.Separator(),
    {
      name: chalk.red("❌ Вихід"),
      value: "exit",
    },
  ];

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: chalk.bold.blue("Що б ви хотіли зробити?"),
      choices,
    },
  ]);

  if (action === "commit") {
    execSync("node ./scripts/generate-commit/index.js", { stdio: "inherit" });
  } else if (action === "comments") {
    const { filePath } = await inquirer.prompt([
      {
        type: "input",
        name: "filePath",
        message: chalk.bold.yellow(
          "Введіть шлях до файлу, який потрібно прокоментувати:"
        ),
        default: "@/app/app.vue",
      },
    ]);
    if (filePath) {
      execSync(`node ./scripts/generate-comments/index.js ${filePath}`, {
        stdio: "inherit",
      });
    }
  } else {
    console.log(chalk.magenta("👋 До зустрічі!"));
    process.exit(0);
  }
}

mainMenu();
