from fastapi import FastAPI

from .dependencies import lifespan
from .routers import artists, albums, filter, songs


app = FastAPI(lifespan=lifespan)

app.include_router(artists.router)
app.include_router(albums.router)
app.include_router(songs.router)
app.include_router(filter.router)

@app.get("/")
def root():
    return "Welcome to Gander!"

