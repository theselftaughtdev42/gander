import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import SongList from './SongList';
import { FaSyncAlt } from 'react-icons/fa';
import './SongsRandom.css'

const SongsRandom = () => {
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    try {
      const res = await fetch(`${API_URL}/songs/random/10`); 
      const data = await res.json();
      console.log(data)

      console.log(data)

      setSongs(data);
    } catch (err) {
      console.error('Error fetching songs:', err);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div>
      <h1 className='page-title'>
        A Random Selection
        <button onClick={fetchSongs} title="Reload" className="reload-button">
          <FaSyncAlt />
        </button>
      </h1>
      <SongList songs={songs}/>
    </div>
  );
};

export default SongsRandom;
