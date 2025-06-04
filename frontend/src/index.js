import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import RandomSongs from './components/RandomSongs';
import AllArtists from './components/AllArtists';

const Songs = () => <div>Songs</div>;
const Albums = () => <div>Albums</div>;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Header />
    <div className="container">
      <Routes>
        <Route path="/" element={<RandomSongs />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/artists" element={<AllArtists />} />
      </Routes>
    </div>
  </Router>
);

