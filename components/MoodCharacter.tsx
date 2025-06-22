
import React from 'react';
import { CharacterMood } from '../types';

interface MoodCharacterProps {
  mood: CharacterMood;
  className?: string;
}

// Simple SVG representations for moods
const RabbitIdle: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="70" r="25" fill="#FFC0CB" /> {/* Body */}
    <ellipse cx="50" cy="40" rx="18" ry="22" fill="#FFC0CB" /> {/* Head */}
    <ellipse cx="35" cy="15" rx="8" ry="15" fill="#FFC0CB" transform="rotate(-15 35 15)" /> {/* Left Ear */}
    <ellipse cx="65" cy="15" rx="8" ry="15" fill="#FFC0CB" transform="rotate(15 65 15)" /> {/* Right Ear */}
    <circle cx="43" cy="38" r="3" fill="#2c3e50" /> {/* Left Eye */}
    <circle cx="57" cy="38" r="3" fill="#2c3e50" /> {/* Right Eye */}
    <path d="M45 48 Q50 52 55 48" stroke="#E74C3C" strokeWidth="2" fill="none" /> {/* Mouth */}
  </svg>
);

const RabbitHappy: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="70" r="25" fill="#FFC0CB" />
    <ellipse cx="50" cy="40" rx="18" ry="22" fill="#FFC0CB" />
    <ellipse cx="35" cy="12" rx="8" ry="18" fill="#FFC0CB" transform="rotate(-25 35 12)" /> {/* Left Ear perked */}
    <ellipse cx="65" cy="12" rx="8" ry="18" fill="#FFC0CB" transform="rotate(25 65 12)" /> {/* Right Ear perked */}
    <path d="M40 36 Q43 33 46 36" stroke="#2c3e50" strokeWidth="2.5" fill="none" /> {/* Left Eye happy */}
    <path d="M54 36 Q57 33 60 36" stroke="#2c3e50" strokeWidth="2.5" fill="none" /> {/* Right Eye happy */}
    <path d="M42 48 Q50 55 58 48" stroke="#E74C3C" strokeWidth="2.5" fill="none" strokeLinecap="round" /> {/* Mouth happy */}
     {/* Sparkles */}
    <path d="M25 30 L 28 27 L 31 30 L 28 33 Z" fill="#FFD700"/>
    <path d="M75 30 L 72 27 L 69 30 L 72 33 Z" fill="#FFD700"/>
  </svg>
);

const RabbitSad: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="70" r="25" fill="#D1C4E9" /> {/* Sadder color */}
    <ellipse cx="50" cy="40" rx="18" ry="22" fill="#D1C4E9" />
    <ellipse cx="38" cy="20" rx="7" ry="16" fill="#D1C4E9" transform="rotate(-45 38 20)" /> {/* Left Ear droopy */}
    <ellipse cx="62" cy="20" rx="7" ry="16" fill="#D1C4E9" transform="rotate(45 62 20)" /> {/* Right Ear droopy */}
    <circle cx="43" cy="40" r="3" fill="#5E6C84" /> {/* Left Eye */}
    <circle cx="57" cy="40" r="3" fill="#5E6C84" /> {/* Right Eye */}
    <path d="M45 50 Q50 46 55 50" stroke="#7986CB" strokeWidth="2" fill="none" /> {/* Mouth sad */}
    {/* Tear drop */}
    <path d="M43 45 Q43 50 40 50 Q43 50 43 45" fill="#A2D0F0"/>
  </svg>
);

