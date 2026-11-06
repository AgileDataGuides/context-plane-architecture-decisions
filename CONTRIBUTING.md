# Contributing

Thanks for your interest in contributing to Context Plane Architecture Decisions!

This is an early draft. The most useful contribution right now is feedback on the content: a decision that is missing, a pattern that is missing, or a gain or a cost that is wrong. Open an issue and say what you would change.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Run `./start-context-plane-architecture-decisions.sh` to install dependencies and start the dev server
4. Make your changes
5. Submit a pull request

## Development

The app is built with SvelteKit 5 + Svelte 5 runes, Tailwind CSS 4, and TypeScript.

```bash
cd app
npm install
npm run dev -- --port 5125
```

The decisions and their patterns are content, not code. They live in one file, `data/lookups/decisions.json`.

## What to Contribute

- A decision or a pattern that is missing
- A better gain, cost or "fits when" for a pattern
- A diagram for a pattern
- A pattern that should change the shape of the map
- Bug fixes
- Accessibility improvements

## Content Style

- There is no agreed good practice yet. Compare the patterns. Do not rank them.
- Every pattern states what you gain, what you pay and when it fits.
- Short sentences and common words. One idea per sentence.

## Code Style

- TypeScript with strict mode
- Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Tailwind CSS for styling
- No unnecessary abstractions. Keep it simple

## Licensing

By contributing, you agree that your contributions will be licensed under:

- **Code**: MIT License
- **Content (the decisions and patterns) and documentation**: CC BY-SA 4.0
