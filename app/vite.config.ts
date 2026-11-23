import adapterStatic from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import path from 'path';

const isDemo = process.env.DEMO_BUILD === 'true';

// The app has no server routes: a team's decisions live in the browser. So
// every build is a static site. Two places serve it:
//   - GitHub Pages, under the repo path (DEMO_BUILD=true)
//   - contextplane.ai, at the root (BASE_PATH='' or unset)
// BASE_PATH overrides both, for any other folder the build is copied to.
const base = (process.env.BASE_PATH ?? (isDemo ? '/context-plane-architecture-decisions' : '')) as '' | `/${string}`;

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			dynamicCompileOptions: ({ filename }) => filename.includes('node_modules') ? undefined : { runes: true },

			adapter: adapterStatic({
				pages: 'build',
				assets: 'build',
				fallback: 'index.html',
				precompress: false,
				strict: false
			}),
			paths: { base }
		})
	],
	server: { port: 5125, host: '127.0.0.1' },
	resolve: { alias: { '$data': path.resolve('..', 'data') } }
});
