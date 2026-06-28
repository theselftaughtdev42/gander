# Gander — Domain Glossary

Gander is a personal tool for navigating a music library (sourced from [Artlist](https://artlist.io/)) to find tracks suitable for use in content creation.

---

## Terms

### Song
A single piece of music. The primary object a user navigates and plays. Songs are the unit of browsing, filtering, and playback.

### Artist
The creator of one or more Songs and Albums. Identity is derived from the directory name convention `<Artist Name> - <Album Name>/`.

### Album
A named collection of Songs by an Artist. Identity is derived from the directory name convention. Not necessarily a commercial release — may be an Artlist grouping.

### Tag
A metadata label attached to a Song. There are four Tag Types: **Genre**, **Mood**, **Theme**, and **Instrument**. Tags are extracted from the ID3 `genre` field of the audio file and classified into the appropriate Tag Type during Ingest.

#### Tag Types
- **Genre** — musical style (e.g. acoustic, cinematic, electronic)
- **Mood** — emotional tone (e.g. uplifting, dark, tense)
- **Theme** — intended visual/usage context (e.g. travel, weddings, sport & fitness)
- **Instrument** — instrumentation featured (e.g. piano, strings, synth)

### Discovery
Finding Songs. There are three Discovery mechanisms: **Filter**, **Random** and **Search**. All serve the same goal — locating Songs to use in content.

- **Filter** — narrows Songs by one or more Tags (Genre, Mood, Theme, Instrument)
- **Search** — matches text across Song titles, Artist names, and Album names
- **Random** — surfaces Songs by chance; a "surprise me" mode for encountering Songs that might not surface through Filter or Search

### Favourite
A Song marked by the user for easy retrieval. Carries no implied meaning about usage history.

### Playback
Previewing a Song in-browser before deciding to Download it. Always in-browser. There is no concept of a queue or sequential playback — Songs are played one at a time.

### Download
Saving a Song file to the user's machine for use in content creation. The primary end-goal of the app — Discovery and Playback are steps toward Download.

### User
A person with access to Gander. There are two roles:

- **Owner** — the person who runs the app. Can create and manage Member accounts. Has full access.
- **Member** — a member granted access by the Owner. Can browse the shared library and manage their own Favourites.

#### Shared vs Per-User data
- **Shared** — Songs, Artists, Albums, Tags (the music library)
- **Per-User** — Favourites

### Ingest
The process of reading music files from disk and loading them into the database. The current implementation is an **Artlist Ingest** — tightly coupled to Artlist's file naming conventions and metadata quirks. The intent is for the pipeline to remain extensible to other sources in future.

### Artlist Ingest
The specific Ingest variant for music sourced from Artlist. Handles Artlist's directory naming convention (`<Artist Name> - <Album Name>/`), normalises Artlist-specific Tag mappings, and applies data-cleaning rules specific to Artlist metadata.
