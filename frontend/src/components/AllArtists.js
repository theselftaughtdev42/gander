import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import ArtistGrid from './ArtistGrid';

const AllArtists = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch(`${API_URL}/artists`);
        const data = await res.json();
        console.log(data)

        setArtists(data)
      } catch (err) {
        console.error('Error fetching Artists', err)
      }
    };

    fetchArtists();
  }, [])


  return (
    <div>
      <h1 className='page-title'>Artists</h1>
      <ArtistGrid artists={artists} />
    </div>
  );
};

export default AllArtists;