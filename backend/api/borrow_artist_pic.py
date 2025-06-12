from pathlib import Path
import webbrowser
import requests

SUPPORTED_EXTS = ('.mp3', '.flac', '.m4a', '.ogg', '.wav')
PIC_TRACKER = Path("pics/_tracker")
NO_PIC_TRACKER = Path("pics/_no_tracker")
Path("pics").mkdir(exist_ok=True)

def main():
    PIC_TRACKER.touch()
    NO_PIC_TRACKER.touch()

    done_art = PIC_TRACKER.read_text()
    no_art = NO_PIC_TRACKER.read_text()

    artists_done = len(done_art.splitlines()) + len(no_art.splitlines())

    for dir in [d for d in Path("./music").iterdir() if d.is_dir()]:
        artist, _ = dir.name.split(" - ")

        if artist in done_art or artist in no_art:
            continue

        print(f"{artists_done} artists processed 🚀")
        webbrowser.open(f"https://www.google.com/search?q=Artlist+{artist}")
        print(f"Artist: {artist}")
        url = input("URL: ")

        if url == "q":
            exit("Script terminated.")
        if url == "n":
            with NO_PIC_TRACKER.open("a") as file:
                file.write(f"{artist}\n")
                no_art = NO_PIC_TRACKER.read_text()
            artists_done += 1
            continue

        response = requests.get(url)
        with open(f"pics/{artist}.jpg", "wb") as file:
            file.write(response.content)
        
        with PIC_TRACKER.open("a") as file:
            file.write(f"{artist}\n")
            done_art = PIC_TRACKER.read_text()

        artists_done += 1


if __name__ == "__main__":
    main()