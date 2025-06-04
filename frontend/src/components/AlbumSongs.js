import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import SongList from './SongList';
import { useParams } from 'react-router-dom';

const AlbumSongs = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState({});

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await fetch(`${API_URL}/albums/${albumId}`); 
        const data = await res.json();
        console.log(data)

        setAlbum(data);
      } catch (err) {
        console.error('Error fetching songs:', err);
      }
    };

    fetchAlbum();
  }, []);

  return (
    <div>
      <h1 className='page-title'>{album.name}</h1>
      <h2 className='page-title'>By {album.artist?.name}</h2>
      {album.songs && <SongList songs={album.songs} />}
    </div>
  );
};

export default AlbumSongs;
