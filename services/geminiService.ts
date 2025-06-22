
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeminiApiResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set in environment variables.");
  // App.tsx will handle UI for missing key
}

// Initialize with API_KEY. The check in App.tsx and callGeminiApi will prevent calls if it's actually missing.
const ai = new GoogleGenAI({ apiKey: API_KEY || "fallback_api_key_for_initialization" }); 

const systemInstruction = `你是一個親切可愛的音樂推薦聊天機器人，叫做「心情點唱機」。
你的目標是根據用戶的心情，推薦三首中文歌曲 (可以是國語或粵語流行歌曲)。
請用溫暖、療癒的語氣和用戶對話，並在回覆中加入可愛的 emoji (例如 😊💖✨🎶)。
分析用戶輸入的情緒，主要歸類為以下幾種主要情緒之一：開心、興奮、放鬆、平靜、浪漫、想念、懷舊、難過、憂鬱、孤單、憤怒、釋放壓力、需要勇氣、需要動力。如果用戶的描述不明顯，可以選擇一個最接近的。

根據分析出的情緒，推薦三首歌曲。每首歌包含：
1.  \`name\`: 歌名
2.  \`artist\`: 歌手
3.  \`description\`: 一句簡短的推薦理由（約15-30字，描述歌曲如何符合當前心情或歌曲的意境）
4.  \`youtube_search_query\`: 一個適合在 YouTube 上搜尋該歌曲的查詢字串 (格式：\`歌名 歌手\`，例如：\`告五人 披星戴月的想你\`)。

回覆格式**必須是** JSON，結構如下：
{
  "mood_detected": "分析出的主要情緒 (例如：開心)",
  "bot_response": "給用戶的溫暖回應，包含 emoji，鼓勵用戶聆聽歌曲並可以繼續互動。",
  "songs": [
    { "name": "歌名1", "artist": "歌手1", "description": "推薦理由1", "youtube_search_query": "歌名1 歌手1" },
    { "name": "歌名2", "artist": "歌手2", "description": "推薦理由2", "youtube_search_query": "歌名2 歌手2" },
    { "name": "歌名3", "artist": "歌手3", "description": "推薦理由3", "youtube_search_query": "歌名3 歌手3" }
  ]
}

**重要 JSON 字串規則：** 當你生成 JSON 時，所有字串值 (例如 \`bot_response\`, \`name\`, \`artist\`, \`description\`, \`youtube_search_query\`) 都必須是合法的 JSON 字串。這表示：
- 字串中的任何雙引號 (\`"\`) 都必須被轉義成 (\`\\"\`)。
- 字串中的任何反斜線 (\`\\\`) 都必須被轉義成 (\`\\\\\\\`)。
- 字串中的任何換行符都必須表示為 (\`\\n\`)，而不是實際的換行。
請嚴格遵守此規則以確保 JSON 的有效性。

請確保 JSON 格式正確無誤。歌曲推薦盡量多元，避免重複。如果用戶的輸入不像是表達心情，而是閒聊或問候，可以友善地回應並引導他們分享心情來點歌。
例如，用戶說「你好」，你可以回覆「哈囉！今天心情怎麼樣呢？快來點歌吧！😊」。這時 songs 陣列可以為空。
`;

export const callGeminiApi = async (userInput: string): Promise<GeminiApiResponse> => {
  if (!API_KEY) {
    console.error("API_KEY is not configured in callGeminiApi.");
    throw new Error("API_KEY is not configured. Please set the API_KEY environment variable.");
  }

  let jsonStr = ""; // Initialize jsonStr to ensure it's available in catch blocks if needed
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: [{ role: "user", parts: [{text: userInput}] }],
      config: {
        systemInstruction: { role: "system", parts: [{text: systemInstruction}]},
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    jsonStr = response.text.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    let parsedData: GeminiApiResponse;
    try {
      parsedData = JSON.parse(jsonStr) as GeminiApiResponse;
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini. Raw string attempting to parse:", jsonStr);
      console.error("Parsing error details:", parseError);
      let detailedErrorMessage = "AI 回傳的資料格式有誤，無法解析。";
      if (parseError instanceof SyntaxError && parseError.message) {
        detailedErrorMessage += ` 技術細節: ${parseError.message}`;
      }
      throw new Error(detailedErrorMessage); 
    }

    if (!parsedData.bot_response || !parsedData.mood_detected) {
        console.warn("Gemini response (parsed successfully) missing essential fields (bot_response or mood_detected). Raw JSON string:", jsonStr);
        if (!parsedData.songs) parsedData.songs = [];
        parsedData.bot_response = parsedData.bot_response || "我好像有點不太確定怎麼回應耶，可以再試一次嗎？😊";
        parsedData.mood_detected = parsedData.mood_detected || "未知";
    } else {
         if (!parsedData.songs) {
            console.warn("Gemini response (parsed successfully) missing 'songs' array. Initializing to empty. Raw JSON string:", jsonStr);
            parsedData.songs = [];
        }
    }
    
    parsedData.songs = parsedData.songs.map(song => ({
      ...song,
      youtube_search_query: song.youtube_search_query || `${song.name} ${song.artist}`.trim()
    }));
    
    return parsedData;

  } catch (error) {
    // Log additional context if the error is not the specific JSON parsing error (which already logs jsonStr)
    if (!(error instanceof Error && error.message.startsWith("AI 回傳的資料格式有誤"))) {
        if (jsonStr) { // Log jsonStr if it was populated and the error is different
            console.error("Error in callGeminiApi. Raw response text (if available and not a parse error):", jsonStr);
        }
    }
    console.error("Overall error in callGeminiApi:", error);

    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
             // App.tsx checks for "API key not valid" to show a user-friendly message
             throw new Error("API key not valid. Please pass a valid API key. (SERVICE_ERROR)");
        }
        throw error; // Re-throw other errors (like the custom JSON parse error, or other Gemini errors)
    }
    // Fallback for non-Error objects being thrown
    throw new Error("AI 服務發生未知錯誤，請稍後再試。");
  }
};
