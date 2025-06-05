from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from ..dependencies import get_session
from ..models import Song, SongPublic
from sqlmodel import Session, select
from sqlalchemy.sql import func
import uuid
from pathlib import Path


router = APIRouter(
    prefix="/songs",
    tags=["songs"],
)


@router.get("/", response_model=list[SongPublic])
def read_songs(*, session: Session = Depends(get_session)):
    songs = session.exec(select(Song)).all()
    return songs

@router.get("/by_id/{song_id}", response_model=SongPublic)
def read_song(*, session: Session = Depends(get_session), song_id: uuid.UUID):
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


@router.get("/by_artist/{artist_id}", response_model=list[SongPublic])
def read_song_by_artist(
    *, session: Session = Depends(get_session), artist_id: uuid.UUID
):
    song = session.exec(
        select(Song).where(Song.artist_id == artist_id).order_by(Song.title)
    )
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


@router.get("/random/{amount}", response_model=list[SongPublic])
def read_random_songs(*, session: Session = Depends(get_session), amount: int):
    songs = session.exec(select(Song).order_by(func.random()).limit(amount))
    return songs


@router.get("/download/{song_id}")
def download_song(*, session: Session = Depends(get_session), song_id: uuid.UUID):
    song = session.get(Song, song_id)
    file_path = Path("music", song.filepath)

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        file_path,
        media_type="application/octet-stream",
        filename=f"{song.title} - by {song.artist.name}",
    )