
import React from 'react';
import { ChatMessage } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isBot = message.sender === 'bot';
  const isSystem = message.sender === 'system';

  const bubbleClasses = React.useMemo(() => {
    let base = "p-3 rounded-xl max-w-lg shadow-md break-words ";
    if (isUser) {
      base += "bg-pink-300 text-pink-900 ml-auto rounded-br-none";
    } else if (isBot) {
      base += "bg-white text-gray-800 mr-auto rounded-bl-none border border-pink-200";
    } else { // System messages (errors, API key missing)
      base += "bg-red-100 text-red-700 mr-auto text-center w-full rounded-lg";
    }
    return base;
  }, [isUser, isBot]);

  const wrapperClasses = React.useMemo(() => {
    let base = "flex mb-3 ";
    if (isUser) {
      base += "justify-end";
    } else {
      base += "justify-start";
    }
    return base;
  }, [isUser]);

  const Avatar: React.FC<{ sender: 'user' | 'bot' | 'system' }> = ({ sender }) => {
    if (sender === 'user') {
      return <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white text-sm font-bold ml-2 order-2">你</div>;
    }
    if (sender === 'bot') {
      // Simple bot avatar - could be an image or SVG
      return <div className="w-8 h-8 rounded-full bg-rose-400 flex items-center justify-center text-white text-xl mr-2 order-1">🐰</div>;
    }
    return null; // No avatar for system messages
  };


  return (
    <div className={wrapperClasses}>
      {isBot && <Avatar sender="bot" />}
      <div className={`${bubbleClasses} ${isUser ? 'order-1' : (isBot ? 'order-2' : 'order-1 w-full')}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
      {isUser && <Avatar sender="user" />}
    </div>
  );
};
