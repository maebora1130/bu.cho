import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'fake-key' });

// API Routes
app.post('/api/ai/query', async (req, res) => {
  const { query, contextData } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    return res.json({ answer: "[Mock Response] API Key가 설정되지 않았습니다. 현재 " + query + "에 대한 데이터를 분석 중입니다..." });
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are a production management expert for a defense manufacturing company (Ops-Insight Pilot). 
      Analyze the following production data and answer the user's query: "${query}"
      
      Current Data Context:
      ${JSON.stringify(contextData)}
      
      Instructions:
      1. Answer in Korean.
      2. Be professional, direct, and data-driven.
      3. If there is a delay or critical issue, suggest potential actions based on industrial engineering principles.
      4. Format the response cleanly using markdown.`
    });
    
    res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'AI Query failed: ' + error.message });
  }
});

app.post('/api/ai/report', async (req, res) => {
  const { performanceData } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ report: "### [Mock Report]\n- 일일 생산 실적: 목표 대비 92% 달성\n- 주요 이슈: A라인 볼트 수급 지연\n- 조치 사항: 자재팀 협의 완료" });
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a professional daily production performance report based on this data:
      ${JSON.stringify(performanceData)}
      
      Report Structure:
      1. Summary (Overall achievement rate, major KPIs)
      2. Issues & Bottlenecks (Analyze root causes for any delays)
      3. Recommendations & Action Items for the next shift.
      
      Language: Korean. Keep it concise but insightful. Use professional manufacturing terminology.`
    });
    
    res.json({ report: response.text });
  } catch (error: any) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Report generation failed: ' + error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
