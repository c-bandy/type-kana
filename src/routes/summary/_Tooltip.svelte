<script context="module" lang="ts">
	import { writable } from "svelte/store"
	import { fade } from "svelte/transition"
	import { cubicOut } from "svelte/easing"
	import { getAnswers } from "@/lib/answer"
	import type { SummaryKana } from "@/stores/summary"

	// modified from https://github.com/stephane-vanraes/renderless-svelte/blob/master/src/Tooltip.svelte

	const focused = writable<SummaryKana>(null)
	const rect = writable<DOMRect>(null)

	export function tooltip(node: HTMLElement, item: SummaryKana) {
		function enter() {
			document.addEventListener("scroll", updateRect)
			window.addEventListener("resize", updateRect)

			focused.set(item)
			rect.set(node.getBoundingClientRect())
		}

		function leave() {
			document.removeEventListener("scroll", updateRect)
			window.removeEventListener("resize", updateRect)

			focused.set(null)
		}

		function updateRect() {
			rect.set(node.getBoundingClientRect())
		}

		node.addEventListener("mouseover", enter)
		node.addEventListener("mouseout", leave)
		node.addEventListener("focus", enter)
		node.addEventListener("blur", leave)

		return {
			destroy() {
				node.removeEventListener("mouseover", enter)
				node.removeEventListener("mouseout", leave)
				node.removeEventListener("focus", enter)
				node.removeEventListener("blur", leave)
				document.removeEventListener("scroll", updateRect)
				window.removeEventListener("resize", updateRect)

				focused.set(null)
			},
			update(_item: SummaryKana) {
				focused.set(_item)
			}
		}
	}
</script>

<script lang="ts">
	import { clamp, uniqArray } from "@/lib/util"
	import { afterUpdate } from "svelte"

	function listWrongAnswers(item: SummaryKana): string {
		return uniqArray(item.answers)
			.filter((s) => !getAnswers(item.kana).includes(s)) // only wrong answers
			.map((s) => `"${s}"`)
			.join(", ")
	}

	function calculateArrowStyle(el: DOMRect) {
		const top = window.scrollY + el.y + el.height
		const left = window.scrollX + el.x + el.width / 2

		return `top: ${top}px; left: ${left}px;`
	}

	function calculateBodyStyle(el: DOMRect, self: DOMRect) {
		const top = window.scrollY + el.y + el.height + 4
		const left = clamp(
			0,
			window.scrollX + el.x + el.width / 2 - self.width / 2,
			document.body.offsetWidth - self.width
		)

		return `top: ${top}px; left: ${left}px;`
	}

	let tooltipBody: HTMLElement
	let arrowStyle: string
	let bodyStyle: string

	afterUpdate(() => {
		if (tooltipBody) {
			arrowStyle = calculateArrowStyle($rect)
			bodyStyle = calculateBodyStyle($rect, tooltipBody.getBoundingClientRect())
		}
	})
</script>

{#if $focused}
	<div class="tooltip" transition:fade={{ duration: 125, easing: cubicOut }}>
		<div class="arrow" style={arrowStyle} aria-hidden="true" />
		<div
			class="body"
			style={bodyStyle}
			aria-live="assertive"
			aria-atomic="true"
			bind:this={tooltipBody}
		>
			<strong>{getAnswers($focused.kana).join(", ")}</strong>
			{#if $focused.incorrectTimes > 0}
				<br />
				you wrote: {listWrongAnswers($focused)}
			{/if}
		</div>
	</div>
{/if}

<style>
	.tooltip {
		position: absolute;
		z-index: 1;
		width: 100%;
	}

	.body {
		position: absolute;
		background: var(--background-color-inverse);
		color: var(--text-color-inverse);
		padding: 0.2em 0.5em;
		border-radius: var(--standard-border-radius);
		user-select: none;
		font-size: 90%;
		letter-spacing: 1px;
		line-height: 1.25;
		text-align: center;
		box-sizing: border-box;
		min-width: 2em;
		max-width: 15em;
	}

	.arrow {
		position: absolute;
		width: 0;
		height: 0;
		border-width: 0 4px 4px 4px;
		border-style: solid;
		border-color: transparent transparent var(--background-color-inverse)
			transparent;
		transform: translateX(-50%);
	}
</style>