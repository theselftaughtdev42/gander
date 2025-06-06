import { API_URL } from '../config';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import SongList from './SongList';
import './SongsAll.css';

const LIMIT = 50;
const OFFSET_AMOUNT = 50;

const SongsAll = () => {
  const [songs, setSongs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [instruments, setInstruments] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState('');

  const [sortOrder, setSortOrder] = useState('title_asc');

  const observer = useRef();

  const lastSongRef = useCallback(node => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setOffset(prev => prev + OFFSET_AMOUNT);
      }
    }, {
      rootMargin: '500px', // <- trigger before entering viewport
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const g_res = await fetch(`${API_URL}/filter/genres`);
        const g_data = await g_res.json();
        setGenres(g_data);
        console.log(g_data)
        
        const m_res = await fetch(`${API_URL}/filter/moods`);
        const m_data = await m_res.json();
        setMoods(m_data);
        console.log(m_data)
        
        const t_res = await fetch(`${API_URL}/filter/themes`);
        const t_data = await t_res.json();
        setThemes(t_data);
        console.log(t_data)
        
        const i_res = await fetch(`${API_URL}/filter/instruments`);
        const i_data = await i_res.json();
        setInstruments(i_data);
        console.log(i_data)
      } catch (err) {
        console.error('Error fetching genres', err);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const genreParam = selectedGenre ? `&genre=${encodeURIComponent(selectedGenre)}` : '';
        const moodParam = selectedMood ? `&mood=${encodeURIComponent(selectedMood)}` : '';
        const themeParam = selectedTheme ? `&theme=${encodeURIComponent(selectedTheme)}` : '';
        const instrumentParam = selectedInstrument ? `&instrument=${encodeURIComponent(selectedInstrument)}` : '';

        const sortOrderParam = sortOrder ? `&sort_order=${encodeURIComponent(sortOrder)}` : '';
  
        const res = await fetch(`${API_URL}/filter/songs?offset=${offset}&limit=${LIMIT}${genreParam}${moodParam}${themeParam}${instrumentParam}${sortOrderParam}`);
        const data = await res.json();
        console.log(data)

        setSongs(prev => [...prev, ...data]);
        if (data.length < LIMIT) setHasMore(false);
      } catch (err) {
        console.error('Error fetching Albums', err)
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
    // eslint-disable-next-line
  }, [offset, selectedGenre, selectedMood, selectedTheme, selectedInstrument, sortOrder])

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setOffset(0);
    setSongs([]);
    setHasMore(true);
  };

  const handleMoodChange = (e) => {
    setSelectedMood(e.target.value);
    setOffset(0);
    setSongs([]);
    setHasMore(true);
  };

  const handleThemeChange = (e) => {
    setSelectedTheme(e.target.value);
    setOffset(0);
    setSongs([]);
    setHasMore(true);
  };

  const handleInstrumentChange = (e) => {
    setSelectedInstrument(e.target.value);
    setOffset(0);
    setSongs([]);
    setHasMore(true);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setOffset(0);
    setSongs([]);
    setHasMore(true);
  };

  return (
    <div>
      <h1 className='page-title'>All Songs</h1>

      <div className="filter-container">

        <div className="filter-item">
          <div className="filter-title">Genres</div>
          <select onChange={handleGenreChange} value={selectedGenre} className="select-dark">
            <option value=''>All Genres</option>
            {genres.map(genre => (
              <option key={genre.name} value={genre.name}>{genre.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <div className="filter-title">Moods</div>
          <select onChange={handleMoodChange} value={selectedMood} className="select-dark">
            <option value=''>All Moods</option>
            {moods.map(mood => (
              <option key={mood.name} value={mood.name}>{mood.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <div className="filter-title">Themes</div>
          <select onChange={handleThemeChange} value={selectedTheme} className="select-dark">
            <option value=''>All Themes</option>
            {themes.map(theme => (
              <option key={theme.name} value={theme.name}>{theme.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <div className="filter-title">Instruments</div>
          <select onChange={handleInstrumentChange} value={selectedInstrument} className="select-dark">
            <option value=''>All Instruments</option>
            {instruments.map(instrument => (
              <option key={instrument.name} value={instrument.name}>{instrument.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-title">Sort Order</label>
          <select value={sortOrder} onChange={handleSortOrderChange} className="select-dark">
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
            <option value="duration_asc">Duration (Short → Long)</option>
            <option value="duration_desc">Duration (Long → Short)</option>
          </select>
        </div>

      </div>

      <SongList songs={songs} />
      <div ref={lastSongRef} style={{ height: '1px' }}></div>
    </div>
  );

};

export default SongsAll;