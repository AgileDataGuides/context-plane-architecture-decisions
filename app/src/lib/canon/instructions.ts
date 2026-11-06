// The Instructions tab's own words, and the app's title, in one file. The
// decisions and patterns have their words in data/lookups/decisions.json.
// The Steps tab's own words are in canon/steps.ts.
//
// DRAFT: this wording is a first draft and has not been reviewed.

export const APP = {
	title: 'Context Plane Architecture Decisions',
	tagline: 'Understand the patterns. Record your decisions. See the trade-offs.',
	description:
		'A Context Plane has many moving parts. This app explains the decisions a team makes when it builds one, compares the valid patterns for each decision, and records what the team chose.'
};

export interface InstructionSection {
	heading: string;
	paragraphs: string[];
}

export const SECTIONS: InstructionSection[] = [
	{
		heading: 'What is a Context Plane?',
		paragraphs: [
			'A Context Plane is where an organisation keeps the context that people and AI agents need to use its data correctly.',
			'Context means the definitions, the rules, the metrics and who owns what. An agent with no context guesses. An agent with context gives the answer your organisation agrees with.'
		]
	},
	{
		heading: 'Why are there decisions to make?',
		paragraphs: [
			'A Context Plane has many moving parts, and each part can be built in more than one valid way.',
			'There is no agreed good practice for most of these decisions yet. Teams are still experimenting. This app does not tell you which pattern is best. It shows the valid patterns for each decision, what you gain with each one, and what you pay.'
		]
	}
];

export const HOW_TO = {
	heading: 'How to use this app',
	steps: [
		'Open the Steps tab. Each step is one decision. Read the patterns that answer it.',
		'Choose the pattern that fits your team. Write down why you chose it.',
		'Go to the last step. It lists the decisions with no pattern yet.',
		'Open the Decisions tab. It shows every decision on one grid, with what you gain, what you pay and which other decisions it limits.',
		'Open the Map tab. It draws your architecture as places and flows, and its shape changes with your choices.',
		'Use New Architecture to keep more than one set of decisions. For example, keep one for today and one for an option you are weighing. The name at the top right switches between them.'
	],
	storage:
		'Your architectures are stored in this browser only. Use Export JSON to keep a copy of one. Use Import to bring a copy back as a new architecture.'
};
