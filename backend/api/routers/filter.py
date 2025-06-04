from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
from ..dependencies import get_session
from ..models import Genre, GenrePublic, Mood, MoodPublic, Theme, ThemePublic, Instrument, InstrumentPublic, Song, SongPublic
from sqlmodel import Session, select, or_
from pydantic import BaseModel


class FilterQuery(BaseModel):
    genres: list[str] = []
    moods: list[str] = []
    themes: list[str] = []
    instruments: list[str] = []
    offset: int = 0
    limit: int = 50


router = APIRouter(
    prefix="/filter",
    tags=["filter"],
)


@router.get("/genres", response_model=list[GenrePublic])
def read_genres(*, session: Session = Depends(get_session)):
    genres = session.exec(select(Genre)).all()
    return genres


@router.get("/moods", response_model=list[MoodPublic])
def read_moods(*, session: Session = Depends(get_session)):
    moods = session.exec(select(Mood)).all()
    return moods


@router.get("/themes", response_model=list[ThemePublic])
def read_themes(*, session: Session = Depends(get_session)):
    themes = session.exec(select(Theme)).all()
    return themes


@router.get("/instruments", response_model=list[InstrumentPublic])
def read_instruments(*, session: Session = Depends(get_session)):
    instruments = session.exec(select(Instrument)).all()
    return instruments


@router.get("/songs", response_model=list[SongPublic])
def search(
    *,
    session: Session = Depends(get_session),
    filters: Annotated[FilterQuery, Query()],
):
    if not filters.genres and not filters.moods and not filters.themes and not filters.instruments:
        songs = session.exec(
            select(Song)
            .order_by(Song.title)
            .offset(filters.offset)
            .limit(filters.limit)
        ).all()
        return songs
    
    # Workaround for not being able to run a query such as:
    # select(Song).where(genre in Song.genres)
    results = []
    if filters.genres:
        results.append(session.exec(select(Genre).where(or_(Genre.name == genre for genre in filters.genres))))
    if filters.moods:
        results.append(session.exec(select(Mood).where(or_(Mood.name == mood for mood in filters.moods))))
    if filters.themes:
        results.append(session.exec(select(Theme).where(or_(Theme.name == theme for theme in filters.themes))))
    if filters.instruments:
        results.append(session.exec(select(Instrument).where(or_(Instrument.name == instrument for instrument in filters.instruments))))

    all_song_uuids = []
    for result in results:
        for genre_ish in result:
            all_song_uuids.extend(song.id for song in genre_ish.songs)

    songs = []
    for ident in set(all_song_uuids):
        songs.append(session.exec(select(Song).where(Song.id == ident)).one())

    return songs