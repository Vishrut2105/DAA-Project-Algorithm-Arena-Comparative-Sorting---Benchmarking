// Algorithm Race (Side-by-Side Execution)
// Concurrently runs Quick Sort, Merge Sort, Heap Sort, and Bubble Sort on identical data.

let baseRaceArray = [];
let raceSize = 35;
let isRacing = false;
let raceInterval = null;
let finishRank = 0;
let raceResults = [];

// DOM Elements
const raceSizeSlider = document.getElementById("race-size");
const raceSizeVal = document.getElementById("race-size-val");
const btnRaceGenerate = document.getElementById("btn-race-generate");
const btnRaceStart = document.getElementById("btn-race-start");
const btnRaceReset = document.getElementById("btn-race-reset");
const raceResultsPanel = document.getElementById("race-results-panel");
const raceResultsTbody = document.getElementById("race-results-tbody");

const lanes = ["quick", "merge", "heap", "bubble"];
const laneNames = {
  quick: "Quick Sort",
  merge: "Merge Sort",
  heap: "Heap Sort",
  bubble: "Bubble Sort"
};

function formatTime(ms) {
  const sec = (ms / 1000).toFixed(2);
  return `${ms} ms (${sec} s)`;
}

// Generate race array with evenly spaced distinct values and shuffle it
// This ensures that when sorted, each lane forms a perfect increasing triangle
function generateRaceArray() {
  if (isRacing) return;
  baseRaceArray = [];
  const minVal = 10;
  const maxVal = 95;
  const step = (maxVal - minVal) / (raceSize - 1);

  for (let i = 0; i < raceSize; i++) {
    baseRaceArray.push(Math.round(minVal + i * step));
  }

  // Fisher-Yates shuffle
  for (let i = baseRaceArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    let temp = baseRaceArray[i];
    baseRaceArray[i] = baseRaceArray[j];
    baseRaceArray[j] = temp;
  }

  resetRaceStats();
  renderAllLanes();
}

function resetRaceStats() {
  clearInterval(raceInterval);
  isRacing = false;
  finishRank = 0;
  raceResults = [];
  if (raceResultsPanel) raceResultsPanel.style.display = "none";

  lanes.forEach((lane) => {
    document.getElementById(`status-${lane}`).textContent = "Ready";
    document.getElementById(`status-${lane}`).className = "lane-status";
    document.getElementById(`comp-${lane}`).textContent = "0";
    document.getElementById(`swaps-${lane}`).textContent = "0";
    document.getElementById(`time-${lane}`).textContent = "0 ms (0.00 s)";
  });
}

function renderAllLanes() {
  lanes.forEach((lane) => {
    const container = document.getElementById(`race-bars-${lane}`);
    if (!container) return;
    container.innerHTML = "";

    baseRaceArray.forEach((val, idx) => {
      const bar = document.createElement("div");
      bar.className = "race-bar";
      bar.id = `race-bar-${lane}-${idx}`;
      bar.style.height = val + "%";
      container.appendChild(bar);
    });
  });
}

function updateLaneBar(lane, idx, val, state = "") {
  const bar = document.getElementById(`race-bar-${lane}-${idx}`);
  if (!bar) return;
  bar.style.height = val + "%";
  bar.className = "race-bar" + (state ? " " + state : "");
}

function clearLaneBar(lane, idx) {
  const bar = document.getElementById(`race-bar-${lane}-${idx}`);
  if (bar && !bar.classList.contains("sorted")) {
    bar.className = "race-bar";
  }
}

// Generate recorded animation steps for each algorithm
function recordBubbleSteps(arr) {
  const steps = [];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ type: "comp", i: j, j: j + 1 });
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        steps.push({ type: "swap", i: j, j: j + 1, valI: arr[j], valJ: arr[j + 1] });
      }
    }
  }
  return steps;
}

function recordQuickSteps(arr) {
  const steps = [];

  function partition(low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({ type: "comp", i: j, j: high });
      if (arr[j] < pivot) {
        i++;
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        steps.push({ type: "swap", i: i, j: j, valI: arr[i], valJ: arr[j] });
      }
    }
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    steps.push({ type: "swap", i: i + 1, j: high, valI: arr[i + 1], valJ: arr[high] });
    return i + 1;
  }

  function sort(low, high) {
    if (low < high) {
      let pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  sort(0, arr.length - 1);
  return steps;
}

function recordMergeSteps(arr) {
  const steps = [];

  function merge(low, mid, high) {
    const left = arr.slice(low, mid + 1);
    const right = arr.slice(mid + 1, high + 1);
    let i = 0, j = 0, k = low;

    while (i < left.length && j < right.length) {
      steps.push({ type: "comp", i: low + i, j: mid + 1 + j });
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        steps.push({ type: "write", i: k, val: left[i] });
        i++;
      } else {
        arr[k] = right[j];
        steps.push({ type: "write", i: k, val: right[j] });
        j++;
      }
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({ type: "write", i: k, val: left[i] });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({ type: "write", i: k, val: right[j] });
      j++;
      k++;
    }
  }

  function sort(low, high) {
    if (low < high) {
      let mid = Math.floor((low + high) / 2);
      sort(low, mid);
      sort(mid + 1, high);
      merge(low, mid, high);
    }
  }

  sort(0, arr.length - 1);
  return steps;
}

