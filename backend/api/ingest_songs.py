from pathlib import Path
from tinytag import TinyTag
from rich import print
from sqlmodel import Session, select
import re

from .db import create_db_and_tables, drop_all_tables, engine
from .models import (
    GENRES,
    MOODS,
    THEMES,
    INSTRUMENTS,
    NEW_MAPPINGS,
    Genre,
    Mood,
    Theme,
    Instrument,
    Song,
    Artist,
    Album,
)

SUPPORTED_EXTS = ('.mp3', '.flac', '.m4a', '.ogg', '.wav')

def load_genres():
    session = Session(engine)

    print("Loading Genres...")
    for genre in GENRES:
        session.add(Genre(name=genre))
    
    print("Loading Moods...")
    for mood in MOODS:
        session.add(Mood(name=mood))
    
    print("Loading Themes...")
    for theme in THEMES:
        session.add(Theme(name=theme))

    print("Loading Instruments...")
    for instrument in INSTRUMENTS:
        session.add(Instrument(name=instrument))
    
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
                result = session.exec(select(Genre).where(Genre.name == genre)).one()
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
                result = session.exec(
                    select(Instrument).where(Instrument.name == instrument)
                ).one()
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
                result = session.exec(select(Theme).where(Theme.name == theme)).one()
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
                result = session.exec(select(Mood).where(Mood.name == mood)).one()
                mood_cache[mood] = result
                results.append(result)
    return results

def load_artists_and_albums():
    print("Loading Artists and Albums...")
    session = Session(engine)
    artists_done = []
    albums_done = []

    for dir in [d for d in Path("./music").iterdir() if d.is_dir()]:
        raw_artist, raw_album = dir.name.split(" - ")
        profile_pic = f"{raw_artist}.jpg"
        if not Path("pics", profile_pic).exists():
            print(f"No profile pic for {profile_pic}")
            profile_pic = None

        if raw_artist not in artists_done:
            artist = Artist(name=raw_artist, profile_pic_filepath=profile_pic)
            session.add(artist)
            session.commit()
            session.refresh(artist)
            artists_done.append(raw_artist)
        else:
            artist = session.exec(select(Artist).where(Artist.name == raw_artist)).one()

        if f"{raw_artist}-{raw_album}" not in albums_done:
            album_art_filepath = dir.name.replace(" ", "_") + ".jpg"
            if not Path("art", album_art_filepath).exists():
                album_art_filepath = "NoAlbumArt.jpg"

            album = Album(
                name=raw_album,
                artist=artist,
                art_filepath=album_art_filepath,
            )
            session.add(album)
            session.commit()
            session.refresh(album)
            session.refresh(artist)
            albums_done.append(f"{raw_artist}-{raw_album}")


