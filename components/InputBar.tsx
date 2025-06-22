
import React from 'react';

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ value, onChange, onSend, disabled }) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !disabled) {
      onSend();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={disabled ? "兔兔思考中..." : "說說你現在的心情吧... (例如：今天好開心！)"}
        disabled={disabled}
        className="flex-grow p-3 border border-pink-300 rounded-full focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-shadow duration-200 shadow-sm"
      />
      <button
        onClick={onSend}
        disabled={disabled || value.trim() === ''}
        className="bg-pink-400 text-white p-3 rounded-full hover:bg-pink-500 disabled:bg-pink-200 disabled:cursor-not-allowed transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
        aria-label="傳送訊息"
      >
        <i className="fas fa-paper-plane"></i>
      </button>
    </div>
  );
};
