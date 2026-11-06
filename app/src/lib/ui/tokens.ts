// The design tokens this app uses, copied from design/tokens.md.
//
// tokens.md is AUTHORITATIVE: if this file and tokens.md disagree, tokens.md
// wins. They live here, not imported from @context-plane/shared/design-tokens,
// because scripts/publish-app.sh does not bundle that module into the public
// repo. The other standalone apps keep their own copies for the same reason.

/** tokens.md typography */
export const TEXT = {
	/** typography.h1_app_header */
	appTitle: 'text-lg font-bold tracking-tight',
	/** typography.h1_app_tagline */
	appTagline: 'text-xs text-slate-400',
	/** typography.label_section_header */
	sectionHeader: 'text-sm font-semibold text-slate-700',
	/** typography.label_table_header */
	tableHeader: 'text-[11px] font-semibold uppercase tracking-wider text-slate-500',
	/** typography.card_title */
	cardTitle: 'text-xs font-medium text-slate-800 leading-tight',
	/** typography.card_desc */
	cardDesc: 'text-[10px] text-slate-400 leading-tight',
	/** typography.small + placeholder_italic_unset */
	empty: 'text-xs text-slate-300 italic'
};

/** tokens.md buttons */
export const BUTTON = {
	/** buttons.secondary_slate */
	secondary:
		'px-3 py-1.5 text-sm font-medium rounded-lg bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors',
	/** buttons.header_neutral: New Architecture and Import, in the dark app header */
	headerNeutral: 'px-3 py-1.5 text-sm font-medium rounded-lg text-slate-300 border border-slate-600 hover:bg-slate-800 transition-colors',
	/** buttons.success_create: Create, in the dark app header */
	create: 'px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors',
	/** buttons.danger_delete_header */
	deleteHeader: 'px-3 py-1.5 text-sm font-medium rounded-lg text-red-400 border border-slate-600 hover:bg-slate-800 transition-colors',
	/** app_header.cancel: Cancel beside Create */
	headerCancel: 'px-3 py-1.5 text-sm font-medium rounded-lg text-slate-400 hover:text-slate-200 transition-colors'
};

/** tokens.md app_header: the model switcher and the name field, on the dark header (DESIGN_SYSTEM.md § 17) */
export const HEADER = {
	switcher: 'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-slate-800 text-sm',
	switcherName: 'text-slate-300',
	chevron: 'w-3.5 h-3.5 text-slate-400 transition-transform',
	panel: 'absolute top-full right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1 min-w-[200px]',
	item: 'w-full text-left px-4 py-2 text-sm transition-colors',
	itemActive: 'bg-slate-100 font-semibold text-slate-800',
	itemInactive: 'text-slate-600 hover:bg-slate-50',
	nameInput:
		'px-3 py-1.5 border border-slate-600 bg-slate-800 text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-44 placeholder-slate-500'
};

/** tokens.md tier2_toolbar_fields: the current architecture's name and description (DESIGN_SYSTEM.md § 17) */
export const TOOLBAR = {
	/** cards.tier2_toolbar */
	card: 'bg-white border border-slate-200 rounded-lg',
	/** spacing.tier2_padding_row */
	row: 'px-4 py-2.5',
	name: 'block text-sm font-semibold text-slate-800 leading-tight cursor-pointer hover:text-slate-600 transition-colors text-left truncate max-w-md',
	nameInput: 'text-sm font-semibold text-slate-800 px-1 border border-blue-400 rounded outline-none w-64',
	desc: 'block text-[10px] leading-tight mt-0.5 truncate max-w-md text-left cursor-pointer transition-colors',
	descSet: 'text-slate-400 hover:text-slate-600',
	descUnset: 'text-slate-300 italic hover:text-slate-500',
	descInput: 'block text-[10px] text-slate-500 px-1 border border-blue-400 rounded outline-none w-96 max-w-full mt-0.5'
};

