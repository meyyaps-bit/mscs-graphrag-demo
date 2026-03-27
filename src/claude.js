import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function askClaude(prompt) {
  const res = await client.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }]
  });
  return res.content[0].text;
}
