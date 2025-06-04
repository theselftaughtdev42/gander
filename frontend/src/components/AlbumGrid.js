import React from 'react';
import './AlbumGrid.css';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const AlbumGrid = ({ albums }) => {
  return (
    <div className='album-container'>
      {albums.map((album, i) => (
        <div key={album.id} className='album-card'>
          <Link
            to={`/album/${encodeURIComponent(album.id)}`}
            key={album.id}
            className='album-link'
          >
            <img 
              src={API_URL + "/album_art/NoAlbumArt.jpg"}
              alt="Album Art"
              className="album-tile"
            />
            <div className='album-name'>
              {album.name}
            </div>        
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AlbumGrid;
