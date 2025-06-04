import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import SongList from './SongList';

const SongsRandom = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(`${API_URL}/songs/random/10`); 
        const data = await res.json();

        setSongs(data);
      } catch (err) {
        console.error('Error fetching songs:', err);
      }
    };

    fetchSongs();
  }, []);

  return (
    <div>
      <h1 className='page-title'>10 Random Songs</h1>
      <SongList songs={songs}/>
    </div>
  );
};

export default SongsRandom;