function recordHeapSteps(arr) {
  const steps = [];

  function heapify(n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n) {
      steps.push({ type: "comp", i: l, j: largest });
      if (arr[l] > arr[largest]) largest = l;
    }
    if (r < n) {
      steps.push({ type: "comp", i: r, j: largest });
      if (arr[r] > arr[largest]) largest = r;
    }
    if (largest !== i) {
      let temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      steps.push({ type: "swap", i: i, j: largest, valI: arr[i], valJ: arr[largest] });
      heapify(n, largest);
    }
  }

  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    heapify(arr.length, i);
  }
  for (let i = arr.length - 1; i > 0; i--) {
    let temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    steps.push({ type: "swap", i: 0, j: i, valI: arr[0], valJ: arr[i] });
    heapify(i, 0);
  }

  return steps;
}

// Start Concurrent Race
function startRace() {
  if (isRacing) return;
  isRacing = true;
  finishRank = 0;
  raceResults = [];

  btnRaceStart.disabled = true;
  btnRaceGenerate.disabled = true;
  raceSizeSlider.disabled = true;
  btnRaceReset.disabled = false;

  const engines = {
    quick: { steps: recordQuickSteps([...baseRaceArray]), idx: 0, comps: 0, swaps: 0, done: false, startTime: performance.now(), finishTime: 0 },
    merge: { steps: recordMergeSteps([...baseRaceArray]), idx: 0, comps: 0, swaps: 0, done: false, startTime: performance.now(), finishTime: 0 },
    heap: { steps: recordHeapSteps([...baseRaceArray]), idx: 0, comps: 0, swaps: 0, done: false, startTime: performance.now(), finishTime: 0 },
    bubble: { steps: recordBubbleSteps([...baseRaceArray]), idx: 0, comps: 0, swaps: 0, done: false, startTime: performance.now(), finishTime: 0 }
  };

  lanes.forEach((lane) => {
    const status = document.getElementById(`status-${lane}`);
    status.textContent = "Running...";
    status.className = "lane-status running";
  });

  const startTime = performance.now();

  raceInterval = setInterval(() => {
    let allFinished = true;
    const now = performance.now();

    lanes.forEach((lane) => {
      const eng = engines[lane];
      if (eng.done) return;

      allFinished = false;

      // Advance by 1 step per tick
      if (eng.idx < eng.steps.length) {
        const step = eng.steps[eng.idx++];

        if (step.type === "comp") {
          eng.comps++;
          document.getElementById(`comp-${lane}`).textContent = eng.comps;
          const bar1 = document.getElementById(`race-bar-${lane}-${step.i}`);
          const bar2 = document.getElementById(`race-bar-${lane}-${step.j}`);
          if (bar1) bar1.className = "race-bar comparing";
          if (bar2) bar2.className = "race-bar comparing";
        } else if (step.type === "swap") {
          eng.swaps++;
          document.getElementById(`swaps-${lane}`).textContent = eng.swaps;
          updateLaneBar(lane, step.i, step.valI, "swapping");
          updateLaneBar(lane, step.j, step.valJ, "swapping");
        } else if (step.type === "write") {
          eng.swaps++;
          document.getElementById(`swaps-${lane}`).textContent = eng.swaps;
          updateLaneBar(lane, step.i, step.val, "swapping");
        }

        const elapsed = Math.floor(now - eng.startTime);
        document.getElementById(`time-${lane}`).textContent = formatTime(elapsed);
      } else {
        // Algorithm Finished
        eng.done = true;
        eng.finishTime = Math.floor(now - eng.startTime);
        finishRank++;

        const status = document.getElementById(`status-${lane}`);
        status.textContent = `Finished (Rank #${finishRank})`;
        status.className = "lane-status finished";
        document.getElementById(`time-${lane}`).textContent = formatTime(eng.finishTime);

        // Paint bars green (sorted)
        const bars = document.querySelectorAll(`#race-bars-${lane} .race-bar`);
        bars.forEach((b) => (b.className = "race-bar sorted"));

        raceResults.push({
          rank: finishRank,
          name: laneNames[lane],
          time: formatTime(eng.finishTime),
          comps: eng.comps,
          swaps: eng.swaps
        });
      }
    });

    if (allFinished) {
      clearInterval(raceInterval);
      isRacing = false;
      btnRaceStart.disabled = false;
      btnRaceGenerate.disabled = false;
      raceSizeSlider.disabled = false;

      displayRaceStandings();
    }
  }, 18);
}

function displayRaceStandings() {
  if (!raceResultsPanel || !raceResultsTbody) return;
  raceResultsTbody.innerHTML = "";

  raceResults.sort((a, b) => a.rank - b.rank);
  raceResults.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${r.rank}</strong></td>
      <td><strong>${r.name}</strong></td>
      <td>${r.time}</td>
      <td>${r.comps}</td>
      <td>${r.swaps}</td>
    `;
    raceResultsTbody.appendChild(tr);
  });

  raceResultsPanel.style.display = "block";
}

// Event Listeners
if (raceSizeSlider) {
  raceSizeSlider.addEventListener("input", function (e) {
    raceSize = parseInt(e.target.value);
    raceSizeVal.textContent = raceSize;
    generateRaceArray();
  });
}

if (btnRaceGenerate) btnRaceGenerate.addEventListener("click", generateRaceArray);
if (btnRaceStart) btnRaceStart.addEventListener("click", startRace);
if (btnRaceReset) btnRaceReset.addEventListener("click", resetRaceStats);

// Initial Load
generateRaceArray();
