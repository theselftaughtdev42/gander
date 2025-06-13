import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import ArtistGrid from './ArtistGrid';
import AlbumGrid from './AlbumGrid';
import SongList from './SongList';
import { FaSearch } from 'react-icons/fa';
import './Search.css'

const Search = () => {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState('');
  const [searchTrigger, setSearchTrigger] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSearch = async (terms) => {
    try {
      const res = await fetch(`${API_URL}/filter/search?terms=${encodeURIComponent(terms)}`);
      const data = await res.json();
      console.log(data)

      setArtists(data.artists)
      setAlbums(data.albums)
      setSongs(data.songs)
      setLoading(false);
    } catch (err) {
      console.error('Error fetching search results', err)
    }
  };

  useEffect(() => {
    fetchSearch(searchTrigger);
    setHighlightedText(searchTrigger)
  }, [searchTrigger]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchTrigger(query);
    }
  };

  const handleSearchButton = (e) => {
    setSearchTrigger(query);
  }

  return (
    <div>
      <h1 className='page-title'>Search</h1>
      <div className='search-container'>
        <input
          type='text'
          placeholder='Enter search terms...'
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="search-bar"
        />
        <button onClick={handleSearchButton} title="Trigger a search" className="search-button">
          <FaSearch />
        </button>
      </div>
      {
      artists.length > 0
      ?
      <>
        <h2 className="secondary-title">Artists</h2>
        <ArtistGrid artists={artists} highlightText={highlightedText} loading={loading} />
      </>
      :
        <h2 className="secondary-title search-not-found">No Artists Found</h2>
      }

      {
      albums.length > 0
      ?
      <>
        <h2 className="secondary-title">Albums</h2>
        <AlbumGrid albums={albums} highlightText={highlightedText} loading={loading} />
      </>
      :
        <h2 className="secondary-title search-not-found">No Albums Found</h2>
      }

      {
      songs.length > 0
      ?
      <>
        <h2 className="secondary-title">Songs</h2>
        <SongList songs={songs} showAlbumArt={true} showArtist={true} highlightText={highlightedText} loading={loading} />
      </>
      :
        <h2 className="secondary-title search-not-found">No Songs Found</h2>
      }
    </div>
  );
};

export default Search;