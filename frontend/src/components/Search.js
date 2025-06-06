import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import ArtistGrid from './ArtistGrid';
import AlbumGrid from './AlbumGrid';
import SongList from './SongList';
import './Search.css'

const Search = () => {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState('');
  const [searchTrigger, setSearchTrigger] = useState('');

  const fetchSearch = async (terms) => {
    try {
      const res = await fetch(`${API_URL}/filter/search?terms=${encodeURIComponent(terms)}`);
      const data = await res.json();
      console.log(data)

      setArtists(data.artists)
      setAlbums(data.albums)
      setSongs(data.songs)
    } catch (err) {
      console.error('Error fetching search results', err)
    }
  };

  useEffect(() => {
    fetchSearch(searchTrigger);
  }, [searchTrigger]);

  useEffect(() => {
    fetchSearch();
  }, [])

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchTrigger(query);
    }
  };

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
      </div>
      {
      artists.length > 0
      ?
      <>
        <h2 className="secondary-title">Artists</h2>
        <ArtistGrid artists={artists} />
      </>
      :
        <h2 className="secondary-title">No Artists Match</h2>
      }

      {
      albums.length > 0
      ?
      <>
        <h2 className="secondary-title">Albums</h2>
        <AlbumGrid albums={albums} />
      </>
      :
        <h2 className="secondary-title">No Albums Match</h2>
      }

      {
      songs.length > 0
      ?
      <>
        <h2 className="secondary-title">Songs</h2>
        <SongList songs={songs} showAlbumArt={true} showArtist={true} />
      </>
      :
        <h2 className="secondary-title">No Songs Match</h2>
      }
    </div>
  );
};

export default Search;