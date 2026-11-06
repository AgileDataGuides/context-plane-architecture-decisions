<script lang="ts">
	// One pattern: what it is, an example, what you gain, what you pay and
	// when it fits. The cards of a decision sit side by side, so a team reads
	// across them. No card is marked as best (DESIGN_SYSTEM.md § 23).
	import { BUTTON, DECISION, HINT, INTERACTION, ROW_ACTION, STATE_CHIP, STEP_PANEL, TEXT } from '../../../ui/tokens';
	import { LABELS } from '../../../canon/steps';
	import type { Pattern } from '../../../types';
	import PointList from '../../PointList.svelte';
	import PatternDiagram from './PatternDiagram.svelte';

	let {
		pattern,
		chosen,
		agiledata,
		onChoose,
		onClear
	}: {
		pattern: Pattern;
		/** The team chose this pattern */
		chosen: boolean;
		/** AgileData uses this pattern: a worked example, never a recommendation */
		agiledata: boolean;
		onChoose: () => void;
		onClear: () => void;
	} = $props();
</script>

<article class="{DECISION.patternCard} {chosen ? INTERACTION.selectionRing : ''}" aria-label={pattern.name}>
	<header class="space-y-1">
		<div class="flex flex-wrap items-center gap-1.5">
			<h3 class={TEXT.sectionHeader}>{pattern.name}</h3>
			{#if chosen}
				<span class="{STATE_CHIP.base} {STATE_CHIP.positive}">{LABELS.chosen}</span>
			{/if}
			{#if agiledata}
				<span class="{STATE_CHIP.base} {STATE_CHIP.neutral}">{LABELS.agiledata}</span>
			{/if}
		</div>
		{#if pattern.alsoCalled?.length}
			<p class={TEXT.cardDesc}>Also called {pattern.alsoCalled.join(', ')}</p>
		{/if}
	</header>

	<p class={STEP_PANEL.guide}>{pattern.summary}</p>

	{#if pattern.diagram}
		<PatternDiagram kind={pattern.diagram} name={pattern.name} />
	{/if}

	<p class={HINT.quiet}>
		<svg class={HINT.icon} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
		</svg>
		<span>Example: {pattern.example}</span>
	</p>

	<PointList heading="What you gain" tone="positive" points={pattern.gain} />
	<PointList heading="What you pay" tone="warning" points={pattern.cost} />
	<PointList heading="Fits when" tone="neutral" points={pattern.fitsWhen} />

	<footer class="mt-auto pt-1">
		{#if chosen}
			<button type="button" class={ROW_ACTION.neutral} onclick={onClear}>{LABELS.clear}</button>
		{:else}
			<button type="button" class={BUTTON.secondary} onclick={onChoose}>{LABELS.choose}</button>
		{/if}
	</footer>
</article>
