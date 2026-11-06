<script lang="ts">
	// The last step: the decisions with no pattern yet, each with a link to
	// its step. A gap is a prompt, never a block. An Open the Decisions tab
	// button sits under the gaps.
	import { BUTTON, CARD, ROW_ACTION, STATE_CHIP, TEXT } from '../../../ui/tokens';
	import { EMPTY, LABELS } from '../../../canon/steps';
	import { gaps, stepLabel, type Step } from '../../../model/steps';
	import type { Choices } from '../../../types';

	let {
		steps,
		choices,
		onGoToStep,
		onOpenDecisions
	}: {
		steps: Step[];
		choices: Choices;
		onGoToStep: (step: Step) => void;
		onOpenDecisions: () => void;
	} = $props();

	const open = $derived(gaps(steps, choices));
</script>

<div class="max-w-2xl space-y-3">
	{#if open.length === 0}
		<span class="{STATE_CHIP.base} {STATE_CHIP.positive}">{EMPTY.noGaps}</span>
	{:else}
		<section class="{CARD.base} p-3">
			<div class="flex items-center justify-between gap-3">
				<h3 class={TEXT.sectionHeader}>Not decided</h3>
				<span class="{STATE_CHIP.base} {STATE_CHIP.warning}">{open.length === 1 ? '1 gap' : `${open.length} gaps`}</span>
			</div>
			<ul class="{CARD.listDivider} mt-2">
				{#each open as step (step.id)}
					<li class="flex items-start justify-between gap-3 py-1.5">
						<span class={TEXT.cardTitle}>{step.decision.question}</span>
						<button type="button" class="shrink-0 {ROW_ACTION.neutral}" onclick={() => onGoToStep(step)}>Go to {stepLabel(step)}</button>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<div>
		<button type="button" class={BUTTON.secondary} onclick={onOpenDecisions}>{LABELS.openDecisions}</button>
	</div>
</div>
