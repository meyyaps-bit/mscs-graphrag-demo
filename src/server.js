import express from "express";
import { graphRAG } from "./retriever.js";
import "dotenv/config";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { question } = req.body;
  try {
    const answer = await graphRAG(question);
    res.json({ answer });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal error" });
  }
});

app.get("/", (req, res) => {
  res.send("GraphRAG demo is running.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
