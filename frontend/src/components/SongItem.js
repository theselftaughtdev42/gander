import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaRegHeart, FaHeart } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import HighlightedName from './HighlightedName';

const SongItem = ({ song, index, isPlaying, setCurrentPlaying, highlightText, showArtist, showAlbumArt }) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [timeData, setTimeData] = useState({ current: 0, duration: 0 });
  const [favourite, setFavourite] = useState(song.favourite);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
  
    if (!isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setProgress(0);
      setTimeData({ current: 0, duration: audio.duration || 0 });
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const update = () => {
      const audio = audioRef.current;
      if (!audio) return;

      setTimeData({ current: audio.currentTime, duration: audio.duration || 0 });
      setProgress((audio.currentTime / audio.duration) || 0);
    };

    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.src = `${API_URL}/song_files/${encodeURIComponent(song.filepath)}`;
      audio.load();
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isPlaying, song.filepath]);

  const handleTogglePlay = () => {
    setCurrentPlaying(isPlaying ? null : index);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = e.target.value * audio.duration;
    audio.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleToggleFavourite = async () => {
    const newStatus = !favourite;
    setFavourite(newStatus);
    try {
      await fetch(`${API_URL}/songs/favourite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song_id: song.id, favourite: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update favourite', err);
      setFavourite(!newStatus);
    }
  };

  return (
    <div className="song-item">
      {showAlbumArt && (
        <Link to={`/album/${song.album.id}`}>
          <img
            src={`${API_URL}/album_art/${encodeURIComponent(song.album.art_filepath)}`}
            alt="Album Art"
            className="album-art"
          />
        </Link>
      )}

      <button className="play-button" onClick={handleTogglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <div className="song-content">
        <div className="song-info">
          <div className="song-title">
            <HighlightedName name={song.title} highlightedText={highlightText} />
          </div>
          {showArtist && (
            <Link to={`/artist/${song.artist.id}`} className="song-artist">
              {song.artist.name}
            </Link>
          )}
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={progress}
          onChange={handleSeek}
          className="seek-bar"
        />

        <div className="time-info">
          {formatTime(timeData.current)} / {formatTime(song.duration)}
        </div>

        <a href={`${API_URL}/songs/download/${encodeURIComponent(song.id)}`} download className="download-button">
          <FiDownload />
        </a>

        <button
          className={`favourite-button ${favourite ? 'active' : ''}`}
          onClick={handleToggleFavourite}
        >
          {favourite ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <audio
        ref={audioRef}
        onEnded={() => setCurrentPlaying(null)}
        preload="metadata"
      />
    </div>
  );
};

export default SongItem;
