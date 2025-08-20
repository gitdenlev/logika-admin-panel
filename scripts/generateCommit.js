import ollama from "ollama";
import { execSync } from "child_process";

async function generateCommitMessage(diffText) {
  const prompt = `Create a short and clear git commit message for the following changes:\n${diffText}`;
  const response = await ollama.chat({
    model: "llama3.2:latest", // exact model name from 'ollama list'
    messages: [{ role: "user", content: prompt }],
  });
  return response.message.content.trim();
}

async function main() {
  try {
    const realDiff = execSync("git diff --staged").toString().trim();

    if (!realDiff) {
      console.log(
        "No changes to commit. Please stage your changes first (git add)."
      );
      return;
    }

    const commitMessage = await generateCommitMessage(realDiff);

    execSync("git add .");

    console.log(`Generated commit message:\n${commitMessage}`);

    execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

main();