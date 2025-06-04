import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaRegHeart, FaHeart } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import './SongList.css';
import { API_URL } from '../config';

const SongList = ({ songs, showArtist = true, showAlbumArt = true }) => {
  const audioRefs = useRef([]);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [progress, setProgress] = useState({}); // { index: currentTime }
  const [timeData, setTimeData] = useState({}); // { index: { current, duration } }


  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };  

  useEffect(() => {
    const update = () => {
      const updatedTimeData = {};
      const updatedProgress = {};
  
      audioRefs.current.forEach((audio, i) => {
        if (audio) {
          updatedTimeData[i] = {
            current: audio.currentTime,
            duration: audio.duration || 0,
          };
          updatedProgress[i] = (audio.currentTime / audio.duration) || 0;
        }
      });
  
      setTimeData(updatedTimeData);
      setProgress(updatedProgress);
    };
  
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, []);
  

  const handleTogglePlay = (index) => {
    const audio = audioRefs.current[index];
    if (!audio) return;
  
    if (currentPlaying === index) {
      audio.pause();
      setCurrentPlaying(null);
    } else {
      audioRefs.current.forEach((a, i) => {
        if (a && i !== index) {
          a.pause();
          a.currentTime = 0;
          a.removeAttribute('src');
          a.load();
        }
      });
      audio.src = `${API_URL + "/song_files/" + songs[index].filepath}`;
      audio.load();
      audio.play();
      setCurrentPlaying(index);
    }
  };
  

  const handleSeek = (index, e) => {
    const newTime = e.target.value * audioRefs.current[index].duration;
    audioRefs.current[index].currentTime = newTime;
    setProgress((prev) => ({ ...prev, [index]: e.target.value }));
  };

  return (
    <div className="song-list">
      {songs.map((song, index) => (
        <div key={index} className="song-item">
          {showAlbumArt && 
          <img 
            src={API_URL + "/album_art/NoAlbumArt.jpg"}
            alt="Album Art"
            className="album-art"
          />
          }
          <button className="play-button" onClick={() => handleTogglePlay(index)}>
            {currentPlaying === index ? <FaPause /> : <FaPlay />}
          </button>

          <div className="song-content">
            <div className="song-info">
                <div className="song-title">{song.title}</div>
                {showArtist && <div className="song-artist">{song.artist.name}</div>}
            </div>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={progress[index] || 0}
                onChange={(e) => handleSeek(index, e)}
                className="seek-bar"
            />
            <div className="time-info">
              {formatTime(timeData[index]?.current)} / {formatTime(song.duration)}
            </div>
            <a href={API_URL + "/song_files/" + song.filepath} download className="download-button">
              <FiDownload />
            </a>
            <button className="favourite-button">
              {false ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          <audio
            ref={(el) => (audioRefs.current[index] = el)}
            onEnded={() => setCurrentPlaying(null)}
            preload="metadata"
          >
            {/* <source type="audio/mpeg" /> */}
          </audio>
        </div>
      ))}
    </div>
  );
};

export default SongList;
