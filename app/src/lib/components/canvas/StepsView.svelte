<script lang="ts">
	// The Steps tab: one step per decision, then a step that checks for
	// decisions with no pattern. A rail of steps on the left, the selected
	// step's panel on the right, Back and Next under the panel. A checklist,
	// never a wizard: every step is reachable at any time and no step blocks
	// another. Each row's status line reads off the choices.
	//
	// It takes the decisions, the choices and a set of actions, never a store,
	// so a host can feed it from its own storage. Relative imports, never $lib,
	// for the same reason.
	import { HINT, STEP_NAV, STEP_PANEL, STEP_RAIL, TEXT } from '../../ui/tokens';
	import { CHECK_STEP, EMPTY } from '../../canon/steps';
	import { buildSteps, stepLabel, stepStatus, type Step } from '../../model/steps';
	import type { Choices, Decision, DecisionActions, Part } from '../../types';
	import DecisionPanel from './steps/DecisionPanel.svelte';
	import CheckPanel from './steps/CheckPanel.svelte';

	let {
		decisions,
		parts,
		choices,
		actions,
		onOpenDecisions,
		selected = $bindable()
	}: {
		decisions: Decision[];
		/** The moving parts. The rail groups the decision steps under them. */
		parts: Part[];
		choices: Choices;
		actions: DecisionActions;
		onOpenDecisions: () => void;
		/** The selected step's id. A host can bind it; an unknown value falls back to the remembered step. */
		selected?: string;
	} = $props();

	const steps = $derived(buildSteps(decisions, parts));

	/** A step that starts a new moving part gets the part's name over it on the rail */
	function startsPart(index: number): Part | undefined {
		const s = steps[index];
		if (s.kind !== 'decision' || !s.part) return undefined;
		const before = steps[index - 1];
		if (before && before.kind === 'decision' && before.part?.id === s.part.id) return undefined;
		return s.part;
	}

	// Without a step from the host, the selected step is a per-viewer convenience, remembered in this browser
	const STORAGE_KEY = 'context-plane-architecture-decisions-active-step';

	function remembered(): string | undefined {
		try {
			return localStorage.getItem(STORAGE_KEY) ?? undefined;
		} catch {
			// no storage: start at Step 1
			return undefined;
		}
	}

	if (!selected) selected = remembered();
	// A step can disappear when its decision leaves the content. Then Step 1 shows.
	const stepIndex = $derived(Math.max(0, steps.findIndex((s) => s.id === selected)));
	const step = $derived<Step | undefined>(steps[stepIndex]);

	function select(target: Step) {
		selected = target.id;
		try {
			localStorage.setItem(STORAGE_KEY, target.id);
		} catch {
			// no storage: the choice lasts until reload
		}
	}

	// Back and Next: the steps either side of this one
	const previous = $derived(stepIndex > 0 ? steps[stepIndex - 1] : undefined);
	const next = $derived(stepIndex < steps.length - 1 ? steps[stepIndex + 1] : undefined);

	// A step opens at its top. Keyed on the id, never the step object: every
	// choice rebuilds the step objects, so keying on the object would jump the
	// panel to the top on each click.
	const stepId = $derived(step?.id);
	let scroller = $state<HTMLElement>();
	$effect(() => {
		void stepId;
		scroller?.scrollTo({ top: 0 });
	});

	const statuses = $derived(new Map(steps.map((s) => [s.id, stepStatus(s, steps, choices)])));
</script>

{#if !step}
	<p class="{STEP_PANEL.body} {TEXT.empty}">{EMPTY.noDecisions}</p>
{:else}
	<div class="flex h-full min-h-0">
		<nav class={STEP_RAIL.container} aria-label="The steps">
			<ul class="py-2">
				{#each steps as s, i (s.id)}
					{@const active = s.id === step.id}
					{@const status = statuses.get(s.id)}
					{@const part = startsPart(i)}
					{#if part}
						<li class={STEP_RAIL.group} title={part.summary}>
							<span class={TEXT.tableHeader}>{part.name}</span>
						</li>
					{/if}
					<li class={s.kind === 'check' ? STEP_RAIL.divider : ''}>
						<button
							type="button"
							aria-current={active ? 'step' : undefined}
							class="{STEP_RAIL.row} {active ? STEP_RAIL.rowActive : STEP_RAIL.rowInactive}"
							onclick={() => select(s)}
						>
							<span class={status?.started ? STEP_RAIL.dotStarted : STEP_RAIL.dotEmpty}></span>
							<span class="min-w-0">
								<span class="block {active ? STEP_RAIL.labelActive : STEP_RAIL.labelInactive}">{stepLabel(s)}</span>
								<span class="block {STEP_RAIL.status}">{status?.line}</span>
							</span>
						</button>
					</li>
				{/each}
			</ul>
		</nav>

		<section class="flex-1 min-w-0 flex flex-col overflow-hidden bg-slate-50">
			<div bind:this={scroller} class="flex-1 overflow-y-auto {STEP_PANEL.body}">
				<header class={STEP_PANEL.header}>
					<p class={STEP_PANEL.label}>{stepLabel(step)}</p>
					{#if step.kind === 'decision' && step.part}
						<p class={TEXT.cardDesc}>{step.part.name}: {step.part.summary}</p>
					{/if}
					{#if step.kind === 'decision'}
						<h2 class={STEP_PANEL.question}>{step.decision.question}</h2>
						<p class="max-w-4xl {STEP_PANEL.description}">{step.decision.whyItMatters}</p>
						{#if step.decision.noGoodPracticeYet}
							<p class="pt-1 {HINT.quiet}">
								<svg class={HINT.icon} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
								</svg>
								<span>{step.decision.noGoodPracticeYet}</span>
							</p>
						{/if}
					{:else}
						<h2 class={STEP_PANEL.question}>{CHECK_STEP.question}</h2>
						<p class="max-w-4xl {STEP_PANEL.description}">{CHECK_STEP.description}</p>
					{/if}
				</header>

				{#if step.kind === 'decision'}
					<DecisionPanel decision={step.decision} {steps} {choices} {actions} onGoToStep={select} />
				{:else}
					<CheckPanel {steps} {choices} onGoToStep={select} {onOpenDecisions} />
				{/if}
			</div>

			<nav class={STEP_NAV.bar} aria-label="Move between steps">
				{#if previous}
					{@const to = previous}
					<button type="button" class={STEP_NAV.button} title="Back: {stepLabel(to)}" onclick={() => select(to)}>
						<svg class={STEP_NAV.icon} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
						</svg>
						<span class={STEP_NAV.label}>Back: {stepLabel(to)}</span>
					</button>
				{:else}
					<span></span>
				{/if}
				{#if next}
					{@const to = next}
					<button type="button" class={STEP_NAV.button} title="Next: {stepLabel(to)}" onclick={() => select(to)}>
						<span class={STEP_NAV.label}>Next: {stepLabel(to)}</span>
						<svg class={STEP_NAV.icon} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
						</svg>
					</button>
				{/if}
			</nav>
		</section>
	</div>
{/if}
