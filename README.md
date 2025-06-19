# gander

This is a for-fun project to help me organise/navigate/filter/listen to all the songs I downloaded from [Artlist](https://artlist.io/) many moons ago. It is very much fine tuned to the music files I own and may not work against 'any' music files as well as hoped. Much of the data cleaning steps target specific naming issues I faced with these specific songs.

*This is NOT a production-ready project by any means, it is intended for local use.*

## Screenshots
<table>
  <tr>
    <td><img src="https://raw.githubusercontent.com/theselftaughtdev42/turbo-umbrella/refs/heads/main/gander/gander_songs.jpg" width="600"/></td>
    <td><img src="https://raw.githubusercontent.com/theselftaughtdev42/turbo-umbrella/refs/heads/main/gander/gander_albums.jpg" width="600"/></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/theselftaughtdev42/turbo-umbrella/refs/heads/main/gander/gander_artists.jpg" width="600"/></td>
    <td><img src="https://raw.githubusercontent.com/theselftaughtdev42/turbo-umbrella/refs/heads/main/gander/gander_search.jpg" width="600"/></td>
  </tr>
</table>

## Stack
- API: FastAPI
- UI: React

## Getting Started
### Organise Music and Acquire Imagery
- This project expects all music files to be in a dir called `/backend/api/music/*` and organised into directories using the following naming convention: `<Artist Name> - <Album Name>` for example `/backend/api/music/Assaf Ayalon - Feet On Water/*.mp3`.
- `cd backend`
- `uv sync` to install deps into a virtual environment
- `uv run -m api.borrow_album_art`: I could not identify a reliable way to completely automate acquiring album art (and some albums have been either removed or merged with other albums since I downloaded these songs...) so this script will do a google search for you and await a URL in order to download an associated image. Typing `n` into the URL prompt will denote 'No Album Art' (for which I use a placeholder image) and `q` will quit the script.
- `uv run -m api.borrow_artist_pic`: Again, I could not identify a reliable way to completely automate acquiring artist profile pic (and some artists have either changed their name or are no longer on Artlist so requires deeper manual research). Typing `n` into the URL prompt will denote 'No Artist Profile Pic' and `q` will quit the script.
- `uv run -m api.ingest_songs`: this will trigger the ingesting of all the songs into a sqlite database. This can also be triggered from the UI (see below).
## Spin Up App
- `docker compose up`
- Open `http://localhost:3000` in your browser.
- If you did not run the ingest script mentioned above, then you should see 'No songs/albums etc Found' messages throughout the app. If so then manually go to `http://localhost:3000/ingest` and trigger the ingest from there. Depending on how much music you have and the hardware you're running on, this could take a few seconds to many minutes.
- Done 🚀