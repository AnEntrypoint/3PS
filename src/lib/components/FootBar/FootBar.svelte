<script>
	import { base } from '$app/paths';
	const third_planet = `${base}/images/logo-b.png`;
	const currentYear = new Date().getFullYear();
</script>

<footer>
	<div class="container flex flex-col items-center">
		<img src={third_planet} class="h-12 sm:h-24" alt="" />
		<span class="block text-center text-sm text-gray-500 dark:text-gray-400">
			© {currentYear} ThirdPlanetStudio™. All Rights Reserved. Built by
			<a
				href="https://irb0gie.vercel.app"
				style="color: transparent; background-clip: text; -webkit-background-clip: text; background-image: url('https://i.giphy.com/media/jtvB77L0afuXGlO5Uh/giphy-downsized-large.gif');"
			>
				ᵇ0ᵍⁱᵉ
			</a>
			in
			<a
				href="https://247420.xyz"
				style="color: transparent; background-clip: text; -webkit-background-clip: text; background-image: url('https://i.giphy.com/media/jtvB77L0afuXGlO5Uh/giphy-downsized-large.gif');"
			>
				anentryp❍int.
			</a>
		</span>
	</div>
</footer>
