<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import LightSwitch from '$lib/components/light-switch.svelte';
	import SearchForm from '$lib/components/search-form.svelte';
	import { base } from '$app/paths';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
	const data = {
		navMain: [
			{
				items: [
					{
						title: 'Home',
						url: `${base}/home`
					},
					{
						title: 'About',
						url: `${base}/about`
					},
					{
						title: 'Services',
						url: `${base}/services`
					},
					{
						title: 'Contact',
						url: `${base}/contact`
					}
				]
			},
			{
				title: 'Community',
				url: '#',
				items: [
					{
						title: 'Roster',
						url: `${base}/roster`
					},
					{
						title: 'Events',
						url: `${base}/events`
					},
					{
						title: 'Blog',
						url: `${base}/blog`
					}
					// {
					// 	title: 'Claim',
					// 	url: ''
					// }
				]
			},
			{
				title: 'Social',
				url: '#',
				items: [
					{
						title: 'Discord',
						url: 'https://discord.com/invite/xp3VwS5ySF'
					},
					{
						title: 'Twitter',
						url: 'https://x.com/3planetstudio'
					}
				]
			}
		]
	};
</script>

<Sidebar.Root {...restProps} bind:ref variant="floating">
	<Sidebar.Header>
		<a href="{base}/">
			<div class="flex items-center justify-between px-4">
				<h1 class="text-2xl font-bold">
					Third Planet
					<span class="text-lg text-gray-500">Studio</span>
				</h1>
				<LightSwitch />
			</div>
		</a>
		<!-- <SearchForm /> -->
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- We create a Sidebar.Group for each parent. -->
		{#each data.navMain as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton class="text-2xl">
									{#snippet child({ props })}
										<a href={item.url} {...props}>{item.title}</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Footer>
		<Card.Root class="shadow-none">
			<form>
				<Card.Header class="p-4 pb-0">
					<Card.Title class="text-sm">Claim All access</Card.Title>
					<Card.Description>Mint a pass to access all of our services</Card.Description>
				</Card.Header>
				<Card.Content class="grid gap-2.5 p-4">
					<Button
						class="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
						size="lg"
						variant="secondary"
						onclick={() => window.open('https://thirdweb.com/polygon/0x30d3A5FBbd459825ab4C56F8db6d5C90f8c3C411/nfts/0', '_blank')}
					>
						Visit thirdweb
					</Button>
				</Card.Content>
			</form>
		</Card.Root>
		<br />
		<Card.Root class="shadow-none">
			<form>
				<Card.Header class="p-4 pb-0">
					<Card.Title class="text-sm">Contact us</Card.Title>
					<Card.Description>For more information</Card.Description>
				</Card.Header>
				<Card.Content class="grid gap-2.5 p-4">
					<Button
						class="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
						size="lg"
						variant="secondary"
						onclick={() => window.open('https://forms.gle/oBdmRcnZKCKCZ7PJ8', '_blank')}
					>
						Contact form
					</Button>
				</Card.Content>
			</form>
		</Card.Root>
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
