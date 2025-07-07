<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	export let status;
	export let message;

	// For GitHub Pages SPA routing, redirect to the correct route
	onMount(() => {
		if (status === 404 && typeof window !== 'undefined') {
			// Check if this is a GitHub Pages 404 that should be handled by SPA router
			const currentPath = window.location.pathname;
			const basePath = base || '';
			
			// If we're in a subdirectory deployment and the path doesn't start with base
			if (basePath && !currentPath.startsWith(basePath)) {
				// Redirect to the base path + current path
				const newPath = basePath + currentPath;
				window.location.replace(newPath);
				return;
			}
			
			// If we're already in the correct base path but getting 404,
			// let SvelteKit handle the routing
			if (currentPath.startsWith(basePath + '/')) {
				const routePath = currentPath.substring(basePath.length);
				goto(routePath);
				return;
			}
		}
	});
</script>

<div class="error-container">
	<h1>{status}</h1>
	<p>{message}</p>
	
	{#if status === 404}
		<p>The page you're looking for doesn't exist.</p>
		<a href="{base}/">Go back to homepage</a>
	{/if}
</div>

<style>
	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 50vh;
		text-align: center;
		padding: 2rem;
	}
	
	h1 {
		font-size: 4rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}
	
	p {
		font-size: 1.2rem;
		margin-bottom: 1rem;
	}
	
	a {
		color: #5a67d8;
		text-decoration: underline;
	}
</style>