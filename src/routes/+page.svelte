<script>
  import Footer from "$lib/Common/Footer.svelte";
  import Navbar from "$lib/Common/Navbar.svelte";
  import Typewriter from "svelte-typewriter";
  import UserNavbar from "$lib/Common/UserNavbar.svelte";
  import ChatbotImage from "$lib/Common/ChatbotDisplay.png";
  import For_Doctors_Image1 from "$lib/Common/For_Doctors_Image1.png";
  import For_Doctors_Image2 from "$lib/Common/For_Doctors_Image2.png";
  import For_Doctors_Image3 from "$lib/Common/For_Doctors_Image3.png";
  import ForumImage from "$lib/Common/Forum.png";
  import { onMount } from "svelte";

  let signedIn = false;
  let features = [
    {
      title: "Search For a Symptom",
      description:
        "Choose from over 800 symptoms which your patient might have!",
      image: For_Doctors_Image1,
    },
    {
      title: "View/Edit/Update Symptoms",
      description:
        "View all your added symptoms and change the severity of them!",
      image: For_Doctors_Image2,
    },
    {
      title: "Get Results",
      description:
        "View a nicely formatted list of conditions which your patient might have, along with some supplemental information!",
      image: For_Doctors_Image3,
    },
  ];
  let displayBox = features[0];

  onMount(() => {
    signedIn = localStorage.getItem("firebaseUser");
    const typingInterval = setInterval(() => {
      if (true) {
        if (displayBox == features[features.length - 1]) {
          displayBox = features[0];
        } else {
          displayBox = features[features.indexOf(displayBox) + 1];
        }
      } else {
        clearInterval(typingInterval);
      }
    }, 8000);

    return () => clearInterval(typingInterval);
  });
</script>

