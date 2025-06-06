from typing import Annotated
from fastapi import APIRouter, Depends, Query
from ..dependencies import get_session
from ..models import (
    Artist,
    ArtistPublic,
    Album,
    AlbumPublic,
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
from sqlalchemy import asc, desc, or_
from enum import Enum
from operator import attrgetter

class OrderBy(str, Enum):
    title_asc = "title_asc"
    title_desc = "title_desc"
    duration_asc = "duration_asc"
    duration_desc = "duration_desc"

class FilterQuery(BaseModel):
    genre: str | None = None
    mood: str | None = None
    theme: str | None = None
    instrument: str | None = None
    offset: int = 0
    limit: int = 50
    sort_order: OrderBy = OrderBy.title_asc

class SearchResponse(BaseModel):
    artists: list[ArtistPublic] = []
    albums: list[AlbumPublic] = []
    songs: list[SongPublic] = []


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
def songs(
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
        print("No filters applied. Querying all songs.")

        sort_mapping = {
            OrderBy.title_asc: asc(Song.title),
            OrderBy.title_desc: desc(Song.title),
            OrderBy.duration_asc: asc(Song.duration),
            OrderBy.duration_desc: desc(Song.duration),
        }

        sort_order = sort_mapping.get(filters.sort_order, Song.title)

        songs = session.exec(
            select(Song)
            .order_by(sort_order)
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

    # apply ordering
    sorted_songs = []
    if filters.sort_order == OrderBy.title_asc:
        sorted_songs = sorted(
            songs_in_all_filters,
            key=attrgetter("title"),
        )
    if filters.sort_order == OrderBy.title_desc:
        sorted_songs = sorted(
            songs_in_all_filters,
            key=attrgetter("title"),
            reverse=True,
        )
    if filters.sort_order == OrderBy.duration_asc:
        sorted_songs = sorted(
            songs_in_all_filters,
            key=attrgetter("duration"),
        )
    if filters.sort_order == OrderBy.duration_desc:
        sorted_songs = sorted(
            songs_in_all_filters,
            key=attrgetter("duration"),
            reverse=True,
        )

    print(f"total found: {len(sorted_songs)}")
    songs = sorted_songs[filters.offset : filters.offset + filters.limit]
    print(f"offset amount: {len(songs)}")

    return songs


@router.get("/search", response_model=SearchResponse)
def search(
    *,
    session: Session = Depends(get_session),
    terms: str = "",
):
    words = terms.split(" ")
    artists = session.exec(
        select(Artist).where(or_(*[Artist.name.contains(word) for word in words]))
    ).all()

    albums = session.exec(
        select(Album).where(or_(*[Album.name.contains(word) for word in words]))
    ).all()

    songs = session.exec(
        select(Song).where(or_(*[Song.title.contains(word) for word in words]))
    ).all()

    return {
        "artists": artists,
        "albums": albums,
        "songs": songs,
    }
