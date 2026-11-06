// A team's architectures. Each architecture is one named set of choices, one
// choice per decision, so a team can keep more than one: today's, and an
// option it is weighing.
//
// The store factory pattern: createDecisionsStore takes optional load and
// persist callbacks. With none, the architectures live in this browser's
// localStorage. A host that keeps them somewhere else passes its own.
import type { Architecture, Choices } from '../types';

const SAVED_KEY = 'context-plane-architecture-decisions-saved';
const CURRENT_KEY = 'context-plane-architecture-decisions-current-id';

export const DEFAULT_NAME = 'My Context Plane';

export interface SavedArchitectures {
	saved: Record<string, Architecture>;
	currentId?: string;
}

export interface DecisionsStoreOptions {
	load?: () => SavedArchitectures;
	onPersist?: (saved: Record<string, Architecture>, currentId: string) => void;
}

function createId(name: string): string {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'architecture';
}

function uniqueId(name: string, existing: string[]): string {
	const base = createId(name);
	if (!existing.includes(base)) return base;
	let i = 2;
	while (existing.includes(`${base}-${i}`)) i++;
	return `${base}-${i}`;
}

function blank(id: string, name: string, choices: Choices = {}): Architecture {
	return { version: 1, id, name, description: '', choices };
}

/** Decision ids that would read or change an object's prototype instead of naming a choice */
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * The architecture stored under an id. It checks the object's own entries
 * only, so an id such as `constructor` or `toString` never returns something
 * the object inherits. An architecture can be named Constructor or Prototype.
 */
function own(saved: Record<string, Architecture>, id: string | undefined): Architecture | undefined {
	return id !== undefined && Object.hasOwn(saved, id) ? saved[id] : undefined;
}

/**
 * The choices in a stored or imported value. A choice needs a pattern. With
 * `strict`, one damaged choice rejects the lot (null). Without it, a damaged
 * choice is left out and the rest are kept.
 */
function readChoices(value: unknown, strict: boolean): Choices | null {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
	const choices: Choices = {};
	for (const [decisionId, entry] of Object.entries(value as Record<string, unknown>)) {
		if (UNSAFE_KEYS.has(decisionId)) continue;
		const choice = entry as Record<string, unknown> | null;
		if (!choice || typeof choice !== 'object' || typeof choice.patternId !== 'string') {
			if (strict) return null;
			continue;
		}
		choices[decisionId] = {
			patternId: choice.patternId,
			note: typeof choice.note === 'string' ? choice.note : '',
			decidedAt: typeof choice.decidedAt === 'string' ? choice.decidedAt : new Date().toISOString()
		};
	}
	return choices;
}

/**
 * One stored architecture, or null when the stored value does not have the
 * shape of one. A damaged choice inside it is left out, so one bad choice
 * never costs a team the rest of its architecture.
 */
function readStored(value: unknown): Architecture | null {
	if (!value || typeof value !== 'object') return null;
	const stored = value as Record<string, unknown>;
	if (typeof stored.id !== 'string' || typeof stored.name !== 'string') return null;
	const choices = readChoices(stored.choices, false);
	if (!choices) return null;
	return {
		version: 1,
		id: stored.id,
		name: stored.name,
		description: typeof stored.description === 'string' ? stored.description : '',
		choices
	};
}

function loadFromBrowser(): SavedArchitectures {
	try {
		const text = localStorage.getItem(SAVED_KEY);
		if (text) {
			const parsed = JSON.parse(text);
			if (parsed && typeof parsed === 'object') {
				// Keep only the entries with the shape of an architecture, so a
				// damaged entry is left out and the app still starts
				const saved: Record<string, Architecture> = {};
				for (const value of Object.values(parsed)) {
					const architecture = readStored(value);
					// `__proto__` is the one id that cannot be stored as an entry
					if (architecture && architecture.id !== '__proto__') saved[architecture.id] = architecture;
				}
				return { saved, currentId: localStorage.getItem(CURRENT_KEY) ?? undefined };
			}
		}
	} catch {
		// no storage, or text that is not JSON: start with one empty architecture
	}
	return { saved: {} };
}

