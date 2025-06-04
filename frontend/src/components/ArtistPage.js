import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config';
import './ArtistPage.css';
import AlbumGrid from './AlbumGrid';

const ArtistPage = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(`${API_URL}/artists/${artistId}`);
        const data = await response.json();

        setArtist(data);
      } catch (err) {
        console.error('Error loading artist', err);
        setArtist(null);
      }
    };

    fetchArtist();
  }, [artistId]);

  if (!artist) return <div className="artist-page">Artist not found</div>;

  return (
    <div>
      <h1 className="page-title">{artist.name}</h1>
      <h2 className="center">Albums</h2>
      <AlbumGrid albums={artist.albums}/>
      <h2 className="center">TODO::All Songs</h2>
    </div>
  );
};

export default ArtistPage;
