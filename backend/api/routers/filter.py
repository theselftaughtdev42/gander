from typing import Annotated
from fastapi import APIRouter, Depends, Query
from ..dependencies import get_session
from ..models import (
    Genre,
    GenrePublic,
    Mood,
    MoodPublic,
    Theme,
    ThemePublic,
    Instrument,
    InstrumentPublic,
    Song,
    SongPublic,
)
from sqlmodel import Session, select
from pydantic import BaseModel


class FilterQuery(BaseModel):
    genre: str | None = None
    mood: str | None = None
    theme: str | None = None
    instrument: str | None = None
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
    if (
        not filters.genre
        and not filters.mood
        and not filters.theme
        and not filters.instrument
    ):
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
    if filters.genre:
        results.append(
            session.exec(select(Genre).where(Genre.name == filters.genre)).one()
        )
    if filters.mood:
        results.append(
            session.exec(select(Mood).where(Mood.name == filters.mood)).one()
        )
    if filters.theme:
        results.append(
            session.exec(select(Theme).where(Theme.name == filters.theme)).one()
        )
    if filters.instrument:
        results.append(
            session.exec(
                select(Instrument).where(Instrument.name == filters.instrument)
            ).one()
        )

    def common_elements_ordered(*lists):
        if not lists:
            return []
        first, *rest = lists
        return [x for x in first if all(x in other for other in rest)]

    list_of_filter_songs = []
    for filter in results:
        list_of_filter_songs.append(filter.songs)

    songs_in_all_filters = common_elements_ordered(*list_of_filter_songs)

    print(f"total found: {len(songs_in_all_filters)}")
    songs = songs_in_all_filters[filters.offset : filters.offset + filters.limit]
    print(f"offset amount: {len(songs)}")

    return songs