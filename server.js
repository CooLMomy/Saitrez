import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: userMessage }]
            })
        });

        const data = await response.json();

        // Проверка: пришел ли ответ от OpenAI
        if (data.choices && data.choices[0]) {
            res.json({ reply: data.choices[0].message.content });
        } else {
            console.error("Ошибка OpenAI:", data);
            res.status(500).json({ reply: "Ошибка от API нейросети" });
        }

    } catch (error) {
        console.error("Ошибка сервера:", error);
        res.status(500).json({ reply: "Произошла ошибка на сервере" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server started on port ${PORT}`));