function persistToBrowser(saved: Record<string, Architecture>, currentId: string): void {
	try {
		localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
		localStorage.setItem(CURRENT_KEY, currentId);
	} catch {
		// no storage: the architectures last until reload
	}
}

/** What a file must hold to be imported: an object of choices, each with a pattern. One damaged choice rejects the file. */
export function readImport(data: unknown, fallbackName: string): { name: string; description: string; choices: Choices } | null {
	if (!data || typeof data !== 'object') return null;
	const file = data as Record<string, unknown>;
	const choices = readChoices(file.choices, true);
	if (!choices) return null;
	return {
		name: typeof file.name === 'string' && file.name.trim() ? file.name.trim() : fallbackName,
		description: typeof file.description === 'string' ? file.description : '',
		choices
	};
}

export function createDecisionsStore(options: DecisionsStoreOptions = {}) {
	const loaded = (options.load ?? loadFromBrowser)();

	let saved = $state<Record<string, Architecture>>(loaded.saved);
	if (Object.keys(saved).length === 0) {
		const first = blank(createId(DEFAULT_NAME), DEFAULT_NAME);
		saved[first.id] = first;
	}
	// The entry in saved, never a copy: an edit to a copy would never reach saved
	let current = $state<Architecture>(own(saved, loaded.currentId) ?? Object.values(saved)[0]);

	function persist() {
		// $state.snapshot, never structuredClone: a $state value is a proxy
		const snapshot = $state.snapshot(saved);
		if (options.onPersist) options.onPersist(snapshot, current.id);
		else persistToBrowser(snapshot, current.id);
	}

	function add(architecture: Architecture) {
		saved[architecture.id] = architecture;
		current = saved[architecture.id];
		persist();
	}

	return {
		/** The architecture on screen */
		get current(): Architecture {
			return current;
		},

		/** The current architecture's choices */
		get choices(): Choices {
			return current.choices;
		},

		get savedList(): { id: string; name: string }[] {
			return Object.values(saved).map((a) => ({ id: a.id, name: a.name }));
		},

		switchTo(id: string) {
			const target = own(saved, id);
			if (!target) return;
			current = target;
			persist();
		},

		/** A new architecture with no choices. It becomes the current one. */
		newArchitecture(name: string) {
			const title = name.trim() || 'New Architecture';
			add(blank(uniqueId(title, Object.keys(saved)), title));
		},

		/** A file's architecture lands as a new one beside the others. It never overwrites one. */
		importArchitecture(imported: { name: string; description: string; choices: Choices }) {
			const architecture = blank(uniqueId(imported.name, Object.keys(saved)), imported.name, imported.choices);
			architecture.description = imported.description;
			add(architecture);
		},

		/** Deletes an architecture. The last one is replaced by an empty one, so there is always one. */
		deleteArchitecture(id: string) {
			if (!own(saved, id)) return;
			delete saved[id];
			const remaining = Object.values(saved);
			if (remaining.length === 0) {
				add(blank(createId(DEFAULT_NAME), DEFAULT_NAME));
				return;
			}
			if (current.id === id) current = remaining[0];
			persist();
		},

		/** The id stays the same when the name changes */
		setMeta(name: string, description: string) {
			current.name = name;
			current.description = description;
			persist();
		},

		/** Choose a pattern. A change of pattern keeps the reason, so the team can edit it. */
		choose(decisionId: string, patternId: string) {
			const note = current.choices[decisionId]?.note ?? '';
			current.choices[decisionId] = { patternId, note, decidedAt: new Date().toISOString() };
			persist();
		},

		setNote(decisionId: string, note: string) {
			const choice = current.choices[decisionId];
			if (!choice) return;
			choice.note = note;
			persist();
		},

		clear(decisionId: string) {
			delete current.choices[decisionId];
			persist();
		},

		/** Clears every choice in the current architecture. The architecture stays. */
		clearAll() {
			current.choices = {};
			persist();
		}
	};
}

export type DecisionsStore = ReturnType<typeof createDecisionsStore>;
