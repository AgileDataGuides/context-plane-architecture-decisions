# A Team Can Now Keep More Than One Context Plane Architecture and Switch Between Them

**6 November 2026**

AgileDataGuides today released named architectures in Context Plane Architecture Decisions, so a team can record more than one set of decisions and switch between them.

## The Problem

A team rarely has one answer. It has the architecture it runs today, the one it wants next year, and an option somebody raised last week. The app held one set of decisions, so a team that wanted to explore an option had to overwrite the decisions it had already made, or keep the option in its head. Neither helps a team talk about a trade-off.

## The Solution

A team can now create as many architectures as it needs. Each one has a name, a description and its own choice for every decision. The name at the top right of the app switches between them, and the steps, the patterns chosen and the Decisions grid all change to show the architecture picked.

A team can also save an architecture as a file and bring it back, on the same computer or another one.

## How It Works

**New Architecture** in the header makes an empty architecture. **Import** brings in a file made by **Export JSON**, always as a new architecture beside the others, so it never overwrites one. **Delete** removes the architecture on screen. The name and the description sit under the header, and one click on either edits it.

Every architecture is stored in the browser. Nothing is sent to a server.

## Key Benefits

- **Keep today and tomorrow apart** — one architecture for what runs now, one for where the team wants to go
- **Explore an option safely** — a new architecture starts empty, and the decisions already made stay as they are
- **Share a set of decisions** — export an architecture as a file and import it on another computer
- **Nothing is overwritten** — an import always lands as a new architecture

Named architectures are available now at [github.com/AgileDataGuides/context-plane-architecture-decisions](https://github.com/AgileDataGuides/context-plane-architecture-decisions).
