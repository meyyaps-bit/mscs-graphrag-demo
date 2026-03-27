import { runCypher } from "./neo4j.js";
import { askClaude } from "./claude.js";

export async function graphRAG(question) {
  const cypherPrompt = `
You generate Cypher for Neo4j Aura.
Return ONLY Cypher, no explanation.

User question: "${question}"
Graph is about an MSc programme, modules, and staff.
`;

  const cypher = (await askClaude(cypherPrompt)).trim();
  console.log("Cypher:", cypher);

  const data = await runCypher(cypher);

  const answerPrompt = `
You are a helpful assistant.
User question:
${question}

Graph data (JSON):
${JSON.stringify(data, null, 2)}

Answer clearly using ONLY this data.
`;
  return await askClaude(answerPrompt);
}
