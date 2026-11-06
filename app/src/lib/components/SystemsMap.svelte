<script lang="ts">
	// The systems map: one picture of the architecture on screen. Four fixed
	// places and the flows between them. Each decision is a label on a place
	// or a flow, and one click on a label goes to its step. A flow with no
	// pattern yet is a light dotted line. A decided flow is solid, or dashed
	// when it carries a condition (only on request, or after approval).
	//
	// A few patterns change the shape of the map (view.effects):
	//   store-*    one central store, a store beside each system, or a hub with both
	//   scope-*    which source systems the context covers
	//   capture-on-request   nothing is copied, so the capture flow is dashed
	//   write-*    no flow from the agent, a dashed one, or a solid one
	//   run-*      the agent, a central service or the Context Plane runs the task
	//
	// The colours are SVG attributes from tokens.md decision_patterns.map_*.
	import { DECISION, MAP } from '../ui/tokens';
	import type { MapLabel, SystemsMapView } from '../model/map';

	let { view, onGoTo }: { view: SystemsMapView; onGoTo: (decisionId: string) => void } = $props();

	const has = (effect: string) => view.effects.has(effect);

	// Where everything sits. The viewBox is 1180 wide, and 540 high or more.
	const SOURCES = [
		{ name: 'Stripe', y: 130, platform: false },
		{ name: 'CRM', y: 240, platform: false },
		{ name: 'Data platform', y: 350, platform: true }
	];
	const SOURCE = { x: 30, width: 200, height: 72 };
	const PLANE = { x: 440, y: 110, width: 280 };
	const AGENT = { x: 930, y: 140, width: 220 };
	const PEOPLE = { x: 930, y: 392, width: 220 };

	// A box grows with the number of decisions the content puts on it, so a new
	// decision never draws its label outside its box. The AI agent box has room
	// to grow for five decisions. A sixth would reach the People box under it,
	// and then the layout needs a change.
	const planeHeight = $derived(Math.max(400, 74 + view.places.plane.length * 33 + 12));
	const agentHeight = $derived(Math.max(120, 52 + view.places.agent.length * 34 + 10));
	const peopleLabels = $derived(view.places.people.length);
	const peopleHeight = $derived(Math.max(96, 48 + peopleLabels * 34 + 6));
	const viewHeight = $derived(
		Math.max(540, PLANE.y + planeHeight + 30, PEOPLE.y + peopleHeight + 30, 448 + view.places.sources.length * 36 + 20)
	);

	const localStores = $derived(has('store-federated') || has('store-hub'));
	const storeDecided = $derived(has('store-centralised') || localStores);
	const scopeDecided = $derived(has('scope-platform') || has('scope-all') || has('scope-one'));

	function inScope(source: (typeof SOURCES)[number]): boolean {
		return !has('scope-platform') || source.platform;
	}

	const planeTitle = $derived(has('store-hub') ? 'Context Plane hub' : 'Context Plane');
	const planeNote = $derived(
		has('store-federated')
			? 'No central store'
			: has('store-hub')
				? 'Shared context and an index'
				: has('store-centralised')
					? 'One central store'
					: ''
	);

	// The capture flow starts at the source systems the context covers: a stub
	// from each one, joined by a line down the side, then one arrow to the
	// Context Plane.
	const CAPTURE_Y = 276;
	const capturePath = $derived.by(() => {
		const covered = SOURCES.filter((source) => inScope(source)).map((source) => source.y + SOURCE.height / 2);
		const stubs = covered.map((y) => `M${SOURCE.x + SOURCE.width + 4} ${y} L252 ${y}`).join(' ');
		const top = Math.min(CAPTURE_Y, ...covered);
		const bottom = Math.max(CAPTURE_Y, ...covered);
		return `${stubs} M252 ${top} L252 ${bottom} M252 ${CAPTURE_Y} L${PLANE.x - 6} ${CAPTURE_Y}`;
	});

	// The run flow leaves the Context Plane when the Context Plane runs the task
	const runPath = $derived(
		has('run-plane') ? `M580 ${PLANE.y - 4} L580 64 L130 64 L130 124` : `M1040 ${AGENT.y - 4} L1040 64 L130 64 L130 124`
	);
	const runLabelX = $derived(has('run-plane') ? 355 : 585);

	function onKey(e: KeyboardEvent, decisionId: string) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onGoTo(decisionId);
		}
	}
