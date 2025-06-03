from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

from .dependencies import lifespan
from .routers import artists, albums, filter, songs


app = FastAPI(lifespan=lifespan)

app.include_router(artists.router)
app.include_router(albums.router)
app.include_router(songs.router)
app.include_router(filter.router)

music_dir = os.path.abspath("music")
app.mount("/song_files", StaticFiles(directory=music_dir), name="song_files")


@app.get("/")
def root():
    return "Welcome to the Gander API!"

