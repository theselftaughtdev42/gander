FROM python:3.13-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/

ADD . /app

WORKDIR /app
RUN mkdir music

RUN uv sync

CMD ["uv", "run", "fastapi", "run", "api/main.py", "--port", "80"]