<script>
    import { createEventDispatcher } from "svelte";
  
    const dispatch = createEventDispatcher();
    export let info;
    export let rawValue;
  
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
        <br/>
      <span class="card-title">{info.text}</span>
      <br /><br />
      <select bind:value={rawValue} on:change={sendEvent}>
        {#each info.choices as option}
        {#if option.value == info.user}
            <option value={option.value} selected>{option.text}</option>
        {:else}
            <option value={option.value}>{option.text}</option>
        {/if}
        {/each}
      </select>
      <br /><br /><br />
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
  
    select {
      background: #c4dad2;
      border-radius: 10px;
      float: left;
      font-family: inherit;
      padding: 5px;
      width: 100%;
      overflow: visible;
      border: 2px solid #16423c;
      max-width: 100%;
      text-overflow: ellipsis;
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
  