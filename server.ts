import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", appName: "한빛 한글 샘" });
  });

  // AI Tutor Feedback API endpoint
  app.post("/api/gemini/feedback", async (req, res) => {
    try {
      const {
        studentName = "친구",
        targetWord = "한글",
        userSpeech = "",
        actionType = "speech_practice", // "speech_practice" | "handwriting" | "quiz" | "free_talk"
        apiKey: clientApiKey,
      } = req.body;

      const apiKey = process.env.GEMINI_API_KEY || clientApiKey;

      if (!apiKey) {
        return res.status(400).json({
          error: "API_KEY_MISSING",
          message: "Gemini API 키가 설정되지 않았습니다. [설정] 메뉴에서 API 키를 등록하거나 서버 환경 변수를 확인해주세요.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      let systemInstruction = `너는 초등학교 저학년 한글 미해득 및 다문화 학생을 가르치는 따뜻하고 다정한 초등 한글 선생님 '한글 샘 AI'야.
아이들의 이름을 친근하게 부르며 매우 긍정적이고 아낌없는 칭찬을 해줘.
답변은 반드시 초등 저학년도 바로 이해할 수 있는 아주 쉽고 짧은 2~3문장 내외로 작성해.
음성 합성(TTS)으로 읽어줄 테니 특수문자나 복잡한 표기는 자제하고 친근한 말투(~했어요!, ~했네요!, 아주 멋져요! 🌟)로 말해줘.`;

      let prompt = "";

      if (actionType === "speech_practice") {
        prompt = `학생 이름: ${studentName}
연습한 글자/단어: '${targetWord}'
학생이 말한 음성 인지 결과: '${userSpeech || targetWord}'

학생이 '${targetWord}' 소리를 내어 연습했습니다.
선생님처럼 다정하게 학생 이름('${studentName}')을 부르며 칭찬해주고, 발음을 잘했다고 응원해주는 짧고 기분 좋은 2문장 피드백을 적어줘.`;
      } else if (actionType === "handwriting") {
        prompt = `학생 이름: ${studentName}
직접 써본 글자: '${targetWord}'

학생이 캔버스에 '${targetWord}' 글자를 예쁘게 따라 썼습니다.
선생님으로서 학생 이름을 부르며 손가락으로 차근차근 잘 따라 썼다고 크게 칭찬해주고 참 잘했어요 스티커를 주는 칭찬 메시지 2문장을 적어줘.`;
      } else if (actionType === "quiz") {
        prompt = `학생 이름: ${studentName}
퀴즈 단어: '${targetWord}'
정답 여부: 성공

학생이 한글 퀴즈에서 '${targetWord}' 정답을 맞혔습니다!
학생 이름을 부르며 자신감을 북돋아 주는 신나는 칭찬 메시지를 2문장으로 적어줘.`;
      } else {
        prompt = `학생 이름: ${studentName}
학생이 말한 이야기: '${userSpeech}'

학생의 이야기에 다정하게 호응해주고 한글 공부를 재미있게 계속할 수 있도록 격려해주는 따뜻한 피드백 2문장을 작성해줘.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const feedbackText = response.text?.trim() || `${studentName} 학생, 정말 잘했어요! 칭찬 스티커 하나 꾹! 🌟`;

      res.json({
        success: true,
        feedback: feedbackText,
      });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({
        error: "AI_GENERATION_FAILED",
        message: err.message || "AI 피드백 생성 중 오류가 발생했습니다.",
        fallbackFeedback: `${req.body.studentName || "친구"} 학생, 정말 잘했어요! 참 잘했어요 스티커를 받으세요! 🌟`,
      });
    }
  });

  // Vite middleware for dev / express static for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[한빛 한글 샘] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
