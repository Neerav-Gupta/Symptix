<script>
  import { onMount } from "svelte";
  import { signOut } from "firebase/auth";
  import { auth } from "$lib/API/Firebase";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function sendLogout() {
    dispatch("logout");
  }

  let name = "";
  let email = "";
  onMount(() => {
    console.log()
    document.getElementById("profile-img").src =
      JSON.parse(localStorage.getItem("firebaseUser")).photoURL != undefined
        ? JSON.parse(localStorage.getItem("firebaseUser")).photoURL
        : "data:image/png;base64,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";
    name = JSON.parse(localStorage.getItem("firebaseUser")).displayName != undefined ? JSON.parse(localStorage.getItem("firebaseUser")).displayName : "No Name";
    email = JSON.parse(localStorage.getItem("firebaseUser")).email;
  });

  const logoutUser = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("firebaseUser");
      sendLogout();
    } catch (error) {
      console.log(error);
    }
  };
</script>

<main>
  <div class="navbar-container">
    <br /><br /><br /><br />
  </div>
  <div class="navbar">
    <span class="navbar-title">SYMPTIX</span>
    <button
      class="navbar-button1"
      on:click={() => {
        window.location.href = "/";
      }}>HOME</button
    >
    <button
      class="navbar-button1"
      on:click={() => {
        window.location.href = "Chatbot";
      }}>CHATBOT</button
    >
    <button
      class="navbar-button1"
      on:click={() => {
        window.location.href = "Forum";
      }}>FORUM</button
    >
    <button
      class="navbar-button2"
      on:click={() => {
        window.location.href = "Doctors";
      }}>FOR DOCTORS &#8599;</button
    >
    <button class="navbar-button3">
      <img
        src=""
        alt="Profile Picture"
        id="profile-img"
        style="width: 65px; border-radius: 100%;"
      />
      <div class="profile">
        <button>{name}</button>
        <button>{email}</button>
        <button on:click={logoutUser}>SIGN OUT</button>
      </div>
    </button>
  </div>
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Major+Mono+Display&family=Quicksand:wght@300..700&display=swap");

  .navbar-container {
    background-color: #16423c;
  }

  .navbar {
    float: left;
    height: 85px;
    background-color: #e9efec;
    width: 95%;
    border-radius: 10px;
    z-index: 10;
    position: fixed;
    top: 2.5%;
    left: 2.3%;
    border: 2px solid #16423c;
    vertical-align: middle;
    display: flex;
  }

  .navbar-title {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 50px;
    font-family: "Major Mono Display";
    color: #16423c;
    font-size: 35px;
    margin-right: 15%;
  }

  .navbar-button1 {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: 20px;
    font-family: "Quicksand";
    color: #16423c;
    font-size: 25px;
    width: 200px;
    text-align: center;
    border: none;
    background-color: inherit;
  }

  .navbar-button1:hover {
    border: 2px solid #16423c;
    border-radius: 100px;
    padding: 15px;
    cursor: pointer;
  }

  .navbar-button3 {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: auto;
    font-family: "Quicksand";
    color: #16423c;
    font-size: 25px;
    width: 200px;
    text-align: center;
    border: none;
    background-color: inherit;
    border-radius: 20px;
    padding: 0;
  }

  .profile {
    display: none;
    border-radius: 20px;
    background-color: inherit;
    position: fixed;
    z-index: 200;
    width: 200px;
  }

  .profile button {
    width: 100%;
    border: none;
    border-radius: 20px;
    padding: 10px;
    background-color: inherit;
    color: #16423c;
    font-family: inherit;
    font-weight: 600;
  }

  .profile button:hover {
    background-color: #6a9c89;
    color: #e9efec;
    cursor: pointer;
  }

  .navbar-button3:hover .profile {
    display: block;
  }

  .navbar-button2 {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: auto;
    font-family: "Quicksand";
    color: #16423c;
    font-size: 20px;
    border: 2px solid #16423c;
    border-radius: 100px;
    padding: 15px;
    background-color: inherit;
    width: 225px;
  }

  .navbar-button2:hover {
    color: white;
    background-color: #16423c;
    cursor: pointer;
  }
</style>
