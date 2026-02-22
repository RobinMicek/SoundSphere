<script lang="ts">
	import type { Snippet } from 'svelte';
    
	let { children }: { children: Snipper } = $props();
</script>

<div class="main-layout">
  	<header>
    	<img id="logo" src="/logo.png" alt="Logo">

		<nav>
			<a href="">Button</a>
			<p>Text</p>
		</nav>
  	</header>

  	<main>
	    {@render children()}
  	</main>

  	<footer>
    	<h1>Footer</h1>
  	</footer>
</div>
