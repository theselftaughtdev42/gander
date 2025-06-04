import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import AlbumGrid from './AlbumGrid';

const AlbumAll = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch(`${API_URL}/albums`);
        const data = await res.json();
        console.log(data)

        setAlbums(data)
      } catch (err) {
        console.error('Error fetching Albums', err)
      }
    };

    fetchAlbums();
  }, [])


  return (
    <div>
      <h1 className='page-title'>All Albums</h1>
      <AlbumGrid albums={albums} showArtist={true} />
    </div>
  );
};

export default AlbumAll;