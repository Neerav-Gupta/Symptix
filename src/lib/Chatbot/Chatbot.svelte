<script>
  import { setup, ask } from "./chatbot";
  import { onMount } from "svelte";
  import Navbar from "../Common/Navbar.svelte";
  import Footer from "../Common/Footer.svelte";
  import Ai_logo from "./AI Logo.png";
  import User_logo from "./User Logo.png";
  import UserNavbar from "$lib/Common/UserNavbar.svelte";

  let signedIn = false;

  let rawQuery = "";
  let thinking = false;
  $: all = [];

  onMount(async () => {
    signedIn = localStorage.getItem("firebaseUser");
    thinking = true;
    await setup().then((res) => {
      res = res.split("\n");
      all = [...all, { query: "None", response: res }];
      thinking = false;
    });
  });

  async function handleSearch() {
    thinking = true;
    await ask(rawQuery).then((res) => {
      res = res.split("\n");
      all = [...all, { query: rawQuery, response: res }];
      rawQuery = "";
      thinking = false;
    });
  }
</script>

<main>
  <div class="chat-bot-container">
    {#if signedIn}
      <UserNavbar on:logout={() => {signedIn = false;}} />
    {:else}
      <Navbar />
    {/if}
    <div class="search-header-container">
      <img
        src={Ai_logo}
        alt="Image"
        style="float: right; margin-right: 5%;"
        height="500px"
      />
      <br /> <br /><br /> <br /><br /> <br /><br /> <br />
      <span class="search-header"> Talk to our Chatbot right now! </span>
      <br /> <br />
      <span class="search-subheader">
        Enter symptoms or any medical related questions you might <br /> have and
        within seconds you will recieve detailed answers!
      </span>
      <br /> <br /> <br /> <br /> <br />
      <div class="features">
        <button
          ><span class="features-number">AI-Powered</span>
          <span>Chatbot</span></button
        >
        <button
          ><span class="features-number">Plain English</span>
          <span>Reponses</span></button
        >
      </div>
      <br /> <br /><br /> <br />
    </div>
    <br /><br /><br />
    <div class="chatbot-container">
      <span class="symptoms-title">Chatbot:</span><br /><br /><br />
      {#each all as item}
        {#if item.query == "None"}
          <div class="ai-container">
            <img
              src={Ai_logo}
              alt="AI Image"
              class="text-logo"
              style="position: absolute; z-index: 2;"
            />
            {#each item.response as word}
              <span
                style="margin-top: auto; margin-bottom: auto; margin-left: 60px; width:100%; "
                >{word}</span
              ><span width="100%"> </span>
            {/each}
          </div>
        {:else}
          <div class="user-container">
            <img
              src={User_logo}
              alt="User Image"
              class="text-logo"
              style="position: absolute; z-index: 2;"
            />
            <span
              style="margin-top: auto; margin-bottom: auto; margin-left: 60px; width:100%; "
              >{item.query}</span
            >
          </div>
          <br />
          <div class="ai-container">
            <img
              src={Ai_logo}
              alt="AI Image"
              class="text-logo"
              style="position: absolute; z-index: 2;"
            />
            {#each item.response as word}
              <span
                style="margin-top: auto; margin-bottom: auto; margin-left: 60px; width:100%; "
                >{#if word.includes("**")}
                  {#if word != item.response[0]}
                    <br />
                  {/if}
                  {#if word.replaceAll("**", "").includes("*")}
                    <li>
                      <b>{word.split("**")[1].replaceAll("*", "")}</b>{word
                        .split("**")[2]
                        .replaceAll("*", "")}
                    </li>
                  {:else}
                    <b>{word.split("**")[1]}</b>{word.split("**")[2]}
                  {/if}
                {:else}
                  {#if word.includes("*")}
                    <li>{word.replaceAll("*", "")}</li>
                  {:else}
                    {word}
                  {/if}
                {/if}</span
              ><span width="100%"></span>
            {/each}
            <br />
          </div>
        {/if}
      {/each}
      {#if thinking}
        {#if rawQuery != ""}
          <div class="user-container">
            <img
              src={User_logo}
              alt="User Image"
              class="text-logo"
              style="position: absolute; z-index: 100;"
            />
            <span
              style="margin-top: auto; margin-bottom: auto; margin-left: 60px; width:100%; "
              >{rawQuery}</span
            >
          </div>
        {/if}
        <br />
        <div class="ai-container">
          <img src={Ai_logo} alt="AI Image" class="text-logo" />
          <span
            class="thinking-dots"
            style="margin-top: auto; margin-bottom: auto; margin-left: 10px;"
          >
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </span>
        </div>
      {/if}
      <br /><br />
      <div class="searchbar">
        <span
          style="display: flex; justify-content: center; width: 60px; margin: auto;"
        >
          <img src={User_logo} alt="User Image" class="text-logo" />
        </span>
        {#if thinking}
          <input
            type="text"
            bind:value={rawQuery}
            on:keyup={(event) => {
              if (event.key == "Enter") {
                handleSearch();
              }
            }}
            placeholder="Start talking now..."
            disabled
          />
        {:else}
          <input
            type="text"
            bind:value={rawQuery}
            on:keyup={(event) => {
              if (event.key == "Enter") {
                handleSearch();
              }
            }}
            placeholder="Start talking now..."
          />
        {/if}
        {#if rawQuery == "" || thinking}
          <button
            class="search-button"
            style="display: flex; justify-content: center; margin: auto;"
            on:click={handleSearch}
            disabled
            >&#10548;
          </button>
        {:else}
          <button
            class="search-button"
            style="display: flex; justify-content: center; margin: auto;"
            on:click={handleSearch}
            >&#10548;
          </button>
        {/if}
        <div style="flex-basis: 100%; height: 0;"></div>
      </div>
    </div>
    <br /><br /><br />
    <Footer />
  </div>
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=SUSE:wght@100..800&display=swap");

  .ai-container {
    padding: 10px;
    font-family: inherit;
    font-size: larger;
    display: flex;
    flex-wrap: wrap;
  }

  .user-container {
    padding: 10px;
    font-family: inherit;
    font-size: larger;
    display: flex;
    flex-wrap: wrap;
  }

  .searchbar {
    border-radius: 10px;
    background-color: #e9efec;
    display: flex;
    color: black;
    height: 60px;
    margin: auto;
    flex-wrap: wrap;
  }

  .searchbar input {
    border-radius: 10px;
    border: none;
    font-family: "SUSE", sans-serif;
    font-size: 20px;
    background-color: #e9efec;
    height: inherit;
    width: 1000px;
  }

  .search-button {
    border-radius: 10px;
    width: 70px;
    background-color: #16423c;
    color: white;
    font-family: "SUSE", sans-serif;
    font-size: 50px;
    border: none;
    max-height: 60px;
  }

  .search-button:hover {
    cursor: pointer;
    background-color: #6a9c89;
  }

  .text-logo {
    width: 40px;
    height: 40px;
  }

  .thinking-dots {
    display: inline-flex;
    align-items: center;
  }

  .dot {
    width: 8px;
    height: 8px;
    background-color: #e9efec;
    border-radius: 50%;
    margin: 0 5px;
    animation: bounce 1s ease-in-out infinite;
  }

  @keyframes bounce {
    0% {
      transform: translateY(0);
      background-color: #e9efec;
    }
    50% {
      transform: translateY(-5px);
      background-color: #16423c;
    }
    100% {
      transform: translateY(0);
      background-color: #e9efec;
    }
  }

  .dot:nth-child(1) {
    animation-delay: 0s;
  }

  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  .chatbot-container {
    border: 5px solid #16423c;
    border-radius: 30px;
    width: 1150px;
    margin: auto;
    padding: 30px;
  }

  .symptoms-title {
    font-size: 40px;
    font-weight: 600;
    color: #6a9c89;
    font-family: inherit;
  }

  .chat-bot-container {
    font-family: "SUSE", sans-serif;
    height: 100vh;
  }

  .search-header {
    font-size: 60px;
    font-weight: 600;
    color: #16423c;
  }

  .search-subheader {
    margin-top: 500px;
    font-size: 25px;
    color: #6a9c89;
  }

  .search-header-container {
    background-color: #e9efec;
    padding: 50px;
  }

  .features button {
    padding: 20px;
    font-family: "SUSE", sans-serif;
    color: white;
    margin-right: 30px;
    border-radius: 10px;
    border: none;
    background-color: #16423c;
    vertical-align: middle;
  }

  .features button:hover {
    background-color: #c4dad2;
    color: #16423c;
  }

  .features-number {
    font-size: 30px;
    margin-right: 10px;
  }

  .features button span {
    vertical-align: middle;
  }
</style>
