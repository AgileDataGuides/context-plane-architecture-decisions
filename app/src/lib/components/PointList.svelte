<script lang="ts">
	// A headed list of points: What you gain, What you pay, Fits when. The
	// heading is a state chip, so the three lists read apart at a glance.
	import { DECISION, STATE_CHIP } from '../ui/tokens';

	let {
		heading,
		tone,
		points
	}: {
		heading: string;
		tone: 'positive' | 'warning' | 'neutral';
		points: string[];
	} = $props();
</script>

<div>
	<span class="{STATE_CHIP.base} {STATE_CHIP[tone]}">{heading}</span>
	<ul class={DECISION.pointList}>
		{#each points as point}
			<li>{point}</li>
		{/each}
	</ul>
</div>
