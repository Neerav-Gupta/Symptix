<div class="footer-container">
  <span class="footer-title">SYMPTIX</span>
  <button class="footer-text" style="margin-left: 10%;"
    >© 2024 SYMPTIX Inc.</button
  >
  <button
    class="footer-text footer-button"
    style="margin-left: 0;"
    on:click={() => {
      window.location.href = "/";
    }}>Home</button
  >
  <button
    class="footer-text footer-button"
    style="margin-left: 0;"
    on:click={() => {
      window.location.href = "Doctors";
    }}>Doctors</button
  >
  <button
    class="footer-text footer-button"
    style="margin-left: 0;"
    on:click={() => {
      window.location.href = "Chatbot";
    }}>Chatbot</button
  >
  <button class="footer-text footer-button" style="margin-left: 0;"
    >Privicy Policy</button
  >
  <button
    class="footer-text footer-button"
    style="margin-left: 0; margin-right: 10%;">Terms of Service</button
  >
</div>

<style>
  .footer-container {
    background-color: #e9efec;
    height: 80px;
    display: flex;
    margin-top: auto;
  }

  .footer-title {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 50px;
    font-family: "Major Mono Display";
    color: #16423c;
    font-size: 35px;
  }

  .footer-text {
    margin-top: auto;
    margin-bottom: auto;
    font-family: "Quicksand";
    color: #16423c;
    font-size: 15px;
    text-align: center;
    border: none;
    background-color: inherit;
    width: 300px;
  }

  .footer-button {
    text-decoration: underline;
    font-size: 15px;
  }

  .footer-button:hover {
    cursor: pointer;
  }
</style>
