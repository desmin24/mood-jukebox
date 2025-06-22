
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, Song, CharacterMood, GeminiApiResponse } from './types';
import { ChatBubble } from './components/ChatBubble';
import { SongCard } from './components/SongCard';
import { MoodCharacter } from './components/MoodCharacter';
import { InputBar } from './components/InputBar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { callGeminiApi } from './services/geminiService';

const App: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentMood, setCurrentMood] = useState<CharacterMood>(CharacterMood.IDLE);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);
  
  useEffect(() => {
    // Check for API key on mount
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      setChatMessages(prev => [...prev, {
        id: 'system-apikey-error',
        sender: 'system',
        text: '糟糕！API Key好像不見了，我暫時沒辦法提供服務 😭 請確認環境變數設定。',
        timestamp: Date.now()
      }]);
      setCurrentMood(CharacterMood.SAD);
    } else {
      setChatMessages([{
        id: 'initial-greeting',
        sender: 'bot',
        text: '哈囉！我是心情點唱機 🎶 今天心情怎麼樣呢？快跟我說說，讓我為你推薦好聽的歌吧！💖',
        timestamp: Date.now()
      }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapDetectedMoodToCharacterMood = (detectedMood: string): CharacterMood => {
    const moodLower = detectedMood.toLowerCase();
    if (['開心', '興奮', 'happy', 'excited'].some(m => moodLower.includes(m))) return CharacterMood.HAPPY;
    if (['難過', '憂鬱', '孤單', 'sad', 'depressed', 'lonely'].some(m => moodLower.includes(m))) return CharacterMood.SAD;
    if (['放鬆', '平靜', 'relax', 'calm'].some(m => moodLower.includes(m))) return CharacterMood.IDLE;
    if (['浪漫', '想念', '懷舊', 'romantic', 'missing', 'nostalgic'].some(m => moodLower.includes(m))) return CharacterMood.THINKING;
    if (isLoading) return CharacterMood.LOADING; // Should be handled by isLoading state directly
    return CharacterMood.SINGING; // Default for other positive/music related moods
  };

  const handleSendMessage = useCallback(async () => {
    if (userInput.trim() === '' || isLoading || apiKeyMissing) return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userInput,
      timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);
    setCurrentMood(CharacterMood.LOADING);

    try {
      const geminiResponse: GeminiApiResponse = await callGeminiApi(userInput);
      
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: geminiResponse.bot_response,
        songs: geminiResponse.songs,
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, botMessage]);
      setCurrentMood(mapDetectedMoodToCharacterMood(geminiResponse.mood_detected));

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessageText = error instanceof Error && error.message.includes("API key not valid")
        ? 'API Key 驗證失敗，請檢查金鑰是否正確。🔑'
        : '哎呀，我好像有點秀逗了... 😵‍💫 請稍後再試一次，或者換個方式問我吧！';
      
      setChatMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        sender: 'system',
        text: errorMessageText,
        timestamp: Date.now()
      }]);
      setCurrentMood(CharacterMood.SAD);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isLoading, apiKeyMissing]);

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-pink-100 shadow-2xl rounded-lg overflow-hidden">
      <header className="bg-pink-400 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <MoodCharacter mood={isLoading ? CharacterMood.LOADING : currentMood} className="w-16 h-16 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">心情點唱機 🎶</h1>
            <p className="text-sm opacity-90">用你的心情，點亮音樂宇宙 ✨</p>
          </div>
        </div>
      </header>

      {apiKeyMissing && (
        <div className="p-4 bg-red-100 text-red-700 text-center">
          <strong>重要提示：</strong> 未偵測到 API Key。請確保已在環境變數中設定 <code>API_KEY</code>。
        </div>
      )}

      <main className="flex-grow overflow-y-auto p-4 space-y-4 bg-pink-50">
        {chatMessages.map((msg, index) => {
  console.log("目前 msg.id：", msg.id);  // ← 就加在這裡！

  return (
    <div key={`msg-${msg.id}-${index}`}>
      <ChatBubble message={msg} />
      {msg.sender === 'bot' && msg.songs && msg.songs.length > 0 && (
        <div className="mt-2 ml-10 space-y-3">
          {msg.songs.map((song, sIndex) => (
            <SongCard key={`${msg.id}-song-${sIndex}`} song={song} />
          ))}
        </div>
      )}
    </div>
  );
})}


        {isLoading && chatMessages.length > 0 && chatMessages[chatMessages.length-1].sender === 'user' && (
           <div className="flex justify-start">
             <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow mr-auto max-w-xs lg:max-w-md">
                <LoadingSpinner />
                <p className="text-sm text-pink-600">兔兔點唱機正在為您選歌...🐰🎶</p>
            </div>
           </div>
        )}
        <div ref={chatEndRef} />
      </main>

      <footer className="p-4 bg-pink-100 border-t border-pink-200">
        <InputBar
          value={userInput}
          onChange={setUserInput}
          onSend={handleSendMessage}
          disabled={isLoading || apiKeyMissing}
        />
      </footer>
    </div>
  );
};

export default App;
