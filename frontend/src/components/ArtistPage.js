import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config';
import './ArtistPage.css';
import AlbumGrid from './AlbumGrid';
import SongList from './SongList';

const ArtistPage = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const [artistSongs, setArtistSongs] = useState(null)

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(`${API_URL}/artists/${encodeURIComponent(artistId)}`);
        const data = await response.json();
        console.log(data)

        setArtist(data);
      } catch (err) {
        console.error('Error loading artist', err);
        setArtist(null);
      }
    };

    const fetchArtistSongs = async () => {
      try {
        const response = await fetch(`${API_URL}/songs/by_artist/${encodeURIComponent(artistId)}`);
        const data = await response.json();
        console.log(data)

        setArtistSongs(data);
      } catch (err) {
        console.error('Error loading artist songs', err);
        setArtistSongs(null);
      }
    };

    fetchArtist();
    fetchArtistSongs();
  }, [artistId]);

  if (!artist) return <div className="artist-page">Artist not found</div>;

  return (
    <div>
      <h1 className="page-title">{artist.name}</h1>
      <div className="artist-profile-pic">
      {
      artist.profile_pic_filepath
        ? <img src={`${API_URL}/profile_pics/${encodeURIComponent(artist.profile_pic_filepath)}`} className='artist-page-profile-pic' />
        : <div className='artist-page-no-profile-pic'><span className='no-profile-pic-msg'>No Profile Pic</span></div>
        }
      </div>

      <h2 className="center">Albums</h2>
      <AlbumGrid albums={artist.albums}/>

      <h2 className="center">All Songs</h2>
      {artistSongs && <SongList songs={artistSongs} showArtist={false} />}
    </div>
  );
};

export default ArtistPage;
