
import React from 'react';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
}

export const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const searchQuery = encodeURIComponent(song.youtube_search_query);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-pink-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start space-x-3">
        <div className="text-3xl text-pink-400 pt-1">🎵</div> {/* Musical note icon */}
        <div>
          <h3 className="text-lg font-semibold text-pink-600">{song.name}</h3>
          <p className="text-sm text-gray-500 mb-1">{song.artist}</p>
          <p className="text-sm text-gray-700 mb-2">{song.description}</p>
          <a
            href={youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 bg-pink-400 text-white text-xs font-medium rounded-full hover:bg-pink-500 transition-colors duration-300"
          >
            <i className="fas fa-play mr-2"></i>去聽歌
          </a>
        </div>
      </div>
    </div>
  );
};