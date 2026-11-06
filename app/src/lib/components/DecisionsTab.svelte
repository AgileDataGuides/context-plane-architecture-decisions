<script lang="ts">
	// The Decisions tab: every decision on one grid, the same shape as the
	// Layered Data Architecture Checklist. One row per decision, under a band
	// for its moving part. The columns are the parts of the choice: the
	// pattern, what you gain, what you pay, the decisions it limits, and the
	// team's reason. A row with no pattern is a gap, and its cells stay empty.
	import { CHIP, GRID, ROW_ACTION, STEP_PANEL, TEXT } from '../ui/tokens';
	import { EMPTY } from '../canon/steps';
	import type { Choices, Decision, Part } from '../types';
	import { decidedCount, gridGroups } from '../model/tradeoffs';
	import { buildSteps, stepLabel, stepOfDecision } from '../model/steps';

	let {
		decisions,
		parts,
		choices,
		onGoTo,
		onClearAll
	}: {
		decisions: Decision[];
		parts: Part[];
		choices: Choices;
		onGoTo: (decisionId: string) => void;
		onClearAll: () => void;
	} = $props();

	const groups = $derived(gridGroups(decisions, parts, choices));
	const decided = $derived(decidedCount(decisions, choices));
	const steps = $derived(buildSteps(decisions, parts));

	const COLUMNS = ['Decision', 'Pattern', 'What you gain', 'What you pay', 'Limits', 'Reason'];

	/** "Step 1 - Where context lives" */
	function labelOf(decisionId: string): string {
		const step = stepOfDecision(steps, decisionId);
		return step ? stepLabel(step) : '';
	}
</script>

<div class="h-full flex flex-col min-h-0 bg-slate-50 {STEP_PANEL.body}">
	<header class="shrink-0 flex flex-wrap items-end justify-between gap-3 pb-3">
		<div class="space-y-1">
			<h2 class={STEP_PANEL.question}>Your decisions</h2>
			<p class={STEP_PANEL.description}>
				{decided} of {decisions.length} decided. Each choice gives you something, costs you something, and limits other decisions.
			</p>
		</div>
		{#if decided > 0}
			<button type="button" class={ROW_ACTION.danger} onclick={onClearAll}>Clear all decisions</button>
		{/if}
	</header>

	{#if decisions.length === 0}
		<p class={TEXT.empty}>{EMPTY.noDecisions}</p>
	{:else}
		<div class={GRID.wrapper}>
			<table class={GRID.table}>
				<thead>
					<tr>
						{#each COLUMNS as column, i (column)}
							<th scope="col" class="{GRID.header} {i === 0 ? GRID.headerFirst : ''}">{column}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each groups as group (group.rows[0].decision.id)}
						{#if group.part}
							<tr>
								<th scope="colgroup" colspan={COLUMNS.length} class="text-left {GRID.band}">
									{group.part.name}<span class={GRID.bandSummary}>{group.part.summary}</span>
								</th>
							</tr>
						{/if}
						{#each group.rows as row (row.decision.id)}
							<tr class={GRID.row}>
								<th scope="row" class="{GRID.cell} min-w-56 text-left">
									<button type="button" class={GRID.decision} title="Go to {labelOf(row.decision.id)}" onclick={() => onGoTo(row.decision.id)}>
										<span class={GRID.stepNumber}>{labelOf(row.decision.id)}</span>
										{row.decision.question}
									</button>
								</th>
								<td class="{GRID.cell} min-w-36">
									{#if row.chosen}
										<span class="inline-block {CHIP.base} {CHIP.active}">{row.chosen.name}</span>
									{:else}
										<span class={TEXT.empty}>{EMPTY.notDecided}</span>
									{/if}
								</td>
								<td class="{GRID.cell} min-w-64">
									{#if row.chosen}
										<ul class={GRID.points}>
											{#each row.chosen.gain as point}
												<li>{point}</li>
											{/each}
										</ul>
									{/if}
								</td>
								<td class="{GRID.cell} min-w-64">
									{#if row.chosen}
										<ul class={GRID.points}>
											{#each row.chosen.cost as point}
												<li>{point}</li>
											{/each}
										</ul>
									{/if}
								</td>
								<td class="{GRID.cell} min-w-64">
									{#if row.chosen}
										<ul class="space-y-1.5">
											{#each row.decision.limits as limit}
												<li class={GRID.limitNote}>
													<button type="button" class={ROW_ACTION.neutral} onclick={() => onGoTo(limit.decisionId)}>{labelOf(limit.decisionId)}</button>
													<span class="block">{limit.note}</span>
												</li>
											{/each}
										</ul>
									{/if}
								</td>
								<td class="{GRID.cell} min-w-48">
									{#if row.chosen && row.note.trim()}
										<p class="whitespace-pre-wrap {GRID.limitNote}">{row.note}</p>
									{:else if row.chosen}
										<span class={TEXT.empty}>No reason yet</span>
									{/if}
								</td>
							</tr>
						{/each}
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
