// The content (what the app teaches) and the choices (what a team decided).
//
// The content is read-only. It comes from data/lookups/decisions.json. The
// choices are the only thing a team changes, and the only thing stored.

/** One valid way to answer a decision. */
export interface Pattern {
	id: string;
	name: string;
	/** Other names people use for the same pattern */
	alsoCalled?: string[];
	/** The key of a diagram that draws the pattern, in PatternDiagram.svelte */
	diagram?: string;
	/** How this pattern changes the shape of the systems map, for example store-federated. Most patterns only change a label. */
	mapEffect?: string;
	summary: string;
	/** A worked example, from the SaaS revenue theme */
	example: string;
	gain: string[];
	cost: string[];
	fitsWhen: string[];
}

/** Another decision that this decision narrows, and how. */
export interface DecisionLimit {
	decisionId: string;
	note: string;
}

export interface Source {
	title: string;
	url: string;
}

/** The places on the systems map */
export type MapPlace = 'sources' | 'plane' | 'agent' | 'people';

/** The flows between the places on the systems map */
export type MapFlow = 'capture' | 'read' | 'write' | 'change' | 'interfaces' | 'run';

/** Where a decision sits on the systems map: on a place, or on a flow between two places. */
export type MapSpot = { kind: 'place'; at: MapPlace } | { kind: 'flow'; at: MapFlow };

/** One decision a team makes when it builds a Context Plane. */
export interface Decision {
	id: string;
	order: number;
	status: string;
	/** A short name for the step label, "Step 1 - Where context lives". Without one the question is used. */
	name?: string;
	/** Where the decision sits on the systems map. A decision with none is left off the map. */
	map?: MapSpot;
	question: string;
	whyItMatters: string;
	noGoodPracticeYet: string;
	patterns: Pattern[];
	/**
	 * The pattern AgileData uses, as a worked example. Both text fields can be
	 * empty. The app shows it only when `confirmed` is true.
	 */
	agiledataChoice: { patternId: string; why: string; confirmed?: boolean };
	limits: DecisionLimit[];
	/** The moving part this decision belongs to */
	partId?: string;
	sources?: Source[];
}

/** One moving part of a Context Plane. */
export interface Part {
	id: string;
	name: string;
	summary: string;
}

export interface DecisionsContent {
	version: string;
	parts?: Part[];
	decisions: Decision[];
}

/** The pattern a team chose for one decision, and why. */
export interface Choice {
	patternId: string;
	note: string;
	/** ISO date and time of the choice */
	decidedAt: string;
}

/** Keyed by decision id */
export type Choices = Record<string, Choice>;

/**
 * One named set of choices. A team can keep more than one: today's
 * architecture, and an option it is weighing.
 */
export interface Architecture {
	version: 1;
	id: string;
	name: string;
	description: string;
	choices: Choices;
}

/** What the Steps and Decisions tabs can do to the choices. */
export interface DecisionActions {
	choose: (decisionId: string, patternId: string) => void;
	setNote: (decisionId: string, note: string) => void;
	clear: (decisionId: string) => void;
}
