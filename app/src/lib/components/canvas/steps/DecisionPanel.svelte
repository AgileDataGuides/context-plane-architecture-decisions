<script lang="ts">
	// A decision step: the valid patterns side by side, then the team's
	// reason once it has chosen one. No pattern is marked as best
	// (DESIGN_SYSTEM.md § 23).
	import { DECISION, INPUT, STEP_PANEL, TEXT } from '../../../ui/tokens';
	import { agiledataPattern as agiledataPatternOf, chosenPattern } from '../../../model/tradeoffs';
	import { stepLabel, stepOfDecision, type Step } from '../../../model/steps';
	import type { Choices, Decision, DecisionActions } from '../../../types';
	import PatternCard from './PatternCard.svelte';

	let {
		decision,
		steps,
		choices,
		actions,
		onGoToStep
	}: {
		decision: Decision;
		steps: Step[];
		choices: Choices;
		actions: DecisionActions;
		onGoToStep: (step: Step) => void;
	} = $props();

	const chosen = $derived(chosenPattern(decision, choices));
	const note = $derived(choices[decision.id]?.note ?? '');

	// The AgileData choice is a worked example, shown once the content marks it as confirmed. Its reason shows only when the content has one.
	const agiledataPattern = $derived(agiledataPatternOf(decision));

	// The decisions this one narrows, each with its step
	const limits = $derived(
		(decision.limits ?? []).flatMap((limit) => {
			const step = stepOfDecision(steps, limit.decisionId);
			return step ? [{ step, note: limit.note }] : [];
		})
	);
</script>

<div class={DECISION.content}>
	<div class="{DECISION.patternGrid} {DECISION.patternGridColumns[decision.patterns.length] ?? ''}">
		{#each decision.patterns as pattern (pattern.id)}
			<PatternCard
				{pattern}
				chosen={chosen?.id === pattern.id}
				agiledata={agiledataPattern?.id === pattern.id}
				onChoose={() => actions.choose(decision.id, pattern.id)}
				onClear={() => actions.clear(decision.id)}
			/>
		{/each}
	</div>

	{#if chosen}
		<div class="max-w-2xl">
			<label class={INPUT.labelSmall} for="decision-reason">Why did you choose {chosen.name}?</label>
			<textarea
				id="decision-reason"
				rows="3"
				class={INPUT.textarea}
				placeholder="Write the reason, so the team remembers it later."
				value={note}
				oninput={(e) => actions.setNote(decision.id, e.currentTarget.value)}
			></textarea>
		</div>
	{/if}

	{#if agiledataPattern && decision.agiledataChoice.why}
		<div class="max-w-2xl">
			<p class={TEXT.tableHeader}>Why AgileData uses {agiledataPattern.name}</p>
			<p class="mt-1 {STEP_PANEL.guide}">{decision.agiledataChoice.why}</p>
		</div>
	{/if}

	{#if limits.length > 0}
		<div class="max-w-2xl">
			<p class={TEXT.tableHeader}>This decision limits</p>
			<ul class={DECISION.pointList}>
				{#each limits as limit}
					<li>
						<button type="button" class={DECISION.stepLink} onclick={() => onGoToStep(limit.step)}>{stepLabel(limit.step)}</button>.
						{limit.note}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
