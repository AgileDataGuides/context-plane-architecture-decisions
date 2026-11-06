// The systems map, worked out from the content and a team's choices. Pure
// functions, no storage and no Svelte.
//
// The map has four fixed places (the source systems, the Context Plane, an
// AI agent and people) and six flows between them. The content file puts
// each decision on a place or a flow. A chosen pattern always changes the
// decision's label. A few patterns also change the shape of the map, through
// their mapEffect.
import type { Choices, Decision, MapFlow, MapPlace } from '../types';
import { chosenPattern } from './tradeoffs';

/** One decision as the map shows it: its short name, and the chosen pattern's name. */
export interface MapLabel {
	decisionId: string;
	name: string;
	/** Undefined when the decision has no pattern yet */
	value?: string;
}

export interface SystemsMapView {
	places: Record<MapPlace, MapLabel[]>;
	flows: Partial<Record<MapFlow, MapLabel>>;
	/** The mapEffect of every chosen pattern */
	effects: Set<string>;
	decided: number;
	total: number;
}

export function buildMapView(decisions: Decision[], choices: Choices): SystemsMapView {
	const view: SystemsMapView = {
		places: { sources: [], plane: [], agent: [], people: [] },
		flows: {},
		effects: new Set(),
		decided: 0,
		total: 0
	};
	for (const decision of decisions) {
		if (!decision.map) continue;
		const chosen = chosenPattern(decision, choices);
		const label: MapLabel = {
			decisionId: decision.id,
			name: decision.name ?? decision.question,
			value: chosen?.name
		};
		view.total++;
		if (chosen) view.decided++;
		if (chosen?.mapEffect) view.effects.add(chosen.mapEffect);
		if (decision.map.kind === 'place') view.places[decision.map.at].push(label);
		else view.flows[decision.map.at] = label;
	}
	return view;
}
