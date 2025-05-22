from pathlib import Path
import webbrowser
import requests

SUPPORTED_EXTS = ('.mp3', '.flac', '.m4a', '.ogg', '.wav')
ART_TRACKER = Path("art/_tracker")
NO_ART_TRACKER = Path("art/_no_tracker")

def main():
    ART_TRACKER.touch()
    NO_ART_TRACKER.touch()

    done_art = ART_TRACKER.read_text()
    no_art = NO_ART_TRACKER.read_text()

    for dir in [d for d in Path("./music").iterdir() if d.is_dir()]:
        if dir.name in done_art or dir.name in no_art:
            continue

        artist, album = dir.name.split(" - ")
        image_name = dir.name.replace(" ", "_")
        query = "+".join([*artist.split(" "), *album.split(" ")])

        webbrowser.open(f"https://www.google.com/search?q=Artlist+{query}")
        url = input("URL: ")

        if url == "q":
            exit("Script terminated.")
        if url == "n":
            with NO_ART_TRACKER.open("a") as file:
                file.write(f"{dir.name}\n")
            continue

        response = requests.get(url)
        with open(f"art/{image_name}.jpg", "wb") as file:
            file.write(response.content)
        
        with ART_TRACKER.open("a") as file:
            file.write(f"{dir.name}\n")


if __name__ == "__main__":
    main()