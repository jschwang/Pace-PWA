"use strict";

const inputDate = document.querySelector("#date");
const inputMeters = document.querySelector("#meters");
const inputHours = document.querySelector("#hour");
const inputMinutes = document.querySelector("#minute");
const inputSeconds = document.querySelector("#second");
const runsContainer = document.querySelector(".container-center-display");

const form = document.querySelector(".form-pace");

let runID = 1;

//Variables for touch events
let touchedRun;
let startX;
let currX;
let diffX = 0;

function calcPace(meters, h, m, s) {
  const distanceInKm = (meters / 1000).toFixed(2);

  //convert input to seconds
  let secondsSum = 0;
  console.log(h, m, s);

  secondsSum += h * 3600;
  secondsSum += m * 60;
  secondsSum += s;

  //calcuate how much secs for 1km
  const paceSecsSum = secondsSum / distanceInKm;

  //calc mins and secs for pace
  let paceMin = Math.floor(paceSecsSum / 60);
  const paceSecs = Math.floor(paceSecsSum % 60);

  //if more than 60min, then add hour
  if (paceMin > 60) {
    const paceHour = Math.floor(paceMin / 60);
    paceMin = paceHour % 60;
    const pace = `${paceHour}h:${paceMin}m:${paceSecs}s`;
    return pace;
  }

  const pace = `${paceMin}m:${paceSecs}s`;
  return pace;
}

function displayNewRun(i, d, m, p) {
  const html =
    /*html*/
    `
  <div class="swipe-container">
    <div class="render-pace-container">
      <div class="pace-container">
        <p class="render-id">${i}</p>
        <p class="seperator">|</p>
      </div>
      <div class="pace-container">
        <p>Datum:</p>
        <p class="render-date">${d}</p>
      </div>
      <p class="seperator">|</p>
      <div class="pace-container">
        <p>Gelaufene Distanz:</p>
        <p class="render-meter">${m.toLocaleString("de-de")}m</p>
      </div>
      <p class="seperator">|</p>
      <div class="pace-container">
        <p>Pace:</p>
        <p class="render-pace">${p}</p>
      </div>
      <div class="pace-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="delete-item"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </div>
    </div>
  </div>`;

  runsContainer.insertAdjacentHTML("beforeend", html);
}

function addToLocalStorage(d, m, p) {
  //creates new array or loads runs
  const runs = JSON.parse(localStorage.getItem("runs")) || [];

  const run = {
    id: runID,
    date: d,
    meters: m,
    pace: p,
  };

  //adds new run
  runs.push(run);

  localStorage.setItem("runs", JSON.stringify(runs));
}

function createNewElement(e) {
  e.preventDefault();

  const rawDate = inputDate.value;
  const [y, m, d] = rawDate.split("-");
  const date = `${d}.${m}.${y}`;

  const meters = Number(inputMeters.value);
  const hours = Number(inputHours.value);
  const minutes = Number(inputMinutes.value);
  const seconds = Number(inputSeconds.value);

  const pace = calcPace(meters, hours, minutes, seconds);

  addToLocalStorage(date, meters, pace);

  displayNewRun(runID, date, meters, pace);

  runID++;

  console.log(pace);

  inputDate.value = "";
  inputMeters.value = "";
  inputHours.value = "";
  inputMinutes.value = "";
  inputSeconds.value = "";
}

function deleteRun(itemID) {
  // if fully swiped, find element and delete

  const runs = JSON.parse(localStorage.getItem("runs"));
  const id = itemID;

  //delete item from alocalStorage & Frontend
  runs.splice(id - 1, 1);
  //new Id for all elements
  let newId = 1;
  for (const run of runs) {
    run.id = newId;
    newId++;
  }
  runID = newId;
  //run container löschen und neu rendern.

  localStorage.setItem("runs", JSON.stringify(runs));
  runsContainer.innerHTML = "";
  createElementsFromLocalStorage();
}

function createElementsFromLocalStorage() {
  //loads data from localStorage
  const storageRuns = JSON.parse(localStorage.getItem("runs"));
  if (!storageRuns) return;
  runID = storageRuns.length + 1;

  for (const run of storageRuns) {
    const i = run.id;
    const d = run.date;
    const m = run.meters;
    const p = run.pace;

    const html =
      /*html*/
      `
    <div class="swipe-container">
      <div class="render-pace-container">
        <div class="pace-container">
          <p class="render-id">${i}</p>
          <p class="seperator">|</p>
        </div>
        <div class="pace-container">
          <p>Datum:</p>
          <p class="render-date">${d}</p>
        </div>
        <p class="seperator">|</p>
        <div class="pace-container">
          <p>Gelaufene Distanz:</p>
          <p class="render-meter">${m.toLocaleString("de-de")}m</p>
        </div>
        <p class="seperator">|</p>
        <div class="pace-container">
          <p>Pace:</p>
          <p class="render-pace">${p}</p>
        </div>
        <div class="pace-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="delete-item"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </div>
      </div>
    </div>`;

    runsContainer.insertAdjacentHTML("beforeend", html);
  }
}

createElementsFromLocalStorage();

form.addEventListener("submit", createNewElement);

/***********************/
/*SWIPE FUNCTION */
/***********************/

runsContainer.addEventListener("touchstart", (e) => {
  touchedRun = e.target.closest(".render-pace-container");
  if (!touchedRun) return;
  touchedRun.classList.remove("snap-back");

  diffX = 0;
  startX = e.touches[0].clientX;
  console.log(startX);
});

runsContainer.addEventListener("touchmove", (e) => {
  if (!touchedRun) return;
  currX = e.changedTouches[0].clientX;

  diffX = currX - startX;
  console.log(diffX);

  // swipe to right isnt possible
  if (diffX >= 0) return;

  //max swipe in left direction
  if (diffX <= -125) {
    return;
  }

  touchedRun.style.transform = `translateX(${diffX}px)`;
});

runsContainer.addEventListener("touchend", (e) => {
  if (!touchedRun) return;
  //reset position if not fully swiped
  if (diffX >= -125) {
    // activate animation
    touchedRun.classList.add("snap-back");
    touchedRun.style.transform = `translateX(0px)`;
    return;
  }

  const id = parseInt(touchedRun.querySelector(".render-id").textContent);

  deleteRun(id);
});

/***********************/
/*DELETE BUTTON */
/***********************/

runsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".delete-item");
  if (!btn) return;

  const item = btn.closest(".render-pace-container");
  if (!item) return;

  const id = Number(item.querySelector(".render-id").textContent);

  deleteRun(id);
});
