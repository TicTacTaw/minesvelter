<script>
  import { createEventDispatcher } from 'svelte'
  import board from '../stores/board'
  import game from '../stores/game.js'

  export let isActive = false

  const toggle = () => {
    isActive = !isActive
  }
</script>

<style>
  .switchToggle {
    background-color: transparent;
    width: 30px;
    height: 30px;
    border: 1px solid #333;
    vertical-align: middle;
    padding: 4px;
    cursor: pointer;
  }

  .switchToggle__inner {
    width: 100%;
    height: 100%;
    background-color: #333;
  }
</style>

<button class="switchToggle" on:click={toggle}>
  {#if isActive}
    <div class="switchToggle__inner" />
  {/if}
</button>
