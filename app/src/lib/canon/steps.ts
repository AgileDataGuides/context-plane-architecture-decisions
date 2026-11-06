// The Steps tab's own wording, in one file.
//
// Each decision is one step, and its words come from
// data/lookups/decisions.json: the name, the question, why it matters. This
// file holds only what the content file does not: the last step, which checks
// that every decision has a pattern, and the lines the panels show when there
// is nothing to show.
//
// Copy rules for anything a person reads: British spelling, no em dashes,
// step labels in the form "Step 3 - Where context lives".

export const CHECK_STEP = {
	id: 'check',
	name: 'Check your decisions',
	question: 'Has every decision got a pattern?',
	description:
		'This step lists the decisions with no pattern yet. A gap is a prompt to talk, never a block. Your team can leave a decision open until it knows more.'
} as const;

export const EMPTY = {
	noDecisions: 'No decisions to show yet.',
	noGaps: 'Every decision has a pattern',
	notDecided: 'Not decided'
};

export const LABELS = {
	choose: 'Choose this pattern',
	clear: 'Clear choice',
	chosen: 'Chosen',
	agiledata: 'AgileData uses this',
	openDecisions: 'Open the Decisions tab'
};
