import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        // ВСТАВЬ СВОЮ ССЫЛКУ ИЗ NGROK НИЖЕ
        // ВАЖНО: оставь /v1/chat/completions в конце пути
        const NGROK_URL = "https://becalmingly-unsaline-aaliyah.ngrok-free.dev";

        const response = await fetch(NGROK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Эта строка нужна, чтобы ngrok не показывал страницу-заглушку
                "ngrok-skip-browser-warning": "true" 
            },
            body: JSON.stringify({
                model: "local-model", // LM Studio поймет любой текст здесь
                messages: [
                    { role: "user", content: userMessage }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            res.json({ reply: data.choices[0].message.content });
        } else {
            res.status(500).json({ reply: "Нейросеть молчит, проверь LM Studio" });
        }

    } catch (error) {
        console.error("Ошибка:", error);
        res.status(500).json({ reply: "Не удалось достучаться до домашнего ПК" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server started on port ${PORT}`));
