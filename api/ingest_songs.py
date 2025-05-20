from pathlib import Path
from tinytag import TinyTag
from rich import print
from sqlmodel import Session, select

from .db import create_db_and_tables, engine
from .models import GENRES, MOODS, THEMES, INSTRUMENTS, NEW_MAPPINGS, Genre, Mood, Theme, Instrument, Song

SUPPORTED_EXTS = ('.mp3', '.flac', '.m4a', '.ogg', '.wav')

def load_genres():
    session = Session(engine)

    print("Loading Genres...")
    for genre in GENRES:
        session.add(Genre(genre=genre))
    
    print("Loading Moods...")
    for mood in MOODS:
        session.add(Mood(mood=mood))
    
    print("Loading Themes...")
    for theme in THEMES:
        session.add(Theme(theme=theme))

    print("Loading Instruments...")
    for instrument in INSTRUMENTS:
        session.add(Instrument(instrument=instrument))
    
    session.commit()
    session.close()


genre_cache = {}
def get_genres(genres: list[str]) -> list[Genre]:
    results = []
    genres = [g for g in genres if g in GENRES]
    with Session(engine) as session:
        for genre in genres:
            if genre in genre_cache:
                results.append(genre_cache[genre])
            else:
                result = session.exec(select(Genre).where(Genre.genre == genre)).one()
                genre_cache[genre] = result
                results.append(result)
    return results

instrument_cache = {}
def get_instruments(instruments: list[str]) -> list[Instrument]:
    results = []
    instruments = [i for i in instruments if i in INSTRUMENTS]
    with Session(engine) as session:
        for instrument in instruments:
            if instrument in instrument_cache:
                results.append(instrument_cache[instrument])
            else:
                result = session.exec(select(Instrument).where(Instrument.instrument == instrument)).one()
                instrument_cache[instrument] = result
                results.append(result)
    return results

theme_cache = {}
def get_themes(themes: list[str]) -> list[Theme]:
    results = []
    themes = [t for t in themes if t in THEMES]
    with Session(engine) as session:
        for theme in themes:
            if theme in theme_cache:
                results.append(theme_cache[theme])
            else:
                result = session.exec(select(Theme).where(Theme.theme == theme)).one()
                theme_cache[theme] = result
                results.append(result)
    return results

mood_cache = {}
def get_moods(moods: list[str]) -> list[Mood]:
    results = []
    moods = [m for m in moods if m in MOODS]
    with Session(engine) as session:
        for mood in moods:
            if mood in mood_cache:
                results.append(mood_cache[mood])
            else:
                result = session.exec(select(Mood).where(Mood.mood == mood)).one()
                mood_cache[mood] = result
                results.append(result)
    return results

def load_songs():
    session = Session(engine)
    count = 0
    for root, _, files in Path("./music").walk():
        for file in files:
            if file.lower().endswith(SUPPORTED_EXTS):
                count += 1
                try:
                    file_path = Path(root / file)
                    tag = TinyTag.get(file_path)

                    artist, album = file_path.parent.name.split(" - ")

                    raw_genres = ["None"] if tag.genre is None else tag.genre.split(",")
                    raw_genres = [genre.strip().lower() for genre in raw_genres]
                    raw_genres = [NEW_MAPPINGS.get(genre, genre) for genre in raw_genres]
                    raw_genres = [genre for genre in raw_genres if genre not in ["low", "medium", "high"]]
                    raw_genres = set(raw_genres)

                    genres = get_genres(raw_genres)
                    moods = get_moods(raw_genres)
                    themes = get_themes(raw_genres)
                    instruments = get_instruments(raw_genres)

                    file_title = file_path.name.split(" by ")[0].strip().title()
                    title = tag.title.split(" by ")[0].strip().title() if tag.title is not None else file_title

                    if file_title != title:
                        title = title if len(title) > len(file_title) else file_title

                    song = Song(
                        title=title,
                        artist=artist,
                        album=album,
                        duration=round(tag.duration, 2),
                        filepath=str(file_path),
                        genres=genres,
                        moods=moods,
                        themes=themes,
                        instruments=instruments,
                    )

                    session.add(song)
                    session.commit()
                    if count % 200 == 0:
                        print(f"Loaded {count} songs...")

                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
                    exit()
    session.close()
    print(f"Loaded {count} songs.")

if __name__ == "__main__":
    create_db_and_tables()
    load_genres()
    load_songs()
