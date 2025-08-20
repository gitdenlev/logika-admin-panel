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

function divider() {
  console.log("\n----------------------------------------\n");
}

function sanitizeMessage(raw) {
  return raw.split("\n")[0].replace(/^"+|"+$/g, "");
}

async function main() {
  try {
    const realDiff = execSync("git diff --staged").toString().trim();

    if (!realDiff) {
      divider();
      console.log("⚠️  No staged changes. Use 'git add' first.");
      divider();
      return;
    }

    console.log("🤖 Generating commit message...");
    const rawCommitMessage = await generateCommitMessage(realDiff);
    const commitMessage = sanitizeMessage(rawCommitMessage);

    divider();
    console.log("📝 Full AI suggestion:\n");
    console.log(rawCommitMessage);
    divider();
    console.log("✨ Commit message to be used:\n");
    console.log(`   "${commitMessage}"`);
    divider();

    execSync("git add .");
    execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });

    console.log("✅ Commit created successfully!");
    divider();
  } catch (error) {
    divider();
    console.error("💥 Error:", error.message);
    divider();
  }
}

main();
