import { API_URL } from '../config';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import SongList from './SongList';

const LIMIT = 50;
const OFFSET_AMOUNT = 50;

const SongsAll = () => {
  const [songs, setSongs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
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
    const fetchSongs = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/filter/songs/?offset=${offset}&limit=${LIMIT}`);
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
  }, [offset])

  return (
    <div>
      <h1 className='page-title'>All Songs</h1>
      <SongList songs={songs} />
      <div ref={lastSongRef} style={{ height: '1px' }}></div>
    </div>
  );

};

export default SongsAll;