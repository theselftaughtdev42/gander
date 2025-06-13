import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import ArtistGrid from './ArtistGrid';

const ArtistAll = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch(`${API_URL}/artists`);
        const data = await res.json();
        console.log(data)

        setArtists(data)
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Artists', err)
      }
    };

    fetchArtists();
  }, [])


  return (
    <div>
      <h1 className='page-title'>Artists</h1>
      <ArtistGrid artists={artists} loading={loading} />
    </div>
  );
};

export default ArtistAll;