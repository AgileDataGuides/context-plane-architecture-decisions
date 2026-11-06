// Pure functions over the content and a team's choices. No storage and no
// Svelte in here, so every tab reads the same answers.
import type { Architecture, Choices, Decision, Part, Pattern } from '../types';

/** The pattern a team chose for a decision. Undefined when there is no choice, or the pattern has left the content. */
export function chosenPattern(decision: Decision, choices: Choices): Pattern | undefined {
	const choice = choices[decision.id];
	if (!choice) return undefined;
	return decision.patterns.find((p) => p.id === choice.patternId);
}

/** The pattern AgileData uses, as a worked example. Undefined until the content marks it as confirmed. */
export function agiledataPattern(decision: Decision): Pattern | undefined {
	if (!decision.agiledataChoice?.confirmed) return undefined;
	return decision.patterns.find((p) => p.id === decision.agiledataChoice.patternId);
}

/** One decision on the Decisions grid. A row with no chosen pattern is a gap. */
export interface GridRow {
	decision: Decision;
	chosen?: Pattern;
	note: string;
	decidedAt?: string;
}

/** The decisions of one moving part, under its band on the grid. */
export interface GridGroup {
	part?: Part;
	rows: GridRow[];
}

/** Every decision as a grid row, grouped by moving part, in content order. */
export function gridGroups(decisions: Decision[], parts: Part[], choices: Choices): GridGroup[] {
	const groups: GridGroup[] = [];
	for (const decision of decisions) {
		const chosen = chosenPattern(decision, choices);
		const choice = chosen ? choices[decision.id] : undefined;
		const row: GridRow = { decision, chosen, note: choice?.note ?? '', decidedAt: choice?.decidedAt };
		const last = groups[groups.length - 1];
		if (last && last.part?.id === decision.partId) {
			last.rows.push(row);
		} else {
			groups.push({ part: parts.find((p) => p.id === decision.partId), rows: [row] });
		}
	}
	return groups;
}

/** How many decisions have a pattern. */
export function decidedCount(decisions: Decision[], choices: Choices): number {
	return decisions.filter((d) => chosenPattern(d, choices)).length;
}

/**
 * The file Export JSON saves. `choices` is what Import reads back. `decisions`
 * says the same thing in the words a person needs to read it.
 */
export function exportPayload(decisions: Decision[], parts: Part[], architecture: Architecture, exportedAt: string) {
	const choices = architecture.choices;
	const rows = gridGroups(decisions, parts, choices).flatMap((group) =>
		group.rows.map((row) => ({ part: group.part, ...row }))
	);
	return {
		app: 'context-plane-architecture-decisions',
		version: 1,
		name: architecture.name,
		description: architecture.description,
		exportedAt,
		choices,
		decisions: rows.flatMap((row) =>
			row.chosen
				? [
						{
							part: row.part?.name ?? '',
							decisionId: row.decision.id,
							question: row.decision.question,
							patternId: row.chosen.id,
							pattern: row.chosen.name,
							reason: row.note,
							decidedAt: row.decidedAt,
							gain: row.chosen.gain,
							cost: row.chosen.cost,
							limits: row.decision.limits.map((limit) => ({ decisionId: limit.decisionId, note: limit.note }))
						}
					]
				: []
		)
	};
}
