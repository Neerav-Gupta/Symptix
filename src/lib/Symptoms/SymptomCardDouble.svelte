<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let info;
  export let rawValue;

  function check() {
    if (rawValue < info.min) {
      rawValue = info.min;
    } else if (rawValue > info.max) {
      rawValue = info.max;
    }
    rawValue = rawValue.toFixed(1);
    sendEvent();
  }

  function sendEvent() {
    dispatch('change', {
        newVal : rawValue,
        text : info.text
    })
  }

  function sendDelete() {
    dispatch('deleted', {
        text : info.text
    })
  }
</script>

<main style="width: 370px;">
  <div class="card-container">
    <br />
    <span class="card-title">{info.text}</span>
    <br /><br /><br />
    <input type="range" min={info.min} max={info.max} step={info.step} bind:value={rawValue} on:change={check} />
    <input type="number" bind:value={rawValue} step={info.step} on:change={check} />
    <br /><br />
    <div class="action-buttons">
      <button class="reset-button" on:click={() => {rawValue=info.default}}>Reset to default</button>
      <button class="delete-button" on:click={sendDelete}>Delete</button>
    </div>
  </div>
</main>

<style>
  .card-container {
    background-color: #e9efec;
    border-radius: 10px;
    border: 2px solid #16423c;
    padding: 20px;
  }

  .card-title {
    font-size: 22px;
    font-weight: 600;
    color: #16423c;
  }

  input[type="range"] {
    -webkit-appearance: none;
    width: 75%;
    height: 25px;
    background: #c4dad2;
    outline: none;
    opacity: 0.7;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
    border-radius: 10px;
    float: left;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: #16423c;
    cursor: pointer;
    border-radius: 10px;
  }

  input[type="range"]::-moz-range-thumb {
    cursor: pointer;
  }

  input[type="number"] {
    border: 2px solid #16423c;
    font-family: inherit;
    border-radius: 10px;
    padding: 5px;
    width: 15%;
    margin-left: 2%;
  }

  .reset-button {
    border-radius: 10px;
    padding: 8px;
    background-color: #16423c;
    color: white;
    font-family: "SUSE", sans-serif;
    border: none;
  }

  .reset-button:hover {
    cursor: pointer;
    background-color: #6a9c89;
  }

  .delete-button {
    border-radius: 10px;
    padding: 8px;
    background-color: #821131;
    color: white;
    font-family: "SUSE", sans-serif;
    border: none;
    margin-left: 10px;
  }

  .delete-button:hover {
    cursor: pointer;
    background-color: #A04747;
  }

  .action-buttons {
    display: flex;
    margin-top: 10px;
  }
</style>
