import React from 'react';
import './ArtistGrid.css';
import { Link } from 'react-router-dom';
import HighlightedName from './HighlightedName'
import { API_URL } from '../config';


const ArtistGrid = ({ artists, highlightText = '', loading }) => {

  if (loading) return null;

  return (
    <div className='artist-container'>
      {artists.length === 0
      ?
        <p className="nothing-found-message">No artists found 🤨</p>
      :
      
      artists.map((artist, i) => (
        <Link
          to={`/artist/${artist.id}`}
          key={artist.id}
          className='artist-link'
        >
          <div
            className={
              artist.profile_pic_filepath
                ? 'artist-tile'
                : 'no-profile-artist-tile'
            }
            style={
              artist.profile_pic_filepath
                ? { backgroundImage: `url(${API_URL}/profile_pics/${encodeURIComponent(artist.profile_pic_filepath)})` }
                : {}
            }
          >
            <div className={
              artist.profile_pic_filepath
                ? 'artist-name'
                : 'no-artist-name'
            }>
              <HighlightedName name={artist.name} highlightedText={highlightText} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ArtistGrid;