def load_songs():
    print("Loading Songs...")
    yield "data: Loading Songs...\n\n"
    session = Session(engine)
    count = 0
    # iterate over dirs and files in alphanumeric order
    for root, _, files in sorted(Path("./music").walk(), key=lambda x: str(x[0])):
        for file in sorted(files):
            if file.lower().endswith(SUPPORTED_EXTS):
                count += 1
                try:
                    file_path = Path(root / file)
                    tag = TinyTag.get(file_path)

                    artist, album = file_path.parent.name.split(" - ")
                    artist = session.exec(
                        select(Artist).where(Artist.name == artist)
                    ).one()
                    album = session.exec(
                        select(Album)
                        .where(Album.artist_id == artist.id)
                        .where(Album.name == album)
                    ).one()

                    raw_genres = ["None"] if tag.genre is None else tag.genre.split(",")
                    raw_genres = [genre.strip().lower() for genre in raw_genres]
                    raw_genres = [NEW_MAPPINGS.get(genre, genre) for genre in raw_genres]
                    raw_genres = [genre for genre in raw_genres if genre not in ["low", "medium", "high"]]
                    raw_genres = set(raw_genres)

                    genres = get_genres(raw_genres)
                    moods = get_moods(raw_genres)
                    themes = get_themes(raw_genres)
                    instruments = get_instruments(raw_genres)

                    ##############################################
                    ## DATA CLEANING SPECIFIC TO MY OWN DATASET ##
                    ##############################################
                    file_title = file_path.name.split(" by ")[0].strip()
                    title = tag.title.split(" by ")[0].strip().title() if tag.title is not None else file_title

                    # keep the longer of the two titles
                    if file_title != title:
                        title = title if len(title) > len(file_title) else file_title

                    # ensure the one with 'instrumental' is retained
                    if (
                        "instrumental" in file_title.lower()
                        and "instrumental" not in title.lower()
                    ):
                        title = file_title

                    # identify a song that has multiple versions and append to title
                    version = None
                    if match := re.search(r"\(\d\).mp3$", file_path.name):
                        version = int(match.group()[1:2]) + 1
                        title += f" - Version {version}"
                    if match := re.search(r"Artlist-\d\.mp3$", file_path.name):
                        if " Ver " not in title and " Ver." not in title:
                            version = int(match.group()[8:9])
                            title += f" - Version {version}"
                    # fix songs with double digits at the start
                    title = re.sub(r"^\d{2}\s", "", title)

                    # fix songs ending in '.Mp3' and remove that
                    title = re.sub(r"\.Mp3$", "", title)
                    title = re.sub(r"\.mp3$", "", title)

                    # fix songs with metadata in the name:
                    title = re.sub(r" - Master 16-441$", "", title)
                    title = re.sub(r" - Master 16-441 -$", "", title)
                    title = re.sub(r" -Master 16-441$", "", title)
                    title = re.sub(r" - Master 16-441", "", title)
                    title = re.sub(r" - Master16-441$", "", title)
                    title = re.sub(r" - Master16-441\.1$", "", title)
                    title = re.sub(r" - Master 16-44", "", title)
                    title = re.sub(r" - Master 16-4$", "", title)
                    title = re.sub(r" - Master 16-", "", title)
                    title = re.sub(r" - Maste 16-441$", "", title)
                    title = re.sub(r" - Master 16$", "", title)
                    title = re.sub(r" - 16Bit$", "", title)
                    title = re.sub(r" - Master 16Bit$", "", title)
                    title = re.sub(r" - Master$", "", title)
                    title = re.sub(r" - Master 1", "", title)
                    title = re.sub(r" -$", "", title)
                    title = re.sub(r" \($", "", title)
                    title = re.sub(r"^\?", "", title)

                    # misc
                    title = title.replace(" - - ", " - ")
                    title = title.replace("Again6_01", "Again")

                    # SPECIFIC SITUATIONS
                    if artist == "AamityMae":
                        title = title.replace("I'M", "I'm")
                    if artist == "Alon Ohana":
                        title = title.replace("'S", "'s")

                    if file_path.parts[0] != "music":
                        raise Exception("Unexpected filepath")

                    stripped_filepath = Path(*file_path.parts[1:])

                    song = Song(
                        title=title,
                        artist=artist,
                        album=album,
                        duration=round(tag.duration, 2),
                        filepath=str(stripped_filepath),
                        track_number=len(album.songs),
                        genres=genres,
                        moods=moods,
                        themes=themes,
                        instruments=instruments,
                    )

                    session.add(song)
                    session.commit()

                    if count % 200 == 0:
                        yield f"data: Loaded {count} songs...\n\n"

                except Exception as e:
                    print(f"Error reading {file_path}: {e}")

    session.close()
    print(f"Loaded {count} songs")
    yield f"data: Loaded {count} songs.\n\n"
    yield "data: Ingest Complete!\n\n"

def run_ingest():
    drop_all_tables()
    create_db_and_tables()
    load_genres()
    load_artists_and_albums()
    for progress_msg in load_songs():
        yield progress_msg + "\n"

if __name__ == "__main__":
    for progress_msg in run_ingest():
        print(progress_msg)
