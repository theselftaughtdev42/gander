import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SongsRandom from './components/SongsRandom';
import ArtistAll from './components/ArtistAll';
import AlbumAll from './components/AlbumAll'
import ArtistPage from './components/ArtistPage';
import AlbumSongs from './components/AlbumSongs';

const Songs = () => <div>Songs</div>;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Header />
    <div className="container">
      <Routes>
        <Route path="/" element={<SongsRandom />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/albums" element={<AlbumAll />} />
        <Route path="/album/:albumId" element={<AlbumSongs />} />
        <Route path="/artists" element={<ArtistAll />} />
        <Route path="/artist/:artistId" element={<ArtistPage />} />
      </Routes>
    </div>
  </Router>
);