<main>
  {#if signedIn}
    <UserNavbar
      on:logout={() => {
        signedIn = false;
      }}
    />
  {:else}
    <Navbar />
  {/if}
  <div style="background-color: #c4dad2;">
    <div class="search-header-container">
      <div style="width: 50%; margin: auto; margin-top: 10vh;">
        <span class="search-header">
          Symptom Checker<br /> Fit For You
        </span>
        <br /> <br /><br />
        <span class="search-subheader">
          <Typewriter mode="loopRandom" wordInterval="3000">
            <p>Your AI Companion for Smarter, Faster Health Diagnoses!</p>
            <p>Unlock symptom insights with the power of AI!</p>
            <p>AI-driven answers for your health, right at your fingertips!</p>
            <p>
              Get instant diagnosis and real-time support, all in one place!
            </p>
            <p>Your health questions, smart answers - powered by AI!</p>
            <p>Where AI meets your symptoms for smarter care!</p>
          </Typewriter>
        </span>
        <br /> <br />
        <div class="features">
          <button
            on:click={() => {
              window.location.href = "Chatbot";
            }}
          >
            <span class="features-number">Start Chatting</span>
          </button>
        </div>
      </div>
      <div style="width: 48%; margin:auto; margin-top: 10vh;">
        <img
          class="fade-in-image"
          src={ChatbotImage}
          alt="Chatbot Demo"
          width="100%"
          style="border-radius: 20px; border: 5px solid #16423C;"
        />
      </div>
    </div>
  </div>
  <div style="background-color: #e9efec;">
    <section class="dynamic-features">
      <h2 class="section-header">
        <span style="font-size: 42px;">By Doctors</span> <br />For Doctors
      </h2>
      <button
        class="move-next"
        on:click={() => {
          if (displayBox == features[0]) {
            displayBox = features[features.length - 1];
          } else {
            displayBox = features[features.indexOf(displayBox) - 1];
          }
        }}>&lt;</button
      >
      <div class="feature-item">
        <button
          disabled
          style="float: left; font-size:larger; padding: 5px; width: 40px; margin-right:30px;"
        >
          {features.indexOf(displayBox) + 1}.
        </button>
        <img
          class="fade-in-image"
          src={displayBox.image}
          alt={displayBox.title}
          style="width:60%; float:left; border-radius: 30px;"
        />
        <h3>{displayBox.title}</h3>
        <p>{displayBox.description}</p>
      </div>
      <button
        class="move-next"
        on:click={() => {
          if (displayBox == features[features.length - 1]) {
            displayBox = features[0];
          } else {
            displayBox = features[features.indexOf(displayBox) + 1];
          }
        }}>&gt;</button
      >
    </section>
  </div>
  <section class="ai-diagnosis">
    <h2 class="section-header">
      <span style="font-size: 42px;">Get The Support You Need</span> <br />From
      Our Forum
    </h2>
    <br />
    <img
      class="fade-in-image"
      src={ForumImage}
      alt="Forum Image"
      style="width: 50%; border-radius:15px; outline: 3px solid #16423C; float: left;"
    />
    <span style="font-size:20px; font-family:inherit; display:block; max-width: 46%; margin-left: auto; display:block; margin-top: 50px; color: #16423C; font-weight: 500;"
      >Ask questions and get replies from real people and professionals on our
      forum! Get an oppurtunity to connect and interact with real people who have had the same issue as you!
    </span>
  </section>
  <Footer />
</main>

<style>
  .dynamic-features,
  .ai-diagnosis {
    padding: 2rem;
    text-align: center;
  }

  .dynamic-features {
    display: flex;
    background-color: #c4dad2;
    padding-top: 50px;
    padding-bottom: 50px;
    height: 650px;
    clip-path: polygon(0 0, 100% 0, 100% 85%, 0% 100%);
  }

  .move-next {
    margin-top: auto;
    margin-bottom: auto;
    font-size: 30px;
    padding: auto;
    margin-left: auto;
    margin-right: auto;
    font-weight: 600;
  }

  .move-next:hover {
    outline: 5px solid #16423c;
  }

  .feature-item {
    width: 60%;
    border: 5px solid #16423c;
    border-radius: 25px;
    padding: 50px 30px 50px 30px;
    transition: transform 0.5s ease;
    font-family: inherit;
    background-color: white;
    max-height: 400px;
  }

  .feature-item h3 {
    color: #16423c;
    font-size: 30px;
    font-family: inherit;
    font-weight: 600;
  }

  .feature-item p {
    color: #16423c;
    font-size: 20px;
    font-family: inherit;
  }

  .feature-item:hover {
    transform: scale(1.05);
  }

  .section-header {
    font-family: SUSE, sans-serif;
    font-size: 55px;
    background: -webkit-linear-gradient(#16423c, #6a9c89);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 50px;
  }

  .ai-diagnosis {
    background-color: #e9efec;
    height: 65vh;
    max-width: 80%;
    display: block;
    margin: auto;
  }

  @import url("https://fonts.googleapis.com/css2?family=SUSE:wght@100..800&display=swap");

  main {
    font-family: "SUSE", sans-serif;
    background-color: #e9efec;
  }

  @keyframes makeTitleLarger {
    100% {
      font-size: 75px;
    }
  }

  .fade-in-image {
    animation: fadeIn 5s;
    transition: transform 0.3s ease;
    transform-origin: bottom right;
  }

  .fade-in-image:hover {
    transform: rotate(3deg);
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .search-header {
    font-size: 65px;
    background: -webkit-linear-gradient(#e9efec, #c4dad2);
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
    --cursor-color: #16423c;
  }

  .search-header-container {
    background: linear-gradient(to top, #6a9c89 30%, #16423c);
    padding: 50px;
    text-align: center;
    height: 100vh;
    display: flex;
    clip-path: polygon(0 0, 100% 0, 100% 85%, 0% 100%);
  }

  button {
    padding: 20px;
    font-family: "SUSE", sans-serif;
    color: white;
    border-radius: 10px;
    border: none;
    background-color: #16423c;
    vertical-align: middle;
  }

  button:hover {
    background-color: #c4dad2;
    color: #16423c;
    cursor: pointer;
  }

  .features-number {
    font-size: 30px;
    margin-right: 10px;
  }

  .features button span {
    vertical-align: middle;
  }
</style>