/** tokens.md form_inputs */
export const INPUT = {
	/** form_inputs.textarea */
	textarea:
		'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-white',
	/** form_inputs.label_small */
	labelSmall: 'block text-[10px] font-medium text-slate-500 mb-1'
};

/** tokens.md cards */
export const CARD = {
	/** cards.default */
	base: 'bg-white rounded-lg shadow-sm border border-slate-200',
	/** cards.list_divider */
	listDivider: 'divide-y divide-slate-100'
};

/** tokens.md tier3_tabs */
export const TAB = {
	wrapper: 'flex items-center px-3.5 py-2 text-xs font-medium border-b-2 -mb-px transition-colors',
	active: 'text-blue-600 border-blue-600',
	inactive: 'text-slate-400 border-transparent hover:text-slate-600'
};

/** tokens.md state_chips */
export const STATE_CHIP = {
	base: 'inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border',
	neutral: 'bg-slate-50 text-slate-600 border-slate-200',
	positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
	warning: 'bg-amber-50 text-amber-700 border-amber-200'
};

/** tokens.md row_actions */
export const ROW_ACTION = {
	neutral: 'text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors',
	danger: 'text-[11px] font-medium text-red-600 hover:text-red-700 transition-colors'
};

/** tokens.md hint: Heroicons outline information-circle */
export const HINT = {
	quiet: 'flex items-start gap-1.5 text-[11px] text-slate-500 leading-snug',
	icon: 'w-3.5 h-3.5 shrink-0 mt-px text-slate-400'
};

/** tokens.md interactions */
export const INTERACTION = {
	selectionRing: 'ring-2 ring-blue-500 ring-offset-1'
};

/** tokens.md step_rail: the steps down the left of the Steps tab (DESIGN_SYSTEM.md § 18 Step Rail, § 23). */
export const STEP_RAIL = {
	container: 'w-72 shrink-0 border-r border-slate-200 bg-slate-50 overflow-y-auto',
	row: 'w-full text-left flex items-start gap-2 px-3 py-2 border-l-2 transition-colors',
	rowActive: 'bg-white border-blue-600',
	rowInactive: 'border-transparent hover:bg-slate-100',
	labelActive: 'text-xs font-semibold text-slate-800',
	labelInactive: 'text-xs font-medium text-slate-600',
	status: 'text-[10px] text-slate-400 leading-tight',
	dotStarted: 'mt-1 w-2 h-2 shrink-0 rounded-full bg-slate-600',
	dotEmpty: 'mt-1 w-2 h-2 shrink-0 rounded-full border border-slate-300',
	/** step_rail.divider: the line over the check step */
	divider: 'mt-2 pt-2 border-t border-slate-200',
	/** definitions_rail.group: around a moving part's name, over its steps */
	group: 'px-3 pt-3 pb-1'
};

/** tokens.md step_panel: the header of the selected step (DESIGN_SYSTEM.md § 18 Step Panel). */
export const STEP_PANEL = {
	label: 'text-xs font-semibold text-slate-500',
	question: 'text-base font-semibold text-slate-800',
	description: 'text-xs text-slate-500 leading-relaxed',
	guide: 'text-xs text-slate-700 leading-relaxed',
	header: 'space-y-1 pb-3 mb-4 border-b border-slate-200',
	body: 'px-6 py-5',
	content: 'max-w-2xl space-y-6'
};

/** tokens.md step_nav: Back and Next under the selected step (DESIGN_SYSTEM.md § 18 Step Nav). */
export const STEP_NAV = {
	bar: 'shrink-0 flex items-center justify-between gap-3 px-6 py-2.5 border-t border-slate-200 bg-white',
	button:
		'inline-flex items-center gap-1.5 min-w-0 px-3 py-1.5 text-sm font-medium rounded-lg bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors',
	label: 'truncate',
	icon: 'w-4 h-4 shrink-0'
};

