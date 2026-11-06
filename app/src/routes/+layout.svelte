<script lang="ts">
	import '../app.css';
	import { APP } from '$lib/canon/instructions';
	let { children } = $props();
</script>

<svelte:head>
	<title>{APP.title}</title>
	<meta name="description" content={APP.description} />
	<meta property="og:title" content={APP.title} />
	<meta property="og:description" content={APP.description} />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="flex flex-col h-screen">
	<main class="flex-1 overflow-hidden flex flex-col">
		{@render children()}
	</main>
	<footer class="bg-slate-50 border-t border-slate-200 px-6 py-3 text-center text-[11px] text-slate-400 shrink-0">
		Early draft. <a href="https://github.com/AgileDataGuides/context-plane-architecture-decisions/issues" target="_blank" rel="noopener" class="underline hover:text-slate-600">Send feedback</a>
		&middot; An <a href="https://agiledataguides.com" target="_blank" rel="noopener" class="underline hover:text-slate-600">AgileDataGuides</a> Pattern Template
		&middot; Code: <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener" class="underline hover:text-slate-600">MIT</a>
		&middot; Docs: <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener" class="underline hover:text-slate-600">CC BY-SA 4.0</a>
	</footer>
</div>
