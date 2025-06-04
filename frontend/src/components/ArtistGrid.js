import React from 'react';
import './ArtistGrid.css';
import { Link } from 'react-router-dom';

const ArtistGrid = ({ artists }) => {
  return (
    <div className='grid-container'>
      {artists.map((artist, i) => (
        <Link
          to={`/artist/${encodeURIComponent(artist.id)}`}
          key={artist.id}
          className='artist-link'
        >
          <div key={artist.id} className='grid-tile'>
          {artist.name}
          </div>        
        </Link>
      ))}
    </div>
  );
};

export default ArtistGrid;
