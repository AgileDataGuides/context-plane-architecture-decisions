<script lang="ts">
	// The Map tab: the architecture on screen as one systems map. The same
	// choices as the Steps tab and the Decisions grid, drawn as places and
	// flows, so two architectures look different at a glance.
	import { DECISION, MAP, STEP_PANEL, TEXT } from '../ui/tokens';
	import { EMPTY } from '../canon/steps';
	import type { Choices, Decision } from '../types';
	import { buildMapView } from '../model/map';
	import SystemsMap from './SystemsMap.svelte';

	let {
		decisions,
		choices,
		onGoTo
	}: {
		decisions: Decision[];
		choices: Choices;
		onGoTo: (decisionId: string) => void;
	} = $props();

	const view = $derived(buildMapView(decisions, choices));
</script>

<div class="{STEP_PANEL.body} bg-slate-50 min-h-full">
	<header class="space-y-1 pb-3">
		<h2 class={STEP_PANEL.question}>Your architecture map</h2>
		<p class={STEP_PANEL.description}>
			{view.decided} of {view.total} decided. Each decision sits on a place or on a flow. Some choices change the shape of the map. Click a
			decision to go to its step.
		</p>
	</header>

	{#if view.total === 0}
		<p class={TEXT.empty}>{EMPTY.noDecisions}</p>
	{:else}
		<div class={DECISION.mapFrame}>
			<SystemsMap {view} {onGoTo} />
		</div>
		<ul class={DECISION.mapLegend} aria-label="What the map's shapes mean">
			<li class="flex items-center gap-1.5">
				<svg width="18" height="12" aria-hidden="true"><rect x="1" y="1" width="16" height="10" rx="2" fill={MAP.place.fill} stroke={MAP.place.stroke} /></svg>
				A place
			</li>
			<li class="flex items-center gap-1.5">
				<svg width="18" height="12" aria-hidden="true"><rect x="1" y="1" width="16" height="10" rx="2" fill={MAP.context.fill} stroke={MAP.context.stroke} /></svg>
				Holds context
			</li>
			<li class="flex items-center gap-1.5">
				<svg width="26" height="12" aria-hidden="true"><line x1="1" y1="6" x2="25" y2="6" stroke={MAP.flow.decided} stroke-width="1.75" /></svg>
				A flow you decided
			</li>
			<li class="flex items-center gap-1.5">
				<svg width="26" height="12" aria-hidden="true"><line x1="1" y1="6" x2="25" y2="6" stroke={MAP.flow.decided} stroke-width="1.75" stroke-dasharray={MAP.flow.conditionalDash} /></svg>
				Decided, with a condition
			</li>
			<li class="flex items-center gap-1.5">
				<svg width="26" height="12" aria-hidden="true"><line x1="1" y1="6" x2="25" y2="6" stroke={MAP.flow.empty} stroke-width="1.75" stroke-linecap="round" stroke-dasharray={MAP.flow.emptyDash} /></svg>
				Not decided yet
			</li>
		</ul>
	{/if}
</div>
