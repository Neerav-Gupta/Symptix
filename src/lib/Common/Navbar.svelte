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
        window.location.href = "Login";
      }}>LOGIN</button
    >
    <button
      class="navbar-button1"
      on:click={() => {
        window.location.href = "Signup";
      }}>SIGNUP</button
    >
    <button
      class="navbar-button2"
      on:click={() => {
        window.location.href = "Doctors";
      }}>FOR DOCTORS &#8599;</button
    >
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

  .navbar-button2 {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: 50px;
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
