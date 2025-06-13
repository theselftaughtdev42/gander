import { API_URL } from '../config';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import SongList from './SongList';
import './SongsAll.css';

const LIMIT = 50;
const OFFSET_AMOUNT = 50;

const SongsFavourites = () => {
  const [songs, setSongs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(true);

  const observer = useRef();

  const lastSongRef = useCallback(node => {
    if (fetching || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setOffset(prev => prev + OFFSET_AMOUNT);
      }
    }, {
      rootMargin: '500px', // <- trigger before entering viewport
    });
    if (node) observer.current.observe(node);
  }, [fetching, hasMore]);


  useEffect(() => {
    const fetchSongs = async () => {
      if (fetching) return;
      setFetching(true);
      try {  
        const res = await fetch(`${API_URL}/songs/favourites?offset=${offset}&limit=${LIMIT}`);
        const data = await res.json();
        console.log(data)

        setSongs(prev => [...prev, ...data]);
        setLoading(false);
        if (data.length < LIMIT) setHasMore(false);
      } catch (err) {
        console.error('Error fetching favourite songs', err)
      } finally {
        setFetching(false);
      }
    };

    fetchSongs();
    // eslint-disable-next-line
  }, [offset])

  return (
    <div>
      <h1 className='page-title'>Your Favourite Songs</h1>
      <SongList songs={songs} loading={loading} />
      <div ref={lastSongRef} style={{ height: '1px' }}></div>
    </div>
  );

};

export default SongsFavourites;