import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaRegHeart, FaHeart } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import './SongList.css';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';

const SongList = ({ songs, showArtist = true, showAlbumArt = true }) => {
  const audioRefs = useRef([]);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [progress, setProgress] = useState({});
  const [timeData, setTimeData] = useState({});
  const [favourites, setFavourites] = useState({})

  useEffect(() => {
    const favourites = {};
    songs.forEach((song, i) => {
      favourites[i] = song.favourite;
    });
    setFavourites(favourites);
  }, [songs]);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    audioRefs.current.forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    setCurrentPlaying(null);
  }, [songs]);

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
      audio.src = `${API_URL}/song_files/${encodeURIComponent(songs[index].filepath)}`;
      audio.load();
      audio.play();
      setCurrentPlaying(index);
    }
  };
  

  const handleSeek = (index, e) => {
    if (currentPlaying !== index) return;
    const newTime = e.target.value * audioRefs.current[index].duration;
    audioRefs.current[index].currentTime = newTime;
    setProgress((prev) => ({ ...prev, [index]: e.target.value }));
  };

  const handleToggleFavourite = async (index) => {
    const song = songs[index];
    const newStatus = !favourites[index];
    setFavourites((prev) => ({ ...prev, [index]: newStatus }));

    try {
      await fetch(`${API_URL}/songs/favourite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ song_id: song.id, favourite: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update favourite', err);
      setFavourites((prev) => ({ ...prev, [index]: !newStatus })); // rollback
    }
  };

  return (
    <div className="song-list">
      {songs.map((song, index) => (
        <div key={index} className="song-item">

          {
          showAlbumArt && 
          <Link
            to={`/album/${song.album.id}`}
            key={song.album.id}
          >
            <img 
              src={`${API_URL}/album_art/${encodeURIComponent(song.album.art_filepath)}`}
              alt="Album Art"
              className="album-art"
            />
          </Link>
          }

          <button className="play-button" onClick={() => handleTogglePlay(index)}>
            {currentPlaying === index ? <FaPause /> : <FaPlay />}
          </button>

          <div className="song-content">
            <div className="song-info">
                <div className="song-title">{song.title}</div>

                {
                showArtist &&
                <Link
                  to={`/artist/${song.artist.id}`}
                  key={song.artist.id}
                  className='song-artist'
                >
                  {song.artist.name}
                </Link>
                }

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

            <a href={`${API_URL}/songs/download/${encodeURIComponent(song.id)}`} download className="download-button">
              <FiDownload />
            </a>


            <button
              className={`favourite-button ${favourites[index] ? 'active' : ''}`}
              onClick={() => handleToggleFavourite(index)}
            >
              {favourites[index] ? <FaHeart /> : <FaRegHeart />}
            </button>

          </div>

          <audio
            ref={(el) => (audioRefs.current[index] = el)}
            onEnded={() => setCurrentPlaying(null)}
            preload="metadata"
          >
          </audio>
        </div>
      ))}
    </div>
  );
};

export default SongList;
