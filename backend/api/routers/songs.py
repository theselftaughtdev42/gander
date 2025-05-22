from fastapi import APIRouter, Depends, HTTPException
from ..dependencies import get_session
from ..models import Song, SongPublic, SongPublicWithGenres
from sqlmodel import Session, select
import uuid


router = APIRouter(
    prefix="/songs",
    tags=["songs"],
)


@router.get("/", response_model=list[SongPublic])
def read_songs(*, session: Session = Depends(get_session)):
    songs = session.exec(select(Song)).all()
    return songs

@router.get("/{song_id}", response_model=SongPublicWithGenres)
def read_song(*, session: Session = Depends(get_session), song_id: uuid.UUID):
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song