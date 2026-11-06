# A Systems Map Now Draws the Context Plane Architecture a Team Chose

**6 November 2026**

AgileDataGuides today released a Map tab in Context Plane Architecture Decisions, which draws a team's decisions as one systems map whose shape changes with each choice.

## The Problem

Nineteen decisions in a grid are easy to check and hard to picture. A team could read every row and still not see what it had designed: where the context sits, how it gets there, and how an AI agent reaches it. Two architectures with different choices looked almost the same on the grid, because a grid of words has one shape whatever the words say.

## The Solution

The Map tab draws the architecture as places and flows. The source systems sit on the left, the Context Plane in the centre, and an AI agent and people on the right. Arrows show how context moves between them. Each decision appears on the place or the flow it belongs to, with the pattern the team chose.

The map changes shape with the choices. Choose a federated pattern, and each source system holds its own context and the centre loses its store. Choose an agent that proposes changes, and a dashed arrow appears from the agent back to the Context Plane. A flow with no decision yet shows as a light dotted line, so a team sees what is left to decide.

## How It Works

The Map tab sits after the Decisions tab. It always shows the architecture on screen, so switching architecture redraws the map. One click on any decision on the map opens its step.

## Key Benefits

- **See the design, not a list** — where context lives, how it gets in, and how an agent reaches it, in one picture
- **Two architectures look different** — a change of pattern changes the shape of the map
- **See what is left** — a flow with no decision is a light dotted line
- **One click to the detail** — every decision on the map opens its step

The Map tab is available now at [github.com/AgileDataGuides/context-plane-architecture-decisions](https://github.com/AgileDataGuides/context-plane-architecture-decisions).
