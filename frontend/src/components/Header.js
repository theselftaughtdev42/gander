import React from 'react';
import './Header.css';
import { Link, NavLink } from 'react-router-dom';
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
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}><FaRandom /> Random</NavLink>
        <NavLink to="/favourites" className={({ isActive }) => isActive ? 'active' : ''}><FaHeart /> Favourites</NavLink>
        <NavLink to="/songs" className={({ isActive }) => isActive ? 'active' : ''}><FaMusic /> Songs</NavLink>
        <NavLink to="/albums" className={({ isActive }) => isActive ? 'active' : ''}><FaCompactDisc /> Albums</NavLink>
        <NavLink to="/artists" className={({ isActive }) => isActive ? 'active' : ''}><FaUserAlt /> Artists</NavLink>
        <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}><FaSearch /> Search</NavLink>
      </nav>
    </header>
  );
};

export default Header;
