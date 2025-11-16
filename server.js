import express from "express";
import Groq from "groq-sdk";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// FIX PATH
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// SERVE FRONTEND
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// GROQ CLIENT
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// ROUTE API
app.post("/api/ai", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are Kisah Sukses Pro AI assistant" },
        { role: "user", content: message }
      ],
      model: process.env.MODEL || "llama-3.1-8b-instant"
    });

    res.json({
      reply: completion.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI error" });
  }
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
