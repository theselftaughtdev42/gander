import React from 'react';
import './AlbumGrid.css';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const AlbumGrid = ({ albums, showArtist = false }) => {
  return (
    <div className='album-container'>
      {albums.length === 0
      ?
        <p className="nothing-found-message">No albums found 😢</p>
      :
      albums.map((album, i) => (
        <div key={album.id} className='album-card'>
          <Link
            to={`/album/${encodeURIComponent(album.id)}`}
            key={album.id}
            className='album-link'
          >
            <img 
              src={`${API_URL}/album_art/${encodeURIComponent(album.art_filepath)}`}
              alt="Album Art"
              className="album-tile"
            />
            <div className='album-name'>
              {album.name}
            </div> 
            { showArtist &&
            <div className='album-artist-name'>
              <i>{album.artist.name}</i>
            </div>        
            }
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AlbumGrid;
