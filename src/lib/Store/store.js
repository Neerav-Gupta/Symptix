import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const SessionID = writable(
    browser && (localStorage.getItem("SessionID") || "None")
);

SessionID.subscribe((val) => browser && (localStorage.SessionID = val));

export const symptoms = writable(
    browser && (localStorage.getItem("symptoms") || "None")
);

symptoms.subscribe((val) => browser && (localStorage.symptoms = val));

export const APIsymptoms = writable(
    browser && (localStorage.getItem("APIsymptoms") || "None")
);

APIsymptoms.subscribe((val) => browser && (localStorage.APIsymptoms = val));

export const changes = writable(
    browser && (localStorage.getItem("changes") || "False")
);

changes.subscribe((val) => browser && (localStorage.changes = val));

export const saveResults = writable(
    browser && (localStorage.getItem("results") || "None")
);

saveResults.subscribe((val) => browser && (localStorage.results = val));