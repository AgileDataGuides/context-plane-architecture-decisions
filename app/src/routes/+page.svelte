<script lang="ts">
	import { setContext } from 'svelte';
	import { createDecisionsStore, readImport } from '$lib/stores/decisions.svelte';
	import { decisions, parts } from '$lib/data';
	import { exportPayload } from '$lib/model/tradeoffs';
	import { buildSteps, stepsTabLabel } from '$lib/model/steps';
	import { APP } from '$lib/canon/instructions';
	import { BUTTON, HEADER, TAB, TEXT } from '$lib/ui/tokens';
	import type { DecisionActions } from '$lib/types';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import StepsView from '$lib/components/canvas/StepsView.svelte';
	import MapTab from '$lib/components/MapTab.svelte';
	import DecisionsTab from '$lib/components/DecisionsTab.svelte';
	import Instructions from '$lib/components/Instructions.svelte';

	// The architectures live in this browser's localStorage
	const store = createDecisionsStore();
	setContext('decisionsStore', store);

	const actions: DecisionActions = {
		choose: (decisionId, patternId) => store.choose(decisionId, patternId),
		setNote: (decisionId, note) => store.setNote(decisionId, note),
		clear: (decisionId) => store.clear(decisionId)
	};

	// The Steps tab is the way in, so it is the first tab and the app opens on
	// it, the same as the other standalone apps. Its name counts its steps.
	type TabId = 'steps' | 'decisions' | 'map' | 'instructions';
	const TABS: { id: TabId; label: string }[] = [
		{ id: 'steps', label: stepsTabLabel(buildSteps(decisions, parts)) },
		{ id: 'decisions', label: 'Decisions' },
		{ id: 'map', label: 'Map' },
		{ id: 'instructions', label: 'Instructions' }
	];
	let activeTab = $state<TabId>('steps');
	// Unset at first, so the Steps tab opens on the step this browser remembers
	let selectedStep = $state<string | undefined>();

	/** A decision's step has the decision's id */
	function goToDecision(decisionId: string) {
		selectedStep = decisionId;
		activeTab = 'steps';
	}

	// Architecture management (header), DESIGN_SYSTEM.md § 17
	let showSwitcher = $state(false);
	let showNew = $state(false);
	let newName = $state('');

	function handleClickOutsideSwitcher(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('[data-architecture-switcher]')) showSwitcher = false;
	}

	function handleNew() {
		const name = newName.trim();
		if (!name) return;
		store.newArchitecture(name);
		newName = '';
		showNew = false;
	}

	function handleDelete() {
		if (!confirm(`Delete "${store.current.name}"?`)) return;
		store.deleteArchitecture(store.current.id);
	}

	/** Import always lands as a new architecture beside the others. It never overwrites one. */
	function handleImport() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;
			if (file.size > 5 * 1024 * 1024) {
				alert('File too large (max 5MB)');
				return;
			}
			try {
				const imported = readImport(JSON.parse(await file.text()), file.name.replace(/\.json$/i, ''));
				if (!imported) {
					alert('Invalid file. Expected a file made by Export JSON in this app.');
					return;
				}
				store.importArchitecture(imported);
			} catch {
				alert('Could not parse JSON file');
			}
		};
		input.click();
	}

	function slugify(name: string): string {
		return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '') || 'architecture';
	}

	function handleExport() {
		const payload = exportPayload(decisions, parts, $state.snapshot(store.current), new Date().toISOString());
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${slugify(store.current.name)}-architecture-decisions.json`;
		link.click();
		URL.revokeObjectURL(url);
	}

	function handleClearAll() {
		if (!confirm(`Clear every decision and every reason in "${store.current.name}"?`)) return;
		store.clearAll();
	}
</script>

<svelte:window onclick={handleClickOutsideSwitcher} />

<!-- App Header (dark), DESIGN_SYSTEM.md § 17 -->
<header class="bg-slate-900 text-white px-6 py-3 shrink-0">
	<div class="flex items-center justify-between gap-4">
		<div>
			<h1 class={TEXT.appTitle}>{APP.title}</h1>
			<p class="{TEXT.appTagline} mt-0.5">{APP.tagline}</p>
		</div>
		<div class="flex items-center gap-2" data-architecture-switcher>
			<div class="relative">
				<button
					type="button"
					class={HEADER.switcher}
					aria-haspopup="listbox"
					aria-expanded={showSwitcher}
					aria-label="Switch architecture"
					onclick={() => (showSwitcher = !showSwitcher)}
				>
					<span class={HEADER.switcherName}>{store.current.name}</span>
					<svg class="{HEADER.chevron} {showSwitcher ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				{#if showSwitcher}
					<div class={HEADER.panel} role="listbox" aria-label="Architectures">
						{#each store.savedList as item (item.id)}
							<button
								type="button"
								role="option"
								aria-selected={item.id === store.current.id}
								class="{HEADER.item} {item.id === store.current.id ? HEADER.itemActive : HEADER.itemInactive}"
								onclick={() => {
									store.switchTo(item.id);
									showSwitcher = false;
								}}
							>{item.name}</button>
						{/each}
					</div>
				{/if}
			</div>
			{#if showNew}
				<!-- svelte-ignore a11y_autofocus -->
				<input
					type="text"
					placeholder="Architecture name..."
					aria-label="New architecture name"
					autofocus
					bind:value={newName}
					onkeydown={(e) => {
						if (e.key === 'Enter') handleNew();
						if (e.key === 'Escape') {
							showNew = false;
							newName = '';
						}
					}}
					class={HEADER.nameInput}
				/>
				<button type="button" class={BUTTON.create} onclick={handleNew}>Create</button>
				<button
					type="button"
					class={BUTTON.headerCancel}
					onclick={() => {
						showNew = false;
						newName = '';
					}}>Cancel</button
				>
			{:else}
				<button type="button" class={BUTTON.headerNeutral} onclick={() => (showNew = true)}>New Architecture</button>
				<button
					type="button"
					class={BUTTON.headerNeutral}
					title="Import an architecture file as a new architecture"
					onclick={handleImport}>Import</button
				>
			{/if}
			<button type="button" class={BUTTON.deleteHeader} onclick={handleDelete}>Delete</button>
		</div>
	</div>
</header>

<!-- Toolbar -->
<div class="px-6 py-3 border-b border-slate-200 bg-white shrink-0">
	<Toolbar onExport={handleExport} />
</div>

<!-- Tabs -->
<div class="flex gap-0 px-4 border-b border-slate-200 shrink-0" role="tablist">
	{#each TABS as tab (tab.id)}
		<button
			type="button"
			role="tab"
			aria-selected={activeTab === tab.id}
			class="{TAB.wrapper} {activeTab === tab.id ? TAB.active : TAB.inactive}"
			onclick={() => (activeTab = tab.id)}
		>{tab.label}</button>
	{/each}
</div>

{#if activeTab === 'steps'}
	<div class="flex-1 overflow-hidden flex flex-col min-h-0">
		<StepsView
			{decisions}
			{parts}
			choices={store.choices}
			{actions}
			onOpenDecisions={() => (activeTab = 'decisions')}
			bind:selected={selectedStep}
		/>
	</div>
{:else if activeTab === 'map'}
	<div class="flex-1 overflow-y-auto">
		<MapTab {decisions} choices={store.choices} onGoTo={goToDecision} />
	</div>
{:else if activeTab === 'decisions'}
	<div class="flex-1 overflow-hidden flex flex-col min-h-0">
		<DecisionsTab {decisions} {parts} choices={store.choices} onGoTo={goToDecision} onClearAll={handleClearAll} />
	</div>
{:else}
	<div class="flex-1 overflow-y-auto">
		<Instructions />
	</div>
{/if}
