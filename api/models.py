from sqlmodel import Field, SQLModel, Relationship
import uuid

GENRES = [
    "acoustic",
    "atmospheric",
    "ambient",
    "blues",
    "children",
    "cinematic",
    "classical",
    "country",
    "electronic",
    "folk",
    "funky & groovy",
    "hip hop",
    "holiday",
    "indie",
    "jazz",
    "latin",
    "pop",
    "reggae",
    "rock",
    "singer-songwriter",
    "soul & rnb",
    "world",

    "none",
]
MOODS = [
    "uplifting",
    "powerful",
    "happy",
    "carefree",
    "hopeful",
    "love",
    "playful",
    "peaceful",
    "serious",
    "dramatic",
    "angry",
    "tense",
    "sad",
    "dark",
]
THEMES = [
    "aerials",
    "animals",
    "business",
    "building & city",
    "education",
    "fashion",
    "food",
    "industry",
    "landscape",
    "lifestyle",
    "medical",
    "nature",
    "party",
    "people",
    "road trip",
    "science",
    "slow motion",
    "sport & fitness",
    "technology",
    "time-lapse",
    "travel",
    "vlog",
    "vintage",
    "weddings",
]
INSTRUMENTS = [
    "acoustic drums",
    "acoustic guitar",
    "backing vocals",
    "bells",
    "claps & snaps",
    "electric guitar",
    "electronic drums",
    "ethnic",
    "keys",
    "mandolin & ukulele",
    "orchestra",
    "percussion",
    "piano",
    "strings",
    "synth",
    "vocal",
    "whistle",
    "wind instruments",
]
NEW_MAPPINGS = {
    "funk": "funky & groovy",
    "postrock": "rock",
    "soul and r&b": "soul & rnb",
    "new age": "world",
    "hip hop and r&b": "hip hop",
    "blues & soul": "blues",
    "tense & scary": "tense",
    "scary & dark": "dark",
    "dark & scary": "dark",
    "nightlife": "party",
    "back vocal": "backing vocals",
    "classical & orchestral": "orchestra",
    "orchestral": "orchestra",
    "percussions": "percussion",
    "drums": "acoustic drums",
    "whistling": "whistle",
    "": "none",
}

class SongGenreLink(SQLModel, table=True):
    song_id: uuid.UUID = Field(foreign_key="song.id", primary_key=True)
    genre_id: uuid.UUID = Field(foreign_key="genre.id", primary_key=True)

class SongMoodLink(SQLModel, table=True):
    song_id: uuid.UUID = Field(foreign_key="song.id", primary_key=True)
    mood_id: uuid.UUID = Field(foreign_key="mood.id", primary_key=True)

class SongThemeLink(SQLModel, table=True):
    song_id: uuid.UUID = Field(foreign_key="song.id", primary_key=True)
    theme_id: uuid.UUID = Field(foreign_key="theme.id", primary_key=True)

class SongInstrumentLink(SQLModel, table=True):
    song_id: uuid.UUID = Field(foreign_key="song.id", primary_key=True)
    instrument_id: uuid.UUID = Field(foreign_key="instrument.id", primary_key=True)


class Genre(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    genre: str = Field(index=True)
    songs: list["Song"] = Relationship(back_populates="genres", link_model=SongGenreLink)

class Mood(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    mood: str = Field(index=True)
    songs: list["Song"] = Relationship(back_populates="moods", link_model=SongMoodLink)

class Theme(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    theme: str = Field(index=True)
    songs: list["Song"] = Relationship(back_populates="themes", link_model=SongThemeLink)

class Instrument(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    instrument: str = Field(index=True)
    songs: list["Song"] = Relationship(back_populates="instruments", link_model=SongInstrumentLink)


class ArtistBase(SQLModel):
    name: str = Field(index=True)


class Artist(ArtistBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    albums: list["Album"] = Relationship(back_populates="artist")
    songs: list["Song"] = Relationship(back_populates="artist")


class ArtistPublic(ArtistBase):
    id: uuid.UUID


class ArtistPublicWithAlbums(ArtistPublic):
    albums: list["Album"]


class AlbumBase(SQLModel):
    name: str = Field(index=True)


class Album(AlbumBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    artist_id: uuid.UUID | None = Field(default=None, foreign_key="artist.id")
    artist: Artist | None = Relationship(back_populates="albums")
    songs: list["Song"] = Relationship(back_populates="album")

class AlbumPublic(AlbumBase):
    id: uuid.UUID
    artist: Artist


class AlbumPublicWithSongs(AlbumPublic):
    songs: list["Song"]


class SongBase(SQLModel):
    title: str = Field(index=True)
    duration: float


class Song(SongBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    filepath: str

    artist_id: uuid.UUID | None = Field(default=None, foreign_key="artist.id")
    artist: Artist | None = Relationship(back_populates="songs")

    album_id: uuid.UUID | None = Field(default=None, foreign_key="album.id")
    album: Album | None = Relationship(back_populates="songs")

    genres: list[Genre] = Relationship(back_populates="songs", link_model=SongGenreLink)
    moods: list[Mood] = Relationship(back_populates="songs", link_model=SongMoodLink)
    themes: list[Theme] = Relationship(back_populates="songs", link_model=SongThemeLink)
    instruments: list[Instrument] = Relationship(back_populates="songs", link_model=SongInstrumentLink)


class SongPublic(SongBase):
    id: uuid.UUID
    artist: Artist
    album: Album


class SongPublicWithGenres(SongPublic):
    genres: list[Genre] = []
    moods: list[Mood] = []
    themes: list[Theme] = []
    instruments: list[Instrument] = []
