<script lang="ts">
	// A small diagram of one pattern, so a team can see its shape before it
	// reads the words. The content file names the diagram with a key on the
	// pattern. A key with no drawing here shows nothing.
	//
	// Every diagram uses the same three shapes: a team (white box), a place
	// that holds context (blue box) and an AI agent (dark pill). The colours
	// are SVG attributes from tokens.md decision_patterns.diagram_*.
	import { DECISION, DIAGRAM } from '../../../ui/tokens';

	let { kind, name }: { kind: string; name: string } = $props();

	// Three teams across the top, at the same place in every diagram
	const TEAMS = [14, 80, 146];
	const BOX = { width: 60, height: 22 };
	const centre = (x: number) => x + BOX.width / 2;

	const DESCRIPTIONS: Record<string, string> = {
		centralised: 'Three teams and an AI agent all connect to one place that holds all the context.',
		federated: 'Three teams each keep their own context. The AI agent connects to each of the three places.',
		'hub-and-spoke':
			'Three teams each keep their own context. Each connects to one hub that holds the shared context and an index. The AI agent connects to the hub.'
	};
</script>

{#snippet box(x: number, y: number, width: number, label: string, tone: 'team' | 'context')}
	<rect {x} {y} {width} height={BOX.height} rx="3" fill={DIAGRAM[tone].fill} stroke={DIAGRAM[tone].stroke} stroke-width="1.2" />
	<text x={x + width / 2} y={y + 14.5} text-anchor="middle" font-size={DIAGRAM.label.size} fill={DIAGRAM.label.fill}>{label}</text>
{/snippet}

{#snippet agent(y: number)}
	<rect x="80" {y} width="60" height={BOX.height} rx="11" fill={DIAGRAM.agent.fill} />
	<text x="110" y={y + 14.5} text-anchor="middle" font-size={DIAGRAM.label.size} fill={DIAGRAM.agent.text}>AI agent</text>
{/snippet}

{#snippet line(x1: number, y1: number, x2: number, y2: number)}
	<line {x1} {y1} {x2} {y2} stroke={DIAGRAM.line.stroke} stroke-width={DIAGRAM.line.width} stroke-linecap="round" />
{/snippet}

{#if DESCRIPTIONS[kind]}
	<svg class={DECISION.diagram} viewBox="0 0 220 142" role="img" aria-label="{name}: {DESCRIPTIONS[kind]}">
		{#if kind === 'centralised'}
			{#each TEAMS as x, i (x)}
				{@render line(centre(x), 30, 90 + i * 20, 58)}
				{@render box(x, 8, BOX.width, 'Team', 'team')}
			{/each}
			{@render line(110, 80, 110, 110)}
			{@render box(60, 58, 100, 'All context', 'context')}
			{@render agent(110)}
		{:else if kind === 'federated'}
			{#each TEAMS as x (x)}
				{@render line(centre(x), 30, centre(x), 44)}
				{@render line(centre(x), 66, 110, 110)}
				{@render box(x, 8, BOX.width, 'Team', 'team')}
				{@render box(x, 44, BOX.width, 'Context', 'context')}
			{/each}
			{@render agent(110)}
		{:else if kind === 'hub-and-spoke'}
			{#each TEAMS as x, i (x)}
				{@render line(centre(x), 30, centre(x), 38)}
				{@render line(centre(x), 60, 90 + i * 20, 76)}
				{@render box(x, 8, BOX.width, 'Team', 'team')}
				{@render box(x, 38, BOX.width, 'Context', 'context')}
			{/each}
			{@render line(110, 98, 110, 112)}
			{@render box(50, 76, 120, 'Hub: shared + index', 'context')}
			{@render agent(112)}
		{/if}
	</svg>
{/if}
