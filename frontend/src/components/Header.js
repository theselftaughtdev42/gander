import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { FaRandom, FaMusic, FaCompactDisc, FaUserAlt, FaHeart, FaSearch } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo-app-name">
        <Link to="/">
          <img src="/logo.png" alt="Music Icon" className="my-tunes-logo" />
        </Link>
        <h1 className="app-title">Gander</h1>        
      </div>
      <nav className="nav-links">
        <Link to="/search"><FaSearch /> Search</Link>
        <Link to="/"><FaRandom /> Random</Link>
        <Link to="/favourites"><FaHeart /> Favourites</Link>
        <Link to="/songs"><FaMusic /> Songs</Link>
        <Link to="/albums"><FaCompactDisc /> Albums</Link>
        <Link to="/artists"><FaUserAlt /> Artists</Link>
      </nav>
    </header>
  );
};

export default Header;
