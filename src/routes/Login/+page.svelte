<script>
  import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
  } from "firebase/auth";
  import { auth, googleProvider } from "$lib/API/Firebase";
  import Navbar from "$lib/Common/Navbar.svelte";
  import { onMount } from "svelte";

  let signedIn = false;
  let email = "";
  let password = "";
  let user = null;
  let error = "";

  onMount(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        user = currentUser;
        localStorage.setItem("firebaseUser", JSON.stringify(currentUser));
      } else {
        user = null;
      }
    });
    if (localStorage.getItem("firebaseUser") != null) {
      signedIn = true;
    }
  });

  const signInWithGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      user = result.user;
      error = "";
      window.location.href = "/";
    } catch (e) {
      error = `Error: ${e.message}`;
      user = null;
    }
  };

  const logIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      user = userCredential.user;
      error = "";
      window.location.href = "/";
    } catch (e) {
      error = `Error: ${e.message}`;
    }
  };
</script>

<main>
  {#if !signedIn}
    <Navbar />
    <br /><br /><br />
    <div class="modal">
      <span class="title">Log In</span>
      <hr class="divider" />
      <div style="padding:40px; padding-top: 20px;">
        <label for="email">E-Mail</label>
        <input
          type="text"
          id="email"
          placeholder="Enter Email..."
          class="data-input"
          bind:value={email}
        />
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter Password..."
          class="data-input"
          bind:value={password}
        />
        <br />
        {#if error != ""}
          <span class="error-message">{error}</span>
        {/if}
        <br />
        <button on:click={logIn}>
          <span style="margin: auto;">Log In</span>
        </button>
        <span class="subtitle">Or</span>
        <button on:click={signInWithGoogle}>
          <i
            class="fa fa-google"
            style="margin-left: 30px; margin-top: auto; margin-bottom: auto;"
          ></i>
          <span style="margin: auto;">Sign in with Google</span>
        </button>
      </div>
    </div>
    <br /><br />
  {:else}
    <br /><br /><br /><br />
    <div class="modal">
      <span class="title">You are already logged in!</span>
      <br /><br />
      <button
        style="width: 50%; margin: auto;"
        on:click={() => {
          window.location.href = "/";
        }}
      >
        <span style="margin: auto;">Go Back to Home!</span>
      </button>
      <br />
    </div>
  {/if}
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=SUSE:wght@100..800&display=swap");

  main {
    font-family: SUSE, sans-serif;
    background-color: #16423c;
    min-height: 100vh;
  }

  .modal {
    background-color: #c4dad2;
    border-radius: 20px;
    width: 30%;
    margin: auto;
    box-shadow: 10px 10px 10px black;
    padding: 30px;
  }

  .title {
    font-family: inherit;
    font-size: 35px;
    font-weight: 600;
    display: block;
    text-align: center;
    margin-top: 30px;
  }

  .subtitle {
    font-family: inherit;
    font-size: 20px;
    display: block;
    text-align: center;
    margin: 10px;
  }

  .divider {
    background-color: #16423c;
    height: 5px;
    width: 30%;
    margin-top: 20px;
    border: none;
  }

  label {
    font-family: inherit;
    color: #16423c;
    font-size: 20px;
    font-weight: 600;
    display: block;
  }

  .data-input {
    width: 100%;
    color: #16423c;
    background-color: white;
    border: none;
    border-radius: 10px;
    height: 30px;
    font-family: inherit;
    font-size: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 20px;
    box-sizing: border-box;
  }

  button {
    width: 100%;
    font-size: 20px;
    padding: 10px;
    font-family: inherit;
    color: #16423c;
    border: none;
    border-radius: 10px;
    display: flex;
    color: white;
    background-color: #16423c;
  }

  button:hover {
    background-color: #6a9c89;
    cursor: pointer;
  }

  .error-message {
    background-color: inherit;
    color: #821131;
    font-size: 18px;
    display: block;
  }
</style>
