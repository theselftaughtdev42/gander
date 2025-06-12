from pathlib import Path
import webbrowser
import requests

SUPPORTED_EXTS = ('.mp3', '.flac', '.m4a', '.ogg', '.wav')
ART_TRACKER = Path("art/_tracker")
NO_ART_TRACKER = Path("art/_no_tracker")
Path("art").mkdir(exist_ok=True)

def main():
    ART_TRACKER.touch()
    NO_ART_TRACKER.touch()

    done_art = ART_TRACKER.read_text()
    no_art = NO_ART_TRACKER.read_text()

    albums_done = len(done_art.splitlines()) + len(no_art.splitlines())

    for dir in [d for d in Path("./music").iterdir() if d.is_dir()]:
        if dir.name in done_art or dir.name in no_art:
            continue

        artist, album = dir.name.split(" - ")
        image_name = dir.name.replace(" ", "_")
        query = "+".join([*artist.split(" "), *album.split(" ")])

        print(f"{albums_done} albums processed 🚀")
        webbrowser.open(f"https://www.google.com/search?q=Artlist+{query}")
        print(f"Artist: {artist}")
        print(f"Album: {album}")
        url = input("URL: ")

        if url == "q":
            exit("Script terminated.")
        if url == "n":
            with NO_ART_TRACKER.open("a") as file:
                file.write(f"{dir.name}\n")
            albums_done += 1
            continue

        response = requests.get(url)
        with open(f"art/{image_name}.jpg", "wb") as file:
            file.write(response.content)
        
        with ART_TRACKER.open("a") as file:
            file.write(f"{dir.name}\n")

        albums_done += 1


if __name__ == "__main__":
    main()