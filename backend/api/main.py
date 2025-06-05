from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .dependencies import lifespan
from .routers import artists, albums, filter, songs


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(artists.router)
app.include_router(albums.router)
app.include_router(songs.router)
app.include_router(filter.router)

app.mount("/song_files", StaticFiles(directory="music"), name="song_files")
app.mount("/album_art", StaticFiles(directory="art"), name="album_art")


@app.get("/")
def root():
    return "Welcome to the Gander API!"
