import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <h1 className="app-title">MyTunes</h1>
      <nav className="nav-links">
        <Link to="/">Random Songs</Link>
        <Link to="/songs">All Songs</Link>
        <Link to="/albums">Albums</Link>
        <Link to="/artists">Artists</Link>
      </nav>
    </header>
  );
};

export default Header;