/** tokens.md decision_patterns: the pieces only this app uses (DESIGN_SYSTEM.md § 23). */
export const DECISION = {
	content: 'max-w-6xl space-y-3',
	patternGrid: 'grid grid-cols-1 gap-3',
	/** Added to patternGrid, by the number of patterns in the decision */
	patternGridColumns: {
		2: 'lg:grid-cols-2',
		3: 'lg:grid-cols-3',
		4: 'lg:grid-cols-4'
	} as Record<number, string>,
	patternCard: 'bg-white rounded-lg shadow-sm border border-slate-200 p-3 flex flex-col gap-3',
	pointList: 'mt-1.5 space-y-1 list-disc pl-4 text-xs text-slate-600',
	readingText: 'text-sm text-slate-700 leading-relaxed',
	/** cards.concept_link: a step named in a sentence */
	stepLink: 'text-blue-600 hover:underline',
	/** decision_patterns.diagram */
	diagram: 'w-full h-auto rounded-md border border-slate-100 bg-slate-50',
	/** decision_patterns.map */
	map: 'block w-full h-auto',
	/** decision_patterns.map_frame: cards.default + spacing.card_padding, held to a width the labels read well at */
	mapFrame: 'max-w-7xl bg-white rounded-lg shadow-sm border border-slate-200 p-4',
	/** decision_patterns.map_legend: hint.quiet's text, in a row under the map */
	mapLegend: 'mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500'
};

/**
 * tokens.md decision_patterns.map_*: the colours of the systems map. SVG
 * attributes, not classes. The same meanings as DIAGRAM: white is a place,
 * blue holds context, the dark pill is an AI agent.
 */
export const MAP = {
	place: { fill: '#ffffff', stroke: '#cbd5e1' },
	context: { fill: '#eff6ff', stroke: '#3b82f6', text: '#1d4ed8' },
	agent: { fill: '#475569' },
	flow: { decided: '#64748b', empty: '#cbd5e1', conditionalDash: '6 5', emptyDash: '1.5 5' },
	label: { name: '#64748b', value: '#1e293b', empty: '#94a3b8' },
	onDark: { name: '#cbd5e1', value: '#ffffff' }
};

/** tokens.md decision_patterns.diagram_*: the colours of a pattern's diagram. SVG attributes, not classes. */
export const DIAGRAM = {
	team: { fill: '#ffffff', stroke: '#cbd5e1' },
	context: { fill: '#eff6ff', stroke: '#3b82f6' },
	agent: { fill: '#475569', text: '#ffffff' },
	line: { stroke: '#94a3b8', width: 1.5 },
	label: { fill: '#334155', size: 9 }
};

/** tokens.md choice_chips */
export const CHIP = {
	base: 'px-2 py-0.5 text-[11px] font-medium rounded-md border transition-colors',
	active: 'bg-blue-50 text-blue-700 border-blue-300'
};

/** tokens.md decision_patterns.grid_*: the Decisions grid (DESIGN_SYSTEM.md § 23). */
export const GRID = {
	wrapper: 'flex-1 min-h-0 overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm',
	table: 'w-full border-collapse text-xs',
	header: 'sticky top-0 z-10 bg-slate-900 text-white text-left text-xs font-semibold px-3 py-2 border-r border-slate-700 whitespace-nowrap',
	headerFirst: 'bg-slate-950',
	band: 'bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 border-b border-slate-200',
	bandSummary: 'ml-2 text-[10px] font-normal normal-case tracking-normal text-slate-400',
	row: 'border-b border-slate-200 hover:bg-blue-50/50 transition-colors',
	cell: 'px-3 py-2 align-top border-r border-slate-200',
	decision: 'text-left text-xs font-semibold text-slate-800 cursor-pointer hover:underline decoration-dotted underline-offset-2',
	stepNumber: 'block text-[10px] font-normal text-slate-400',
	points: 'space-y-1 list-disc pl-4 text-xs text-slate-600',
	limitNote: 'text-xs text-slate-600'
};
