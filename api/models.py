from sqlmodel import Field, SQLModel, Relationship

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
    song_id: int | None = Field(default=None, foreign_key="song.id", primary_key=True)
    genre_id: int | None = Field(default=None, foreign_key="genre.id", primary_key=True)

class SongMoodLink(SQLModel, table=True):
    song_id: int | None = Field(default=None, foreign_key="song.id", primary_key=True)
    mood_id: int | None = Field(default=None, foreign_key="mood.id", primary_key=True)

class SongThemeLink(SQLModel, table=True):
    song_id: int | None = Field(default=None, foreign_key="song.id", primary_key=True)
    theme_id: int | None = Field(default=None, foreign_key="theme.id", primary_key=True)

class SongInstrumentLink(SQLModel, table=True):
    song_id: int | None = Field(default=None, foreign_key="song.id", primary_key=True)
    instrument_id: int | None = Field(default=None, foreign_key="instrument.id", primary_key=True)


class Genre(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    genre: str = Field(index=True)
    songs: list["Song"] = Relationship(back_populates="genres", link_model=SongGenreLink)

class Mood(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    mood: str = Field(index=True)
    songs: list["Song"] = Relationship(back_populates="moods", link_model=SongMoodLink)

class Theme(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    theme: str = Field(index=True)
    songs: list["Song"] = Relationship(back_populates="themes", link_model=SongThemeLink)

class Instrument(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    instrument: str = Field(index=True)
    songs: list["Song"] = Relationship(back_populates="instruments", link_model=SongInstrumentLink)


class Song(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    artist: str = Field(index=True)
    album: str = Field(index=True)
    duration: float
    filepath: str
    genres: list[Genre] = Relationship(back_populates="songs", link_model=SongGenreLink)
    moods: list[Mood] = Relationship(back_populates="songs", link_model=SongMoodLink)
    themes: list[Theme] = Relationship(back_populates="songs", link_model=SongThemeLink)
    instruments: list[Instrument] = Relationship(back_populates="songs", link_model=SongInstrumentLink)
