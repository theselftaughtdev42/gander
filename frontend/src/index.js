import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SongsRandom from './components/SongsRandom';
import ArtistAll from './components/ArtistAll';

const Songs = () => <div>Songs</div>;
const Albums = () => <div>Albums</div>;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Header />
    <div className="container">
      <Routes>
        <Route path="/" element={<SongsRandom />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/artists" element={<ArtistAll />} />
      </Routes>
    </div>
  </Router>
);

