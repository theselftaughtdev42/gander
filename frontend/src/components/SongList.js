import React, { useState } from 'react';
import './SongList.css';
import SongItem from './SongItem';

const SongList = ({ songs, showArtist = true, showAlbumArt = true, highlightText = '' }) => {
  const [currentPlaying, setCurrentPlaying] = useState(null);

  return (
    <div className="song-list">
      {songs.length === 0
      ?
        <p className="nothing-found-message">No songs found 😭</p>
      :
      songs.map((song, index) => (
        <SongItem
          key={index}
          song={song}
          index={index}
          isPlaying={currentPlaying === index}
          setCurrentPlaying={setCurrentPlaying}
          highlightText={highlightText}
          showArtist={showArtist}
          showAlbumArt={showAlbumArt}
        />
      ))}
    </div>
  );
};

export default SongList;
