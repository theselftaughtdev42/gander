import music_tag
from pathlib import Path
import json


def extract_title_album_artist(filepath: Path):
    title = str(filepath.name).split(" by ")[0].strip()
    split = str(filepath.parent.name).split(" - ")
    artist, album = str(split[0]).strip(), str(split[1]).strip()
    return title, album, artist


def standardise_genre(genre: list):
    new_list = []
    for item in genre:
        new_list.append(item.strip().lower())
    return list(set(new_list))


def create_filepath(path: Path):
    return str(path.parent.name) + "/" + str(path.name)


music_location = Path("/Users/timmackay/Music/Art-list")
unique_genres = []
uid_count = 1
songs_database = []

for path in sorted(music_location.glob("**/*.mp3")):
    title, album, artist = extract_title_album_artist(path)
    filepath = create_filepath(path)
    file = music_tag.load_file(path)
    genre = str(file["genre"]).split(",")

    if len(genre) < 2 and genre[0].strip() == '':
        continue

    genre = standardise_genre(genre)

    songs_database.append({
        "uid": uid_count,
        "title": title,
        "album": album,
        "artist": artist,
        "genres": genre,
        "filepath": filepath
    })

    uid_count = uid_count + 1

json_file = open("data.json", "w")
json_file.write(json.dumps(songs_database))
json_file.close()