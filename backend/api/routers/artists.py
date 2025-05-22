from fastapi import APIRouter, Depends, HTTPException
from ..dependencies import get_session
from ..models import Artist, ArtistPublic, ArtistPublicWithAlbums
from sqlmodel import Session, select
import uuid


router = APIRouter(
    prefix="/artists",
    tags=["artists"],
)

@router.get("/", response_model=list[ArtistPublic])
def read_artists(*, session: Session = Depends(get_session)):
    artists = session.exec(select(Artist)).all()
    return artists

@router.get("/{artist_id}", response_model=ArtistPublicWithAlbums)
def read_artist(*, session: Session = Depends(get_session), artist_id: uuid.UUID):
    artist = session.get(Artist, artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist