from fastapi import APIRouter, Depends, HTTPException
from ..dependencies import get_session
from ..models import Album, AlbumPublic, AlbumPublicWithSongs
from sqlmodel import Session, select
import uuid


router = APIRouter(
    prefix="/albums",
    tags=["albums"],
)

@router.get("/", response_model=list[AlbumPublic])
def read_albums(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    limit: int = 20,
):
    albums = session.exec(
        select(Album).order_by(Album.name).offset(offset).limit(limit)
    ).all()
    return albums

@router.get("/by_id/{album_id}", response_model=AlbumPublicWithSongs)
def read_album(*, session: Session = Depends(get_session), album_id: uuid.UUID):
    album = session.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    return album