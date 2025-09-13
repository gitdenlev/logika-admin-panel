import fs from "fs/promises";
import ollama from "ollama";
import chalk from "chalk";
import ora from "ora";
import path from "path";

// Файли та папки для ігнорування
const IGNORE_PATTERNS = [
  ".git",
  ".gitignore",
  "node_modules",
  ".nuxt",
  ".output",
  "dist",
  "build",
  ".env",
  ".env.local",
  ".DS_Store",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  ".vscode",
  ".idea",
  "coverage",
  "*.log",
];

// Розширення файлів, які варто аналізувати
const ANALYZE_EXTENSIONS = [
  ".js",
  ".ts",
  ".vue",
  ".jsx",
  ".tsx",
  ".json",
  ".md",
  ".yml",
  ".yaml",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".html",
  ".py",
  ".go",
  ".rs",
  ".php",
];

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

function shouldIgnore(fileName) {
  return IGNORE_PATTERNS.some(
    (pattern) => fileName.includes(pattern) || fileName.startsWith(".")
  );
}

function shouldAnalyze(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return ANALYZE_EXTENSIONS.includes(ext);
}

async function analyzeDirectory(dirPath, maxDepth = 3, currentDepth = 0) {
  let structure = {};
  let contentToAnalyze = "";
  let fileCount = 0;
  const MAX_FILES = options.maxFiles || 50; // Обмеження кількості файлів
  const MAX_FILE_SIZE = 10000; // Обмеження розміру файлу (символи)

  if (currentDepth >= maxDepth || fileCount >= MAX_FILES)
    return { structure, contentToAnalyze };

  try {
    const items = await fs.readdir(dirPath);

    for (const item of items) {
      if (fileCount >= MAX_FILES) break;

      if (shouldIgnore(item)) continue;

      const itemPath = path.join(dirPath, item);
      const stats = await fs.stat(itemPath);

      if (stats.isDirectory()) {
        structure[item] = "directory";
        const subResult = await analyzeDirectory(
          itemPath,
          maxDepth,
          currentDepth + 1
        );
        contentToAnalyze += subResult.contentToAnalyze;
        fileCount += Object.keys(subResult.structure).length;
      } else if (stats.isFile() && shouldAnalyze(item)) {
        structure[item] = "file";

        try {
          const fileContent = await fs.readFile(itemPath, "utf-8");
          const truncatedContent =
            fileContent.length > MAX_FILE_SIZE
              ? fileContent.substring(0, MAX_FILE_SIZE) + "\n... (truncated)"
              : fileContent;

          contentToAnalyze += `--- ${path.relative(dirPath, itemPath)} ---\n`;
          contentToAnalyze += truncatedContent;
          contentToAnalyze += "\n\n";
          fileCount++;
        } catch (err) {
          // Ігноруємо бінарні файли або файли з помилками читання
        }
      }
    }
  } catch (error) {
    console.warn(chalk.yellow(`⚠️  Could not read directory: ${dirPath}`));
  }

  return { structure, contentToAnalyze };
}

function generateProjectOverview(structure) {
  let overview = "📁 Project Structure Overview:\n";

  function addToOverview(obj, indent = "") {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object") {
        overview += `${indent}📁 ${key}/\n`;
        addToOverview(value, indent + "  ");
      } else {
        const emoji = key.endsWith(".vue")
          ? "🎨"
          : key.endsWith(".js") || key.endsWith(".ts")
          ? "⚡"
          : key.endsWith(".json")
          ? "⚙️"
          : key.endsWith(".md")
          ? "📝"
          : "📄";
        overview += `${indent}${emoji} ${key}\n`;
      }
    }
  }

  addToOverview(structure);
  return overview + "\n";
}

async function generateReadme(projectContent, projectPath) {
  const basePrompt = await loadPrompt("./scripts/generate-readme/CONTEXT.md");

  // Додаємо контекст про шлях проекту
  const projectName = path.basename(projectPath);
  const contextInfo = `
🎯 Project Analysis Context:
- Project Name: ${projectName}
- Analysis Path: ${projectPath}
- Generated: ${new Date().toLocaleDateString()}

`;

  const prompt = `${basePrompt}\n\n${contextInfo}${projectContent}`;

  const response = await ollama.chat({
    model: "gemma3:4b",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    options: {
      temperature: 0.7,
      top_p: 0.9,
    },
  });

  return response.message.content.trim();
}

