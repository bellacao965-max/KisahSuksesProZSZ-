// ================= AI CONFIG =================
import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const MODEL = process.env.MODEL || "llama-3.1-8b-instant";

if (!GROQ_API_KEY) {
  console.log("⚠️ GROQ_API_KEY tidak ditemukan! AI tidak akan bekerja.");
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

// =================================================
//  ENDPOINT AI 
// =================================================
app.post("/api/ai", async (req, res) => {
  try {
    const userMessage = req.body.message || "";

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: userMessage }],
      model: MODEL,
    });

    res.json({
      reply: completion.choices?.[0]?.message?.content || "(no reply)",
    });
  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ error: "AI processing failed" });
  }
});
// =================================================