const RabbitThinking: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="70" r="25" fill="#FFC0CB" />
    <ellipse cx="50" cy="40" rx="18" ry="22" fill="#FFC0CB" />
    <ellipse cx="35" cy="15" rx="8" ry="15" fill="#FFC0CB" transform="rotate(-10 35 15)" />
    <ellipse cx="65" cy="15" rx="8" ry="15" fill="#FFC0CB" transform="rotate(20 65 15)" /> {/* One ear slightly up */}
    <circle cx="43" cy="38" r="3" fill="#2c3e50" />
    <circle cx="57" cy="38" r="3" fill="#2c3e50" />
    <path d="M48 49 Q50 50 52 49" stroke="#E74C3C" strokeWidth="2" fill="none" /> {/* Mouth neutral */}
    {/* Thinking bubble */}
    <circle cx="75" cy="25" r="5" fill="#E0E0E0" />
    <circle cx="80" cy="18" r="3" fill="#E0E0E0" />
  </svg>
);

const RabbitSinging: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="70" r="25" fill="#FFC0CB" />
    <ellipse cx="50" cy="40" rx="18" ry="22" fill="#FFC0CB" />
    <ellipse cx="35" cy="12" rx="8" ry="18" fill="#FFC0CB" transform="rotate(-25 35 12)" />
    <ellipse cx="65" cy="12" rx="8" ry="18" fill="#FFC0CB" transform="rotate(25 65 12)" />
    <path d="M40 36 Q43 33 46 36" stroke="#2c3e50" strokeWidth="2.5" fill="none" />
    <path d="M54 36 Q57 33 60 36" stroke="#2c3e50" strokeWidth="2.5" fill="none" />
    <ellipse cx="50" cy="50" rx="5" ry="3" fill="#E74C3C" /> {/* Open mouth singing */}
    {/* Musical notes */}
    <path d="M20 35 Q25 30 30 35 T40 35" stroke="#FF69B4" strokeWidth="2" fill="none"/>
    <circle cx="20" cy="35" r="2" fill="#FF69B4" />
    <circle cx="30" cy="35" r="2" fill="#FF69B4" />
    <path d="M70 30 Q75 25 80 30 T90 30" stroke="#FF69B4" strokeWidth="2" fill="none"/>
    <circle cx="70" cy="30" r="2" fill="#FF69B4" />
    <circle cx="80" cy="30" r="2" fill="#FF69B4" />
  </svg>
);

const RabbitLoading: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <RabbitThinking className={className} />
    {/* Spinning musical notes for loading */}
    <g transform="translate(50 50)">
      <circle cx="0" cy="-15" r="3" fill="#FF69B4">
        <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <path d="M0 -12 V -8 M-2 -10 H 2" stroke="#FF69B4" strokeWidth="1.5">
         <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="1.5s" repeatCount="indefinite"/>
      </path>
      <circle cx="13" cy="7.5" r="3" fill="#FF8C00">
        <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="1.5s" begin="0.2s" repeatCount="indefinite"/>
      </circle>
       <path d="M13 10.5 V 14.5 M11 12.5 H 15" stroke="#FF8C00" strokeWidth="1.5">
         <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="1.5s" begin="0.2s" repeatCount="indefinite"/>
      </path>
       <circle cx="-13" cy="7.5" r="3" fill="#FFD700">
        <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="1.5s" begin="0.4s" repeatCount="indefinite"/>
      </circle>
       <path d="M-13 10.5 V 14.5 M-15 12.5 H -11" stroke="#FFD700" strokeWidth="1.5">
         <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="1.5s" begin="0.4s" repeatCount="indefinite"/>
      </path>
    </g>
  </svg>
);


export const MoodCharacter: React.FC<MoodCharacterProps> = ({ mood, className = "w-24 h-24" }) => {
  switch (mood) {
    case CharacterMood.HAPPY:
      return <RabbitHappy className={className} />;
    case CharacterMood.SAD:
      return <RabbitSad className={className} />;
    case CharacterMood.THINKING:
      return <RabbitThinking className={className} />;
    case CharacterMood.SINGING:
      return <RabbitSinging className={className} />;
    case CharacterMood.LOADING:
      return <RabbitLoading className={className} />;
    case CharacterMood.IDLE:
    default:
      return <RabbitIdle className={className} />;
  }
};
