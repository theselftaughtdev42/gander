import { API_URL } from '../config';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import AlbumGrid from './AlbumGrid';

const LIMIT = 20;
const OFFSET_AMOUNT = 20;

const AlbumAll = () => {
  const [albums, setAlbums] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const lastAlbumRef = useCallback(node => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setOffset(prev => prev + OFFSET_AMOUNT);
      }
    }, {
      rootMargin: '300px', // <- trigger before entering viewport
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchAlbums = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/albums/?offset=${offset}&limit=${LIMIT}`);
        const data = await res.json();
        console.log(data)

        setAlbums(prev => [...prev, ...data]);
        if (data.length < LIMIT) setHasMore(false);
      } catch (err) {
        console.error('Error fetching Albums', err)
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [offset])


  return (
    <div>
      <h1 className='page-title'>All Albums</h1>
      <AlbumGrid albums={albums} showArtist={true} />
      <div ref={lastAlbumRef} style={{ height: '1px' }}></div>
    </div>
  );
};

export default AlbumAll;