# Context Plane Architecture Decisions

Understand the decisions a team makes when it builds a Context Plane. Compare the valid patterns for each decision, record the pattern your team chose, and see the result as a grid and as a systems map.

An [AgileDataGuides](https://agiledataguides.com/agiledata-templates/) Pattern Template app.

> **Early draft, shared for feedback.** The wording of the decisions and patterns is a first draft. If a decision or a pattern is missing, or a gain or a cost is wrong, please [open an issue](https://github.com/AgileDataGuides/context-plane-architecture-decisions/issues).

## Try It Online

**[Launch the Live Demo](https://agiledataguides.github.io/context-plane-architecture-decisions)**. No install required. The demo runs entirely in your browser. Your data is saved in localStorage and never leaves your device.

## Why It Exists

There is no agreed good practice for building a Context Plane yet. Teams are still experimenting, and each vendor gives a different answer. This app does not tell you which pattern is best. It shows the valid patterns for each decision, what you gain with each one, and what you pay.

## What It Does

| Tab | Purpose |
|-----|---------|
| **20 Steps** | One step per decision. Read the patterns side by side, choose one, and write down why. A last step lists the decisions with no pattern yet |
| **Decisions** | Every decision on one grid, grouped by moving part: the pattern, what you gain, what you pay, the decisions it limits and your reason |
| **Map** | Your architecture as a systems map. Places and flows, with each decision on the place or flow it belongs to. Some choices change the shape of the map |
| **Instructions** | What a Context Plane is, and how to use the app |

The app covers 19 decisions across 13 moving parts of a Context Plane, from where the context lives to how an AI agent reads it.

## Install and Run

Run `./start-context-plane-architecture-decisions.sh` from the terminal.

The app starts at [http://localhost:5125](http://localhost:5125).

**Requires**: [Node.js](https://nodejs.org/) 20.19+, 22.12+, or 24+ (not 21 or 23).

## Features

- **Patterns side by side**: every pattern states what you gain, what you pay and when it fits
- **No winner declared**: the app compares patterns and leaves the choice to your team
- **Your reason, kept**: write why you chose a pattern, and it stays with the choice
- **Decisions grid**: every decision on one page, with the gaps plain to see
- **Systems map**: one picture of the architecture you chose
- **Multiple architectures**: create, switch between and delete named architectures, for example one for today and one for an option you are weighing
- **Auto-save**: changes persist to browser localStorage
- **Export JSON**: download an architecture to share or to keep
- **Import JSON**: load an exported architecture as a new one

## The Content

The decisions and their patterns live in one file, [`data/lookups/decisions.json`](./data/lookups/decisions.json). To change the wording, add a pattern or add a decision, edit that file.

## Works With Claude

Export an architecture as JSON and use it with [Claude Code](https://claude.ai/claude-code) or [Claude Chat](https://claude.ai):

- *"Which of my decisions pull against each other?"*
- *"What do I still need to decide, and in what order?"*
- *"Write up this architecture as a one-page summary for my team"*

## Data Storage

Everything is stored in your browser's localStorage. There is no server. **Export JSON** downloads a file to your downloads folder for sharing or backup.

## Tech Stack

- [SvelteKit 5](https://svelte.dev/) with Svelte 5 runes
- [Tailwind CSS 4](https://tailwindcss.com/)
- TypeScript

## Licensing

- **Code**: [MIT](./LICENSE)
- **Content and documentation**: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
