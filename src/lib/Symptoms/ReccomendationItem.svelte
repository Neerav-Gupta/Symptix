<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let text;
  let displayFull = false;
  $: displayText = displayFull ? text : text.slice(0, 100);

  onMount(() => {
    if (text.length < 100) {
      displayFull = true;
    }
  });

  function sendEvent() {
    dispatch('clicked', {
        item : text
    })
  }
</script>

<main>
  <button class="outer-button" on:click={sendEvent}>
    <span>{displayText}</span>

    {#if text.length > 100}
      <button
        on:click={(event) => {
          event.stopPropagation();
          displayFull = !displayFull;
        }}
        class="inner-button"
      >
        View
        {#if displayFull}
          less
        {:else}
          more
        {/if}
      </button>
    {/if}
  </button>
</main>

<style>
    .outer-button {
        border: none;
        padding: 10px;
        padding-left: 20px;
        font-family: inherit;
        width: 100%;
        text-align: left;
        background-color: inherit;
        font: 500;
    }

    .outer-button:hover {
        border: 2px solid #16423C;
        border-radius: 10px;
    }

    .outer-button span {
        display: block;
        width: 90%;
        float: left;
    }

    .inner-button {
        float: right;
        border: none;
        border-radius: 10px;
        background-color: #16423C;
        color: white;
        font-family: inherit;
        padding: 10px;
    }

    .inner-button:hover {
        background-color: #6A9C89;
    }
</style>
