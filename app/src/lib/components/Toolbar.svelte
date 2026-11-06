<script lang="ts">
	// The Tier 2 toolbar (DESIGN_SYSTEM.md § 17): the current architecture's
	// name and description, one click to edit either, and Export JSON. There
	// is no Save button: every change is stored in the browser as it is made.
	import { getContext } from 'svelte';
	import type { DecisionsStore } from '../stores/decisions.svelte';
	import { BUTTON, TOOLBAR } from '../ui/tokens';

	let { onExport }: { onExport: () => void } = $props();

	const store = getContext<DecisionsStore>('decisionsStore');
	const current = $derived(store.current);

	let editingName = $state(false);
	let editNameValue = $state('');
	let nameInput = $state<HTMLInputElement | null>(null);

	// Escape removes the field, and some browsers then fire blur on it. This
	// flag stops that blur from saving the edit the user cancelled.
	let cancelled = false;

	let editingDesc = $state(false);
	let editDescValue = $state('');
	let descInput = $state<HTMLInputElement | null>(null);

	function startEditName() {
		cancelled = false;
		editNameValue = current.name;
		editingName = true;
		setTimeout(() => nameInput?.focus(), 0);
	}

	function saveName() {
		if (cancelled) return;
		const trimmed = editNameValue.trim();
		editingName = false;
		if (!trimmed || trimmed === current.name) return;
		store.setMeta(trimmed, current.description);
	}

	function startEditDesc() {
		cancelled = false;
		editDescValue = current.description;
		editingDesc = true;
		setTimeout(() => descInput?.focus(), 0);
	}

	function saveDesc() {
		if (cancelled) return;
		editingDesc = false;
		store.setMeta(current.name, editDescValue.trim());
	}

	function onKey(e: KeyboardEvent, save: () => void, cancel: () => void) {
		if (e.key === 'Enter') {
			e.preventDefault();
			save();
		} else if (e.key === 'Escape') {
			cancelled = true;
			cancel();
		}
	}
</script>

<div class={TOOLBAR.card}>
	<div class="flex items-center justify-between gap-3 {TOOLBAR.row}">
		<div class="min-w-0">
			{#if editingName}
				<input
					bind:this={nameInput}
					bind:value={editNameValue}
					onblur={saveName}
					onkeydown={(e) => onKey(e, saveName, () => (editingName = false))}
					type="text"
					aria-label="Architecture name"
					class={TOOLBAR.nameInput}
				/>
			{:else}
				<button type="button" class={TOOLBAR.name} onclick={startEditName} title="Click to edit the name">{current.name}</button>
			{/if}
			{#if editingDesc}
				<input
					bind:this={descInput}
					bind:value={editDescValue}
					onblur={saveDesc}
					onkeydown={(e) => onKey(e, saveDesc, () => (editingDesc = false))}
					type="text"
					aria-label="Architecture description"
					placeholder="Add a description..."
					class={TOOLBAR.descInput}
				/>
			{:else}
				<button
					type="button"
					class="{TOOLBAR.desc} {current.description ? TOOLBAR.descSet : TOOLBAR.descUnset}"
					onclick={startEditDesc}
					title="Click to edit the description"
				>{current.description || 'Click to add a description'}</button>
			{/if}
		</div>
		<div class="shrink-0">
			<button type="button" class={BUTTON.secondary} onclick={onExport}>Export JSON</button>
		</div>
	</div>
</div>
