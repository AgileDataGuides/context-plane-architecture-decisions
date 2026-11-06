# Context Plane Architecture Decisions Compares the Valid Patterns and Records the One a Team Chose

**6 November 2026**

AgileDataGuides today released Context Plane Architecture Decisions, a standalone app that explains the decisions a team makes when it builds a Context Plane, compares the valid patterns for each decision, and records the pattern the team chose.

## The Problem

A team that builds a Context Plane has many decisions to make, and no agreed good practice to lean on. Every team is still experimenting. A person who asks "should all our context live in one place, or stay with each team?" gets a different answer from each vendor and each practitioner, and each answer sounds certain. The patterns behind those answers are all valid. What the team lacks is a plain way to see the patterns side by side, to see what each one gives and what each one costs, and to remember which one it picked and why.

## The Solution

Context Plane Architecture Decisions takes one decision at a time. It states the question, says why the decision matters, and shows the valid patterns side by side. Each pattern says what it is, gives an example from a SaaS company, and lists what the team gains, what the team pays, and when the pattern fits. The team chooses a pattern and writes down its reason. A Decisions grid then shows every decision together: the pattern chosen, what it gives, what it costs, which other decisions it limits, and the team's reason.

The app does not rank the patterns. It marks the pattern AgileData uses as a worked example, and no pattern is called best.

The app opens with 19 decisions across 13 moving parts of a Context Plane, from where the context lives to how an AI agent reads it. The first decision is "Where does your context live?", with three patterns: Centralised, Federated, and Hub and spoke. Each of the three has a diagram that shows its shape.

## How It Works

The app opens on a **Steps** tab, the same as the other AgileDataGuides apps. Each step is one decision and its patterns, with a button on each pattern to choose it and a field for the reason. The last step lists the decisions with no pattern yet. A **Decisions** tab shows every decision on one grid, grouped by moving part. A decision with no pattern shows as an empty row, so the gaps are plain to see. **Export JSON**, above the tabs, saves the choices as a file. An **Instructions** tab says what a Context Plane is and how to use the app.

The choices are stored in the browser. Nothing is sent to a server.

## Key Benefits

- **See the valid patterns side by side** — a team reads across the patterns for one decision, in the same words and the same layout
- **Know the cost before choosing** — every pattern states what the team pays, not only what it gains
- **Keep the reason** — the team's own words stay with the choice, so the reason is still there six months later
- **One grid of decisions** — every decision, its pattern, its gains, its costs and the decisions it limits
- **No winner declared** — the app compares patterns and leaves the choice to the team

Context Plane Architecture Decisions is available now at [github.com/AgileDataGuides/context-plane-architecture-decisions](https://github.com/AgileDataGuides/context-plane-architecture-decisions).