</script>

<!-- A decision's label: its name over the chosen pattern. One click goes to its step. -->
{#snippet label(l: MapLabel | undefined, x: number, y: number, anchor: 'start' | 'middle', onDark: boolean)}
	{#if l}
		<g
			class="map-label"
			role="button"
			tabindex="0"
			aria-label="{l.name}: {l.value ?? 'Not decided'}. Go to this step."
			onclick={() => onGoTo(l.decisionId)}
			onkeydown={(e) => onKey(e, l.decisionId)}
		>
			<text {x} {y} text-anchor={anchor} font-size="11" fill={onDark ? MAP.onDark.name : MAP.label.name}>{l.name}</text>
			{#if l.value}
				<text {x} y={y + 15} text-anchor={anchor} font-size="12.5" font-weight="600" fill={onDark ? MAP.onDark.value : MAP.label.value}>{l.value}</text>
			{:else}
				<text {x} y={y + 15} text-anchor={anchor} font-size="12.5" font-style="italic" fill={onDark ? MAP.onDark.name : MAP.label.empty}>Not decided</text>
			{/if}
		</g>
	{/if}
{/snippet}

<!-- A flow between two places. Light and dotted until its decision has a pattern. Dashed when the chosen pattern makes it conditional. -->
{#snippet flow(l: MapLabel | undefined, d: string, conditional: boolean)}
	{@const decided = Boolean(l?.value)}
	<path
		{d}
		fill="none"
		stroke={decided ? MAP.flow.decided : MAP.flow.empty}
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-dasharray={decided ? (conditional ? MAP.flow.conditionalDash : undefined) : MAP.flow.emptyDash}
		marker-end={decided ? 'url(#map-arrow)' : 'url(#map-arrow-empty)'}
	/>
{/snippet}

<svg class={DECISION.map} viewBox="0 0 1180 {viewHeight}" role="group" aria-label="Systems map of this architecture: {view.decided} of {view.total} decisions made">
	<defs>
		<marker id="map-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
			<path d="M2 1L8 5L2 9" fill="none" stroke={MAP.flow.decided} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
		</marker>
		<marker id="map-arrow-empty" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
			<path d="M2 1L8 5L2 9" fill="none" stroke={MAP.flow.empty} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
		</marker>
	</defs>

	<!-- Run: who runs the task on the source systems -->
	{@render flow(view.flows.run, runPath, false)}
	{#if has('run-central')}
		<rect x="520" y="48" width="130" height="32" rx="6" fill={MAP.place.fill} stroke={MAP.place.stroke} stroke-width="1.2" />
		<text x="585" y="68.5" text-anchor="middle" font-size="12" font-weight="600" fill={MAP.label.value}>Central service</text>
		{@render label(view.flows.run, 585, 24, 'middle', false)}
	{:else}
		{@render label(view.flows.run, runLabelX, 38, 'middle', false)}
	{/if}

	<!-- The source systems -->
	{#each SOURCES as source (source.name)}
		{@const covered = scopeDecided && inScope(source)}
		<g opacity={scopeDecided && !covered ? 0.45 : 1}>
			<rect
				x={SOURCE.x}
				y={source.y}
				width={SOURCE.width}
				height={SOURCE.height}
				rx="8"
				fill={MAP.place.fill}
				stroke={covered ? MAP.context.stroke : MAP.place.stroke}
				stroke-width={covered ? 1.6 : 1.2}
				stroke-dasharray={covered && has('scope-one') ? '5 4' : undefined}
			/>
			<text x={SOURCE.x + 14} y={source.y + 25} font-size="13" font-weight="600" fill={MAP.label.value}>{source.name}</text>
			{#if scopeDecided}
				<text x={SOURCE.x + SOURCE.width - 14} y={source.y + 25} text-anchor="end" font-size="10.5" fill={covered ? MAP.context.text : MAP.label.name}>
					{covered ? (has('scope-one') ? 'One product' : 'Covered') : 'Not covered'}
				</text>
			{/if}
			{#if localStores}
				<rect x={SOURCE.x + 12} y={source.y + 40} width={SOURCE.width - 24} height="22" rx="5" fill={MAP.context.fill} stroke={MAP.context.stroke} stroke-width="1" />
				<text x={SOURCE.x + SOURCE.width / 2} y={source.y + 55} text-anchor="middle" font-size="11" fill={MAP.context.text}>Its own context</text>
			{/if}
		</g>
	{/each}
	{#each view.places.sources as l, i (l.decisionId)}
		{@render label(l, SOURCE.x + SOURCE.width / 2, 448 + i * 36, 'middle', false)}
	{/each}

	<!-- Capture: source systems to the Context Plane -->
	{@render flow(view.flows.capture, capturePath, has('capture-on-request'))}
	{@render label(view.flows.capture, 345, 250, 'middle', false)}

	<!-- The Context Plane -->
	<rect
		x={PLANE.x}
		y={PLANE.y}
		width={PLANE.width}
		height={planeHeight}
		rx="12"
		fill={MAP.context.fill}
		stroke={storeDecided ? MAP.context.stroke : MAP.flow.empty}
		stroke-width="1.6"
		stroke-dasharray={has('store-centralised') || has('store-hub') ? undefined : '7 5'}
	/>
	<text x={PLANE.x + PLANE.width / 2} y={PLANE.y + 30} text-anchor="middle" font-size="15" font-weight="700" fill={MAP.context.text}>{planeTitle}</text>
	{#if planeNote}
		<text x={PLANE.x + PLANE.width / 2} y={PLANE.y + 47} text-anchor="middle" font-size="11" fill={MAP.context.text}>{planeNote}</text>
	{/if}
	{#each view.places.plane as l, i (l.decisionId)}
		{@render label(l, PLANE.x + 20, PLANE.y + 74 + i * 33, 'start', false)}
	{/each}

	<!-- Read: the Context Plane to the AI agent -->
	{@render flow(view.flows.read, `M${PLANE.x + PLANE.width + 4} 170 L${AGENT.x - 6} 170`, false)}
	{@render label(view.flows.read, 825, 144, 'middle', false)}

	<!-- Write: the AI agent back to the Context Plane. Read only draws no flow. -->
	{#if !has('write-none')}
		{@render flow(view.flows.write, `M${AGENT.x - 4} 236 L${PLANE.x + PLANE.width + 6} 236`, has('write-proposes'))}
	{/if}
	{@render label(view.flows.write, 825, 210, 'middle', false)}

	<!-- The AI agent -->
	<rect x={AGENT.x} y={AGENT.y} width={AGENT.width} height={agentHeight} rx="14" fill={MAP.agent.fill} />
	<text x={AGENT.x + AGENT.width / 2} y={AGENT.y + 26} text-anchor="middle" font-size="14" font-weight="700" fill={MAP.onDark.value}>AI agent</text>
	{#each view.places.agent as l, i (l.decisionId)}
		{@render label(l, AGENT.x + 16, AGENT.y + 52 + i * 34, 'start', true)}
	{/each}

	<!-- Change: people to the Context Plane -->
	{@render flow(view.flows.change, `M${PEOPLE.x - 4} 424 L${PLANE.x + PLANE.width + 6} 424`, false)}
	{@render label(view.flows.change, 825, 398, 'middle', false)}

	<!-- Interfaces: the Context Plane to people -->
	{@render flow(view.flows.interfaces, `M${PLANE.x + PLANE.width + 4} 478 L${PEOPLE.x - 6} 478`, false)}
	{@render label(view.flows.interfaces, 825, 452, 'middle', false)}

	<!-- People -->
	<rect x={PEOPLE.x} y={PEOPLE.y} width={PEOPLE.width} height={peopleHeight} rx="8" fill={MAP.place.fill} stroke={MAP.place.stroke} stroke-width="1.2" />
	<text x={PEOPLE.x + PEOPLE.width / 2} y={peopleLabels > 0 ? PEOPLE.y + 26 : PEOPLE.y + peopleHeight / 2 + 5} text-anchor="middle" font-size="14" font-weight="700" fill={MAP.label.value}>People</text>
	{#each view.places.people as l, i (l.decisionId)}
		{@render label(l, PEOPLE.x + 16, PEOPLE.y + 52 + i * 34, 'start', false)}
	{/each}
</svg>

<style>
	.map-label {
		cursor: pointer;
		outline: none;
	}
	.map-label:hover text,
	.map-label:focus-visible text {
		text-decoration: underline;
	}
</style>
