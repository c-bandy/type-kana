<script lang="ts">
	import QuizItemComponent from "./_QuizItem.svelte"
	import type { QuizItem } from "@/stores/quiz"
	import { getAnswers } from "@/lib/answer"
	import { settings } from "@/stores/settings"
	import Icon from "@/lib/Icon.svelte"
	import { mdiClose as errorMarkerIcon } from "@mdi/js"

	export let unquizzed: QuizItem[]
	export let quizzed: QuizItem[]
	export let input = ""

	$: queue = unquizzed.slice(1)
	$: currentItem = unquizzed[0]
	$: errorMarkerVisible = showErrorMarker(currentItem?.kana, input)

	function showErrorMarker(kana?: string, input?: string): boolean {
		if ($settings.showErrorMarker && kana && input && input.length > 0) {
			return !getAnswers(kana).some((answer) => answer.startsWith(input))
		} else {
			return false
		}
	}

</script>

<section class="quiz">
	<div class="kana-queue">
		{#each [...queue].slice(0, 15) as { kana }}
			<QuizItemComponent {kana} />
		{/each}
	</div>
	<div class="current-kana">
		{#if currentItem}
			<QuizItemComponent kana={currentItem.kana} />
		{/if}
		<div
			class="error-marker"
			class:visible={errorMarkerVisible}
			aria-hidden={!errorMarkerVisible}
		>
			<Icon path={errorMarkerIcon} />
		</div>
	</div>
	<div class="kana-quizzed">
		{#each [...quizzed]
			.reverse()
			.slice(0, 15) as { kana, answered, isCorrectAnswer }}
			<QuizItemComponent {kana} {answered} {isCorrectAnswer} />
		{/each}
	</div>
</section>

<style lang="postcss">
	.quiz {
		--margin: 0.25em;

		display: flex;
		overflow-x: hidden;
		flex-direction: row-reverse;
		padding: 4em 0 2em;
	}
	.kana-quizzed,
	.kana-queue {
		display: flex;
		flex-wrap: nowrap;
		flex: 1 1 0;
		min-width: 0;
	}
	.current-kana {
		position: relative;
	}
	.kana-quizzed {
		flex-direction: row-reverse;
	}

	.error-marker {
		color: var(--highlight-color);
		font-size: 2em;
		display: flex;
		justify-content: center;
		opacity: 0;
		transition: 150ms var(--standard-curve) opacity;

		&.visible {
			opacity: 1;
		}
	}

	.kana-queue :global(.quiz-item) {
		margin-left: var(--margin);

		&:first {
			margin-left: 0;
		}
	}

	.kana-quizzed :global(.quiz-item) {
		margin-right: var(--margin);
	}

</style>
