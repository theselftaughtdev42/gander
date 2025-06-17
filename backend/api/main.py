from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .dependencies import lifespan
from .routers import artists, albums, filter, songs
from .ingest_songs import run_ingest


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
app.mount("/profile_pics", StaticFiles(directory="pics"), name="profile_pics")


@app.get("/")
def root():
    return "Welcome to the Gander API!"

@app.get("/ingest")
def ingest():
    run_ingest()
    # return StreamingResponse(run_ingest(), media_type="text/event-stream")