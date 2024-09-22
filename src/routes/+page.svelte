<script>
  import Footer from "../lib/Common/Footer.svelte";
  import Navbar from "../lib/Common/Navbar.svelte";
  import Typewriter from "svelte-typewriter";
  import UserNavbar from "../lib/Common/UserNavbar.svelte";
  import { onMount } from "svelte";

  let signedIn = false;

  onMount(() => {
    signedIn = localStorage.getItem("firebaseUser");
  });
</script>

<main>
  {#if signedIn}
    <UserNavbar on:logout={() => {signedIn = false;}} />
  {:else}
    <Navbar />
  {/if}
  <div class="search-header-container">
    <br /> <br /><br /> <br /><br /> <br /><br /> <br />
    <span class="search-header">
      AI-Powered Symptom Checker<br /> for Accurate Diagnoses
    </span>
    <br /> <br /><br />
    <span class="search-subheader">
      <Typewriter loop keepCursorOnFinish="true">
        <p>
          Worried about your health? Symptix uses cutting-edge AI to analyze
          your symptoms and provide potential diagnoses in just minutes. Get
          personalized insights and take control of your well-being today.
        </p>
      </Typewriter>
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
  <br /><br /><br /><br /><br /><br /><br /><br /><br />
  <Footer />
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=SUSE:wght@100..800&display=swap");

  main {
    font-family: "SUSE", sans-serif;
  }

  @keyframes makeTitleLarger {
    100% {
      font-size: 75px;
    }
  }

  .search-header {
    font-size: 65px;
    background: -webkit-linear-gradient(#e9efec, #6a9c89);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 900;
    animation: makeTitleLarger 1.5s;
    animation-fill-mode: both;
  }

  .search-subheader {
    font-size: 25px;
    color: #e9efec;
    --cursor-color: black: ;
  }

  .search-header-container {
    background-color: #16423c;
    padding: 50px;
    text-align: center;
    height: 100vh;
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
