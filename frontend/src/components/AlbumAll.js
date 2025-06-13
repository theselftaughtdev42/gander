import { API_URL } from '../config';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import AlbumGrid from './AlbumGrid';

const LIMIT = 20;
const OFFSET_AMOUNT = 20;

const AlbumAll = () => {
  const [albums, setAlbums] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(true);
  const observer = useRef();

  const lastAlbumRef = useCallback(node => {
    if (fetching || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setOffset(prev => prev + OFFSET_AMOUNT);
      }
    }, {
      rootMargin: '300px', // <- trigger before entering viewport
    });
    if (node) observer.current.observe(node);
  }, [fetching, hasMore]);

  useEffect(() => {
    const fetchAlbums = async () => {
      if (fetching) return;
      setFetching(true);
      try {
        const res = await fetch(`${API_URL}/albums/?offset=${offset}&limit=${LIMIT}`);
        const data = await res.json();
        console.log(data)

        setAlbums(prev => [...prev, ...data]);
        setLoading(false);
        if (data.length < LIMIT) setHasMore(false);
      } catch (err) {
        console.error('Error fetching Albums', err)
      } finally {
        setFetching(false);
      }
    };

    fetchAlbums();
    // eslint-disable-next-line
  }, [offset])


  return (
    <div>
      <h1 className='page-title'>All Albums</h1>
      <AlbumGrid albums={albums} showArtist={true} loading={loading} />
      <div ref={lastAlbumRef} style={{ height: '1px' }}></div>
    </div>
  );
};

export default AlbumAll;