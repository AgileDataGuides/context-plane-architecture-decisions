<script lang="ts">
	// The Instructions tab: what a Context Plane is, why there are decisions
	// to make, and how to use the app. The wording lives in
	// canon/instructions.ts.
	import { DECISION, STEP_PANEL } from '../ui/tokens';
	import { HOW_TO, SECTIONS } from '../canon/instructions';
</script>

<div class="{STEP_PANEL.body} bg-slate-50 min-h-full">
	<div class={STEP_PANEL.content}>
		{#each SECTIONS as section (section.heading)}
			<section class="space-y-2">
				<h2 class={STEP_PANEL.question}>{section.heading}</h2>
				{#each section.paragraphs as paragraph (paragraph)}
					<p class={DECISION.readingText}>{paragraph}</p>
				{/each}
			</section>
		{/each}

		<section class="space-y-2">
			<h2 class={STEP_PANEL.question}>{HOW_TO.heading}</h2>
			<ol class="list-decimal pl-5 space-y-1 {DECISION.readingText}">
				{#each HOW_TO.steps as step (step)}
					<li>{step}</li>
				{/each}
			</ol>
			<p class={STEP_PANEL.description}>{HOW_TO.storage}</p>
		</section>
	</div>
</div>
