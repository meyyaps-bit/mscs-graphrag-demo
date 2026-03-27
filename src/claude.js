import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function askLLM(prompt) {
  const response = await client.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [
      { role: "system", content: "You are a helpful assistant that generates Cypher queries for Neo4j." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  });

  return response.choices[0].message.content;
}
