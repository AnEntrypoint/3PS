<script>
	import * as Carousel from '$lib/components/ui/carousel';
	import Autoplay from 'embla-carousel-autoplay';
	export let musician;
	const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>

<Carousel.Root
	plugins={[plugin]}
	opts={{
		align: 'start',
		loop: true
	}}
	class="w-full"
	on:mousenter={plugin.stop}
	on:mouseleave={plugin.play}
>
	<Carousel.Content>
		{#each musician?.pic as pics}
			<Carousel.Item>
				<div class="w-full object-cover object-top lg:w-full lg:h-full">
					<article
						class="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl pb-60 pt-60 max-w-sm mx-auto mt-6"
					>
						<img
							src={pics}
							loading="lazy"
							alt={musician?.name}
							class="absolute inset-0 h-full w-full object-cover object-center"
						/>
					</article>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<!-- <Carousel.Previous />
	<Carousel.Next /> -->
</Carousel.Root>
