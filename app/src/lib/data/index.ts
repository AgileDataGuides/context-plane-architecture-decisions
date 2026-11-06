// The content, typed. data/lookups/decisions.json is the single source of
// truth for every moving part, decision and pattern the app shows.
import raw from '$data/lookups/decisions.json';
import type { Decision, DecisionsContent, Part } from '../types';

const content = raw as unknown as DecisionsContent;

/** The moving parts of a Context Plane, in the order the content file gives. */
export const parts: Part[] = content.parts ?? [];

/** Every decision, in the order the content file gives. A part's decisions sit together. */
export const decisions: Decision[] = [...content.decisions].sort((a, b) => a.order - b.order);
