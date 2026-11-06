// The steps of the Steps tab, worked out from the content: one step per
// decision, in content order, then a last step that checks for decisions
// with no pattern. Pure functions, no storage and no Svelte.
import { CHECK_STEP, EMPTY } from '../canon/steps';
import type { Choices, Decision, Part } from '../types';
import { chosenPattern } from './tradeoffs';

export interface DecisionStep {
	kind: 'decision';
	/** The decision's id */
	id: string;
	number: number;
	name: string;
	decision: Decision;
	/** The moving part the decision belongs to. The rail groups the steps by it. */
	part?: Part;
}

export interface CheckStep {
	kind: 'check';
	id: typeof CHECK_STEP.id;
	number: number;
	name: string;
}

export type Step = DecisionStep | CheckStep;

/** One step per decision, then the check step. No decisions, no steps. */
export function buildSteps(decisions: Decision[], parts: Part[] = []): Step[] {
	if (decisions.length === 0) return [];
	const steps: Step[] = decisions.map((decision, i) => ({
		kind: 'decision',
		id: decision.id,
		number: i + 1,
		name: decision.name ?? decision.question,
		decision,
		part: parts.find((p) => p.id === decision.partId)
	}));
	steps.push({ kind: 'check', id: CHECK_STEP.id, number: decisions.length + 1, name: CHECK_STEP.name });
	return steps;
}

/** "5 Steps": the tab's name counts the steps it shows. */
export function stepsTabLabel(steps: Step[]): string {
	return steps.length === 1 ? '1 Step' : `${steps.length} Steps`;
}

/** "Step 1 - Where context lives" */
export function stepLabel(step: Step): string {
	return `Step ${step.number} - ${step.name}`;
}

/** The step of a decision, for a Go to link. */
export function stepOfDecision(steps: Step[], decisionId: string): DecisionStep | undefined {
	return steps.find((s): s is DecisionStep => s.kind === 'decision' && s.id === decisionId);
}

/** The decision steps with no pattern chosen. */
export function gaps(steps: Step[], choices: Choices): DecisionStep[] {
	return steps.filter((s): s is DecisionStep => s.kind === 'decision' && !chosenPattern(s.decision, choices));
}

/** The dot and the line under a step on the rail. Read off the choices: nothing about a step is stored. */
export function stepStatus(step: Step, steps: Step[], choices: Choices): { started: boolean; line: string } {
	if (step.kind === 'decision') {
		const chosen = chosenPattern(step.decision, choices);
		return { started: Boolean(chosen), line: chosen?.name ?? EMPTY.notDecided };
	}
	const open = gaps(steps, choices).length;
	if (open === 0) return { started: true, line: EMPTY.noGaps };
	return { started: false, line: open === 1 ? '1 decision to make' : `${open} decisions to make` };
}
