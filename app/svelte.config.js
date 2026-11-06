import adapterStatic from '@sveltejs/adapter-static';

const isDemo = process.env.DEMO_BUILD === 'true';

// The app has no server routes: a team's decisions live in the browser. So
// every build is a static site. Two places serve it:
//   - GitHub Pages, under the repo path (DEMO_BUILD=true)
//   - contextplane.ai, at the root (BASE_PATH='' or unset)
// BASE_PATH overrides both, for any other folder the build is copied to.
const base = process.env.BASE_PATH ?? (isDemo ? '/context-plane-architecture-decisions' : '');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapterStatic({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		paths: { base }
	},
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) =>
			filename.includes('node_modules') ? undefined : { runes: true }
	}
};

export default config;
