import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import { execSync } from "child_process";
import readline from "readline";

// --- Банер (залишаємо без змін) ---
const banner = figlet.textSync("VORO", {
  font: "ANSI Shadow",
  horizontalLayout: "full",
});

console.log(gradient(["#DBA4FF", "#EEEEEE"]).multiline(chalk(banner)));
console.log(chalk.gray("\nType /help to see available commands\n"));

// --- Налаштування CLI ---
// Змінюємо вигляд промпту, щоб він відповідав скріншоту
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk("> "), // Промпт як на скріншоті
});

// --- Список команд з описом для меню допомоги ---
// Команди у стилі скріншота з правильними кольорами
const commandList = [
  { name: "about", description: "show version info" },
  { name: "auth", description: "change the auth method" },
  { name: "bug", description: "submit a bug report" },
  { name: "chat", description: "Manage conversation history." },
  { name: "clear", description: "clear the screen and conversation history" },
  {
    name: "compress",
    description: "Compresses the context by replacing it with a summary.",
  },
  {
    name: "copy",
    description: "Copy the last result or code snippet to clipboard",
  },
  { name: "corgi", description: "Toggles corgi mode." },
  { name: "commit", description: "Generate a smart commit message" },
  { name: "comments", description: "Add comments to your code" },
  { name: "readme", description: "Generate README.md documentation" },
  { name: "help", description: "Show this help message" },
  { name: "exit", description: "Exit the program" },
];

// --- Об'єкт з логікою команд ---
const commands = {
  "/help": () => {
    console.log(); // Порожній рядок зверху

    // Знаходимо найдовшу назву команди для правильного вирівнювання
    const maxLength = Math.max(...commandList.map((cmd) => cmd.name.length));

    // Виводимо команди у стилі скріншота
    commandList.forEach((cmd) => {
      // Вирівнюємо назви команд
      const paddedName = cmd.name.padEnd(maxLength + 2, " ");

      // Застосовуємо кольори як на скріншоті
      const coloredName = chalk.hex("#A855F7").bold(paddedName); // Фіолетовий та жирний для команд
      const coloredDesc = chalk.hex("#6B7280")(cmd.description); // Сірий для описів

      console.log(`${coloredName}${coloredDesc}`);
    });

    console.log(); // Порожній рядок знизу
  },

  "/about": () => {
    console.log(chalk.cyan("VORO CLI v1.0.0"));
    console.log(chalk.gray("A smart development assistant"));
  },

  "/auth": () => {
    console.log(chalk.yellow("Authentication settings..."));
    // Тут буде логіка для налаштування автентифікації
  },

  "/bug": () => {
    console.log(chalk.red("Opening bug report form..."));
    // Тут буде логіка для відправки звіту про баг
  },

  "/chat": () => {
    console.log(chalk.blue("Managing conversation history..."));
    // Тут буде логіка для управління історією чату
  },

  "/clear": () => {
    console.clear();
    console.log(gradient(["#DBA4FF", "#EEEEEE"]).multiline(chalk(banner)));
    console.log(
      chalk.gray("\nScreen cleared. Type /help to see available commands\n")
    );
  },

  "/compress": () => {
    console.log(chalk.yellow("Compressing context..."));
    // Тут буде логіка для стиснення контексту
  },

  "/copy": () => {
    console.log(chalk.green("Copied to clipboard!"));
    // Тут буде логіка для копіювання в буфер обміну
  },

  "/corgi": () => {
    console.log(chalk.yellow("Woof! Corgi mode toggled!"));
    // Тут буде логіка для режиму корги
  },

  "/commit": () => {
    try {
      execSync("node ./scripts/generate-commit/index.js", { stdio: "inherit" });
    } catch (error) {
      console.log(
        chalk.red("Error: Could not execute commit generation script")
      );
    }
  },

  "/comments": async () => {
    rl.question(chalk.cyan("Enter the file path to comment: "), (filePath) => {
      if (filePath) {
        try {
          execSync(`node ./scripts/generate-comments/index.js ${filePath}`, {
            stdio: "inherit",
          });
        } catch (error) {
          console.log(
            chalk.red("Error: Could not execute comments generation script")
          );
        }
      }
      rl.prompt();
    });
  },

  "/readme": async () => {
    rl.question(chalk.cyan("Enter the project path: "), (projectPath) => {
      if (projectPath) {
        try {
          execSync(`node ./scripts/generate-readme/index.js ${projectPath}`, {
            stdio: "inherit",
          });
        } catch (error) {
          console.log(
            chalk.red("Error: Could not execute readme generation script")
          );
        }
      }
      rl.prompt();
    });
  },

  "/exit": () => {
    console.log(chalk.gray("\nExiting...\n"));
    rl.close();
    process.exit(0);
  },
};

// --- Обробка команд ---
rl.prompt();
rl.on("line", (line) => {
  const input = line.trim();

  // Додаємо slash якщо користувач його не ввів
  const command = input.startsWith("/") ? input : `/${input}`;

  if (commands[command]) {
    commands[command]();
  } else if (input === "") {
    // Просто показуємо промпт знову для порожніх рядків
    rl.prompt();
    return;
  } else {
    console.log(
      chalk.red(`Unknown command: ${input}. Type /help for available commands`)
    );
  }

  // Не показуємо промпт відразу для команд, які очікують додатковий ввід
  if (!["comments", "readme"].includes(command.substring(1))) {
    rl.prompt();
  }
});

// Обробка Ctrl+C
rl.on("SIGINT", () => {
  // Скидаємо колір перед виходом
  process.stdout.write("\x1b[0m");
  console.log(chalk.gray("\n\nExiting...\n"));
  rl.close();
  process.exit(0);
});
