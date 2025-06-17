import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SongsRandom from './components/SongsRandom';
import ArtistAll from './components/ArtistAll';
import AlbumAll from './components/AlbumAll'
import SongsAll from './components/SongsAll';
import ArtistPage from './components/ArtistPage';
import AlbumSongs from './components/AlbumSongs';
import SongsFavourites from './components/SongsFavourites';
import Search from './components/Search';
import Ingest from './components/Ingest';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Header />
    <div className="container">
      <Routes>
        <Route path="/" element={<SongsRandom />} />
        <Route path="/favourites" element={<SongsFavourites />} />
        <Route path="/songs" element={<SongsAll />} />
        <Route path="/albums" element={<AlbumAll />} />
        <Route path="/album/:albumId" element={<AlbumSongs />} />
        <Route path="/artists" element={<ArtistAll />} />
        <Route path="/artist/:artistId" element={<ArtistPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/ingest" element={<Ingest />} />
      </Routes>
    </div>
  </Router>
);

