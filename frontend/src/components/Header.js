import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <h1 className="app-title">MyTunes</h1>
      <nav className="nav-links">
        <a href="/">Random Songs</a>
        <a href="/songs">All Songs</a>
        <a href="/albums">Albums</a>
        <a href="/artists">Artists</a>
      </nav>
    </header>
  );
};

export default Header;