async function main() {
  let projectPath = process.argv[2];
  if (!projectPath) {
    console.log(
      chalk.hex("#DBA4FF")(
        "⚠️  Please provide a project path to generate README.md for."
      )
    );
    console.log(
      chalk.hex("#DBA4FF")(
        "📖 Example: npm run readme @/app/pages/student/dashboard"
      )
    );
    console.log(
      chalk.hex("#DBA4FF")("📖 Example: npm run readme ./src/components")
    );
    return;
  }

  if (projectPath.startsWith("@/")) {
    const baseDir = path.resolve(process.cwd(), "./");
    projectPath = path.join(baseDir, projectPath.slice(2));
  }

  const spinner = ora(
    chalk.hex("#DBA4FF")(
      "🚀 Analyzing project structure and generating README.md..."
    )
  ).start();

  try {
    let contentToAnalyze = "";
    let projectStructure = {};
    const stats = await fs.stat(projectPath);

    if (stats.isDirectory()) {
      spinner.text = chalk.hex("#DBA4FF")("📂 Scanning directory structure...");
      const result = await analyzeDirectory(projectPath);
      contentToAnalyze = result.contentToAnalyze;
      projectStructure = result.structure;

      // Додаємо огляд структури проекту
      const structureOverview = generateProjectOverview(projectStructure);
      contentToAnalyze = structureOverview + "\n" + contentToAnalyze;
    } else if (stats.isFile()) {
      const fileName = path.basename(projectPath);
      if (shouldAnalyze(fileName)) {
        contentToAnalyze = await fs.readFile(projectPath, "utf-8");
        contentToAnalyze = `--- ${fileName} ---\n${contentToAnalyze}`;
      } else {
        throw new Error("File type not supported for analysis.");
      }
    } else {
      throw new Error("Provided path is neither a file nor a directory.");
    }

    if (!contentToAnalyze.trim()) {
      throw new Error("No analyzable content found in the specified path.");
    }

    spinner.text = chalk.hex("#DBA4FF")(
      "🤖 Generating README content with AI..."
    );
    const readmeContent = await generateReadme(contentToAnalyze, projectPath);

    const outputFileName = stats.isDirectory()
      ? path.join(projectPath, "README.md")
      : path.join(path.dirname(projectPath), "README.md");

    await fs.writeFile(outputFileName, readmeContent, "utf-8");

    spinner.succeed(
      chalk.hex("#DBA4FF")("✅ README.md successfully generated!")
    );

    console.log("\n" + chalk.hex("#DBA4FF")("📄 README.md saved to: "));
    console.log(chalk.hex("#9CA3AF")("   " + outputFileName));

    console.log("\n" + chalk.hex("#DBA4FF")("📊 Analysis Summary:"));
    console.log(
      chalk.hex("#9CA3AF")(
        `   📁 Files analyzed: ${Object.keys(projectStructure).length || 1}`
      )
    );
    console.log(
      chalk.hex("#9CA3AF")(
        `   📝 Content length: ${contentToAnalyze.length} characters`
      )
    );

    if (options.verbose) {
      console.log("\n" + chalk.hex("#DBA4FF")("🔍 Verbose Info:"));
      console.log(chalk.hex("#9CA3AF")(`   🤖 Model used: ${options.model}`));
      console.log(
        chalk.hex("#9CA3AF")(`   📊 Max files limit: ${options.maxFiles}`)
      );
    }
  } catch (error) {
    spinner.fail(chalk.hex("#FF6B6B")("💥 Generation failed!"));

    console.error("\n" + chalk.hex("#FF6B6B").bold("❌ Error details:"));
    console.error(chalk.hex("#FF6B6B")("   " + error.message));

    if (
      error.message.includes("connection") ||
      error.message.includes("ollama")
    ) {
      console.log("\n" + chalk.hex("#FFA726")("💡 Possible solutions:"));
      console.log(
        chalk.hex("#9CA3AF")("   • Make sure Ollama is running: ollama serve")
      );
      console.log(
        chalk.hex("#9CA3AF")(
          "   • Check if gemma3:4b model is installed: ollama list"
        )
      );
      console.log(
        chalk.hex("#9CA3AF")("   • Install the model: ollama pull gemma3:4b")
      );
    }
  }
}

main();
