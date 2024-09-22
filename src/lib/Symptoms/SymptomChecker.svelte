<script>
  import { onMount } from "svelte";
  import {
    SessionID,
    symptoms,
    APIsymptoms,
    changes,
    saveResults,
  } from "../Store/store";
  import {
    getSessionID,
    acceptTermsOfUse,
    updateFeature,
    deleteFeature,
    getResults,
  } from "../API/EndlessMedicalAPI";
  import ReccomendationItem from "./ReccomendationItem.svelte";
  import symp_json from "../API/SymptomsOutput.json";
  import dise_json from "../API/DiseasesOutput.json";
  import SymptomCardInteger from "./SymptomCardInteger.svelte";
  import SymptomCardDouble from "./SymptomCardDouble.svelte";
  import SymptomCardOptions from "./SymptomCardOptions.svelte";
  import CheckBox from "./CheckBox.svelte";
  import CrossBox from "./CrossBox.svelte";
  import Footer from "../Common/Footer.svelte";
  import Navbar from "../Common/Navbar.svelte";
  import DiagnosisHeroImage from "./DiagnosisHeroImage.png";
  import UserNavbar from "$lib/Common/UserNavbar.svelte";

  let signedIn = false;

  let symptomsJSON = JSON.parse(JSON.stringify(symp_json));
  let diseasesJSON = JSON.parse(JSON.stringify(dise_json));

  onMount(async () => {
    signedIn = localStorage.getItem("firebaseUser");
    if ($SessionID == "None") {
      getSessionID().then((reponse) => {
        if (reponse != null) {
          $SessionID = reponse;
        }
        acceptTermsOfUse($SessionID);
      });
    }
  });

  let search = "";
  let numToDisplay = 5;
  $: recommended = getReccomended(search, numToDisplay);

  function getReccomended(search, num) {
    let list = [];
    if (search == "") {
      return list;
    }
    symptomsJSON.forEach((item) => {
      if (item.text.toLowerCase().includes(search.toLowerCase())) {
        list.push(item.text);
      }
    });
    return list.slice(0, num);
  }

  function handleSelected(event) {
    search = event.detail.item;
  }

  async function handleSearch() {
    let selected = {};
    symptomsJSON.forEach((item) => {
      if (item.text == search) {
        selected = item;
      }
    });
    if (selected.text == undefined) {
      search = "Could not find item!";
      return false;
    }
    if ($symptoms != "None") {
      let found = false;
      JSON.parse($symptoms).forEach((item) => {
        if (item.text == search) {
          found = true;
        }
      });
      if (found) {
        search = "You have already added this symptom!";
        return false;
      }
    }
    search = "";
    selected.user = selected.default;
    await updateFeature($SessionID, selected.name, selected.user);
    if ($symptoms != "None") {
      let temp = JSON.parse($symptoms);
      temp.push(selected);
      $symptoms = JSON.stringify(temp);
    } else {
      $symptoms = JSON.stringify([selected]);
    }
    if ($APIsymptoms != "None") {
      let temp = JSON.parse($APIsymptoms);
      temp.push({ text: selected.text, value: selected.user });
      $APIsymptoms = JSON.stringify(temp);
    } else {
      $APIsymptoms = JSON.stringify([
        { name: selected.name, value: selected.user },
      ]);
    }
    handleGetResults();
  }

  function handleUpdateLocalSymptoms(event) {
    let temp = JSON.parse($symptoms);
    temp.forEach((item) => {
      if (item.text == event.detail.text) {
        item.user = event.detail.newVal;
      }
    });
    $symptoms = JSON.stringify(temp);
    $changes = "True";
  }

  function handleDeleteSymptom(event) {
    let temp = JSON.parse($symptoms);
    temp.forEach((item, index, object) => {
      if (item.text == event.detail.text) {
        object.splice(index, 1);
      }
    });
    if (temp.length > 0) {
      $symptoms = JSON.stringify(temp);
    } else {
      $symptoms = "None";
    }
    $changes = "True";
  }

  function handleReset() {
    let temp1 = [];
    let temp2 = JSON.parse($APIsymptoms);
    $changes = "False";
    temp2.forEach((item) => {
      try {
        symptomsJSON.forEach((item1) => {
          if (item.name == item1.name) {
            let temp = item1;
            temp.user = item.value;
            temp1.push(temp);
            throw BreakException;
          }
        });
      } catch (e) {}
    });
    $symptoms = JSON.stringify(temp1);
  }

  function handleGetResults() {
    let results = {};
    getResults($SessionID).then((reponse) => {
      if (reponse != null) {
        results = reponse;
        delete results.status;
        delete results.VariableImportances;
        let accResults = [];
        results.Diseases.forEach((item) => {
          let result = {};
          result.text = Object.keys(item)[0];
          result.chance = item[Object.keys(item)[0]];
          try {
            diseasesJSON.forEach((item1) => {
              if (item1.text == result.text) {
                result.name = item1.name;
                result.isRare = item1.IsRare;
                result.isGender = item1.IsGenderSpecific;
                result.lifeThreatening = item1.IsImmLifeThreatening;
                result.cantMiss = item1.IsCantMiss;
                throw BreakException;
              }
            });
          } catch (e) {}
          accResults.push(result);
        });
        if (accResults.length > 0) {
          $saveResults = JSON.stringify(accResults);
        } else {
          $saveResults = "None";
        }
      }
    });
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function handleUpdate() {
    let newAPISymptoms = [];
    let oldAPISymptoms = JSON.parse($APIsymptoms);
    await oldAPISymptoms.forEach(async (item) => {
      await deleteFeature($SessionID, item.name);
      sleep(1000);
    });
    sleep(1000).then(async () => {
      if ($symptoms == "None") {
        $APIsymptoms = "None";
        $changes = "False";
        $saveResults = "None";
        return null;
      }
      await JSON.parse($symptoms).forEach(async (item) => {
        await updateFeature($SessionID, item.name, item.user);
        newAPISymptoms.push({ name: item.name, value: item.user });
        sleep(1000);
      });
      sleep(1000).then(async () => {
        if (newAPISymptoms.length > 0) {
          $APIsymptoms = JSON.stringify(newAPISymptoms);
        } else {
          $APIsymptoms = "None";
        }
        $changes = "False";
        handleGetResults();
      });
    });
  }
</script>

<div class="search-container">
  {#if signedIn}
    <UserNavbar on:logout={() => {signedIn = false;}}/>
  {:else}
    <Navbar />
  {/if}
  <div class="search-header-container">
    <img
      src={DiagnosisHeroImage}
      alt="Image"
      style="float: right; margin-right: 0%;"
    />
    <br /> <br /><br /> <br /><br /> <br /><br /> <br />
    <span class="search-header"> Get Diagnosed Right Now! </span>
    <br /> <br />
    <span class="search-subheader">
      Enter your symptoms in the search bar below and get possible diagnoses <br
      /> within seconds, without even leaving the comfort of your home!
    </span>
    <br /> <br /> <br /> <br /> <br />
    <div class="features">
      <button
        ><span class="features-number">800+</span>
        <span>Possible Symptom Options</span></button
      >
      <button
        ><span class="features-number">180+</span>
        <span>Possible Diseases</span></button
      >
    </div>
    <br /> <br /><br /> <br />
  </div>
  <br /><br /><br /><br />
  <span class="searchbar-title">Search for symptoms here:</span><br /><br />
  <div class="searchbar">
    <span style="display: flex; justify-content: center; width: 85px;">
      <img
        style="margin: auto;"
        width="30"
        height="30"
        src="https://img.icons8.com/ios-filled/50/1A1A1A/search--v1.png"
        alt="search--v1"
      />
    </span>
    <input
      type="text"
      bind:value={search}
      placeholder="Enter Symptoms Here..."
    />
    <button
      class="search-button"
      style="display: flex; justify-content: center;"
      on:click={handleSearch}
    >
      <img
        style="margin: auto;"
        width="25"
        height="25"
        src="https://img.icons8.com/ios-filled/50/FFFFFF/search--v1.png"
        alt="search--v1"
      />
    </button>
    <div style="flex-basis: 100%; height: 0;"></div>
    <div class="search-recommendations">
      {#if recommended.length > 0}
        <br />
        <span>Related Searches</span>
        <br />
        <hr
          style="width: 500px; padding:2px; background-color:#16423C; margin-left: 20px; border-radius: 10px;"
        />
        {#each recommended as item}
          <ReccomendationItem text={item} on:clicked={handleSelected} />
        {/each}
        {#if recommended.length >= 5}
          <button
            on:click={() => {
              if (numToDisplay == 1000) {
                numToDisplay = 5;
              } else {
                numToDisplay = 1000;
              }
            }}
          >
            View
            {#if numToDisplay == 1000}
              Less
            {:else}
              More
            {/if}
            ...
          </button>
        {/if}
      {/if}
    </div>
  </div>
  <br /><br /><br /><br />
  <div class="symptoms">
    <span class="symptoms-title">Your Symptoms:</span><br /><br /><br />
    <div style="display: flex; flex-wrap: wrap;">
      {#if $symptoms != "None"}
        {#each JSON.parse($symptoms) as item}
          {#if item.type == "integer"}
            <span style="margin-right: 10px; margin-bottom: 10px;"
              ><SymptomCardInteger
                info={item}
                bind:rawValue={item.user}
                on:change={handleUpdateLocalSymptoms}
                on:deleted={handleDeleteSymptom}
              /></span
            >
          {/if}
          {#if item.type == "double"}
            <span style="margin-right: 10px; margin-bottom: 10px;"
              ><SymptomCardDouble
                info={item}
                bind:rawValue={item.user}
                on:change={handleUpdateLocalSymptoms}
                on:deleted={handleDeleteSymptom}
              /></span
            >
          {/if}
          {#if item.type == "categorical"}
            <span style="margin-right: 10px; margin-bottom: 10px;"
              ><SymptomCardOptions
                info={item}
                bind:rawValue={item.user}
                on:change={handleUpdateLocalSymptoms}
                on:deleted={handleDeleteSymptom}
              /></span
            >
          {/if}
        {/each}
      {:else}
        <span
          style="font-family: inherit; font-size: larger; font-weight: 600; color: #16423C;"
          >You have no symptoms added yet.</span
        ><br /><br />
      {/if}
    </div>
    <br /><button class="update-button" on:click={handleUpdate}>Update</button>
    {#if $changes == "True"}
      <button class="reset-button" on:click={handleReset}>Reset</button>
      <span
        style="font-family: inherit; font-size: larger; font-weight: 600; color: #A04747; margin-left: 20px;"
        >You have some changes which are not showing in Results. Click Update to
        view updated results.</span
      >
    {:else}
      <button class="reset-button" on:click={handleReset} disabled>Reset</button
      >
    {/if}
  </div>
  <br />
  <div class="results">
    <br /><br /><span class="symptoms-title">Results:</span><br /><br />
    {#if $saveResults == "None"}
      {#if $symptoms == "None"}
        <span
          style="font-family: inherit; font-size: larger; font-weight: 600; color: #16423C;"
          >You have no symptoms added yet.</span
        >
      {:else}
        <span
          style="font-family: inherit; font-size: larger; font-weight: 600; color: #16423C;"
          >Could not find any diseases that match with your symptoms. Try adding
          or removing symptoms to improve the quality of the search.</span
        >
      {/if}
    {:else}
      <table class="results-table">
        <tr class="table-title">
          <th style="width: 700px; border-radius: 10px 0px 0px 0px;"
            >Name of condition</th
          >
          <th style="width: 75px;">Rare</th>
          <th style="width: 75px;">Gender Specific</th>
          <th style="width: 75px;">Life Threatening</th>
          <th style="width: 75px;">Can't Miss</th>
          <th
            style="width: 50px; font-size: 30px; text-align: center; font-weight: 700; border-radius: 0px 10px 0px 0px;"
            >%</th
          >
        </tr>
        <tr>
          <td>
            <hr style="height: 5px; background-color:#16423C;" />
          </td>
          <td>
            <hr style="height: 5px; background-color:#16423C;" />
          </td>
          <td>
            <hr style="height: 5px; background-color:#16423C;" />
          </td>
          <td>
            <hr style="height: 5px; background-color:#16423C;" />
          </td>
          <td>
            <hr style="height: 5px; background-color:#16423C;" />
          </td>
          <td>
            <hr style="height: 5px; background-color:#16423C;" />
          </td>
        </tr>
        {#each JSON.parse($saveResults) as result}
          <tr>
            <td class="data-td">
              {result.text}
            </td>
            <td class="data-td check-box">
              {#if result.isRare}
                <CheckBox />
              {:else}
                <CrossBox />
              {/if}
            </td>
            <td class="data-td check-box">
              {#if result.isGender}
                <CheckBox />
              {:else}
                <CrossBox />
              {/if}
            </td>
            <td class="data-td check-box">
              {#if result.lifeThreatening}
                <CheckBox />
              {:else}
                <CrossBox />
              {/if}
            </td>
            <td class="data-td check-box">
              {#if result.cantMiss}
                <CheckBox />
              {:else}
                <CrossBox />
              {/if}
            </td>
            <td class="data-td">
              {#if Math.round(result.chance * 100) == 0}
                &lt;0%
              {:else}
                {Math.round(result.chance * 100)}%
              {/if}
            </td>
          </tr>
        {/each}
      </table>
    {/if}
  </div>
  <br /><br /><br /><br /><br /><br />
  <Footer />
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=SUSE:wght@100..800&display=swap");

  .results-table {
    padding: 30px;
    border: 5px solid #16423c;
    border-radius: 30px;
    width: 1200px;
  }

  th {
    font-family: inherit;
    padding: 10px;
    text-align: left;
    vertical-align: bottom;
    font-weight: 500;
    color: white;
  }

  .table-title {
    background-color: #6a9c89;
  }

  .data-td {
    padding: 10px;
    background-color: #e9efec;
    color: #16423c;
    border-radius: 5px;
  }

  .check-box {
    text-align: center;
  }

  .results {
    width: 1200px;
    margin: auto;
    display: block;
  }

  .symptoms {
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
  }

  .searchbar-title {
    font-size: 40px;
    font-weight: 600;
    color: #6a9c89;
    width: 1200px;
    margin: auto;
    display: block;
  }

  .update-button {
    border-radius: 10px;
    padding: 15px;
    background-color: #16423c;
    color: white;
    font-family: "SUSE", sans-serif;
    font-size: larger;
    border: none;
  }

  .update-button:hover {
    cursor: pointer;
    background-color: #6a9c89;
  }

  .reset-button {
    border-radius: 10px;
    padding: 15px;
    background-color: #61677a;
    color: white;
    font-family: "SUSE", sans-serif;
    font-size: larger;
    border: none;
    margin-left: 20px;
  }

  .reset-button:hover {
    cursor: pointer;
    background-color: #61677a9d;
  }

  .search-container {
    font-family: "SUSE", sans-serif;
    height: 100vh;
  }

  .searchbar {
    border-radius: 10px;
    width: 1200px;
    background-color: #e9efec;
    display: flex;
    color: black;
    height: 70px;
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
    width: 1030px;
  }

  .search-button {
    border-radius: 10px;
    width: 80px;
    background-color: #16423c;
    color: white;
    font-family: "SUSE", sans-serif;
    font-size: larger;
    border: none;
  }

  .search-button:hover {
    cursor: pointer;
    background-color: #6a9c89;
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

  .search-recommendations {
    background-color: #e9efec;
    border-radius: 10px;
    width: 1200px;
    z-index: 2;
  }

  .search-recommendations span {
    font-size: 30px;
    font-weight: 600;
    color: #16423c;
    padding: 20px;
  }

  .search-recommendations button {
    border: none;
    padding: 10px;
    padding-left: 20px;
    padding-bottom: 20px;
    color: #16423c;
    background-color: inherit;
  }

  .search-recommendations button:hover {
    cursor: pointer;
  }
</style>
