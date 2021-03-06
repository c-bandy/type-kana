import sveltePreprocess from "svelte-preprocess"
import vercel from "@sveltejs/adapter-vercel"
import path from "path"
import replace from "@rollup/plugin-replace"
import { execSync } from "child_process"

/** @type {import('@sveltejs/kit').Config} */
export default {
	// an array of file extensions that should be treated as Svelte components
	extensions: [".svelte"],

	kit: {
		adapter: vercel(),
		target: "body",
		prerender: {
			enabled: false
		},
		vite: {
			resolve: {
				alias: {
					"@": path.resolve("./src")
				}
			},
			optimizeDeps: {
				include: [
					// svelte-focus-trap relies on modules that break dynamic imports, we need to pre-compile it
					"svelte-focus-trap"
				]
			},
			plugins: [
				replace({
					preventAssignment: true,
					values: {
						COMMIT_HASH_SHORT: execSync("git rev-parse --short HEAD")
							.toString()
							.trim(),
						COMMIT_HASH_LONG: execSync("git rev-parse HEAD").toString().trim()
					}
				})
			]
		}
	},

	// options passed to svelte.preprocess (https://svelte.dev/docs#svelte_preprocess)
	preprocess: sveltePreprocess({ postcss: true, typescript: true })
}
