# ADR 0001 — User Authentication

## Context

Gander was originally a single-user local tool with no authentication. Multi-user internet deployment requires protecting the app from public access and scoping certain data per user.

## Decision

- **Controlled account creation** — only the Owner can create Member accounts. No open registration.
- **Two roles** — Owner (full access, manages accounts) and Member (browses library, manages own Playlists and Favourites).
- **Username + password** authentication.
- **JWT tokens** with a 30-day expiry for session management.

## Alternatives considered

**Open registration** — rejected. Gander is a private tool. Anyone who finds the URL should not be able to create an account.

**Social login (e.g. Google OAuth)** — rejected. Adds a third-party dependency.

**Server-side sessions** — rejected in favour of JWT. Instant revocation is not a meaningful requirement, and stateless tokens avoid the need for a session table.

## Consequences

- A User model with a role field (Owner/Member) must be added to the database.
- All API routes must be protected behind authentication.
- Favourites become per-User data; the music library (Songs, Artists, Albums, Tags) remains shared.
- The Owner must be seeded or created out-of-band on first deployment.
