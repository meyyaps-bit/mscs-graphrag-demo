import { runCypher } from "./neo4j.js";
import { askLLM } from "./claude.js";

export async function graphRAG(question) {
const cypherPrompt = `
You are an expert Neo4j Cypher generator.

Use ONLY the graph schema below.
Never invent new labels, properties, or relationship types.
Return ONLY Cypher. No explanation. No markdown. No code fences.

GRAPH SCHEMA
------------
Nodes:
- Programme {name}
- Module {name}
- Staff {name, role}

Relationships:
- (Programme)-[:HAS_MODULE]->(Module)
- (Module)-[:TAUGHT_BY]->(Staff)
- (Programme)-[:LED_BY]->(Staff)

RULES
-----
1. If the user refers to "MSc", interpret it as:
   Programme {name: "MSc Data & AI"}

2. Use EXACT labels and relationship types from the schema.

3. Always return a single valid Cypher query.

4. If the question cannot be answered with this schema,
   return a Cypher query that returns no rows:
   MATCH (n) WHERE false RETURN n

USER QUESTION:
"${question}"
`;

  const raw = (await askLLM(cypherPrompt)).trim();

  const cypher = raw
    .replace(/```cypher/gi, "")
    .replace(/```/g, "")
    .trim();

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
  return await askLLM(answerPrompt);
}
