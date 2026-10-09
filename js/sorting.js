// Simple Sorting Visualizer logic for DAA Semester 5 Project

let array = [];
let arraySize = 30;
let speed = 50;
let isSorting = false;
let stopRequested = false;

let comparisons = 0;
let swaps = 0;
let timer = null;
let startTime = 0;

// DOM Elements
const barsContainer = document.getElementById("bars-container");
const algoSelect = document.getElementById("algo-select");
const sizeSlider = document.getElementById("size-slider");
const speedSlider = document.getElementById("speed-slider");
const sizeVal = document.getElementById("size-val");
const speedVal = document.getElementById("speed-val");

const btnGenerate = document.getElementById("btn-generate");
const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");

const statComp = document.getElementById("stat-comp");
const statSwaps = document.getElementById("stat-swaps");
const statTime = document.getElementById("stat-time");
const algoInfo = document.getElementById("algo-info");

// Helper function to pause execution for visual animation
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Format milliseconds with seconds beside it: e.g. "1250 ms (1.25 s)"
function formatTime(ms) {
  const sec = (ms / 1000).toFixed(2);
  return `${ms} ms (${sec} s)`;
}

function getDelay() {
  // Smooth responsive mapping without lag:
  // speed 1 (Slow) -> ~120ms
  // speed 50 (Normal) -> ~20ms
  // speed 100 (Fast) -> 2ms
  return Math.max(2, Math.round(130 * Math.pow(1 - speed / 105, 2)));
}

// Generate array with evenly spaced distinct values and shuffle it
// This ensures that once sorted, the bars form a perfect increasing triangle / staircase without duplicate flat spots
function generateArray() {
  if (isSorting) return;
  array = [];
  const minVal = 8;
  const maxVal = 95;
  const step = (maxVal - minVal) / (arraySize - 1);

  for (let i = 0; i < arraySize; i++) {
    array.push(Math.round(minVal + i * step));
  }

  // Fisher-Yates Shuffle to randomize the elements
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  resetStats();
  renderBars();
}

function resetStats() {
  comparisons = 0;
  swaps = 0;
  statComp.textContent = "0";
  statSwaps.textContent = "0";
  statTime.textContent = "0 ms (0.00 s)";
  clearInterval(timer);
}

// Render array elements as simple vertical bars
function renderBars() {
  barsContainer.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.id = "bar-" + i;
    bar.style.height = array[i] + "%";

    // Show text values if array size is small enough
    if (arraySize <= 35) {
      const val = document.createElement("span");
      val.className = "bar-val";
      val.textContent = array[i];
      bar.appendChild(val);
    }
    barsContainer.appendChild(bar);
  }
}

function updateBar(idx, val, state = "") {
  const bar = document.getElementById("bar-" + idx);
  if (!bar) return;
  bar.style.height = val + "%";
  bar.className = "bar" + (state ? " " + state : "");

  const valSpan = bar.querySelector(".bar-val");
  if (valSpan) {
    valSpan.textContent = val;
  }
}

function setBarState(idx, state) {
  const bar = document.getElementById("bar-" + idx);
  if (bar) {
    bar.className = "bar " + state;
  }
}

function clearBarState(idx) {
  const bar = document.getElementById("bar-" + idx);
  if (bar) {
    bar.className = "bar";
  }
}

// Update the algorithm info badge
function updateAlgoInfo() {
  const algo = algoSelect.value;
  const infoMap = {
    bubble: "Selected: Bubble Sort | Time: O(n²) | Space: O(1) | Brute Force",
    selection: "Selected: Selection Sort | Time: O(n²) | Space: O(1) | Iterative",
    insertion: "Selected: Insertion Sort | Time: O(n²) | Space: O(1) | Incremental",
    merge: "Selected: Merge Sort | Time: O(n log n) | Space: O(n) | Divide and Conquer",
    quick: "Selected: Quick Sort | Time: O(n log n) avg, O(n²) worst | Space: O(log n) | Divide and Conquer",
    heap: "Selected: Heap Sort | Time: O(n log n) | Space: O(1) | Binary Heap"
  };
  algoInfo.textContent = infoMap[algo] || "";
}

// Event Listeners
sizeSlider.addEventListener("input", function (e) {
  arraySize = parseInt(e.target.value);
  sizeVal.textContent = arraySize;
  generateArray();
});

speedSlider.addEventListener("input", function (e) {
  speed = parseInt(e.target.value);
  let text = "Normal";
  if (speed < 30) text = "Slow";
  else if (speed > 70) text = "Fast";
  speedVal.textContent = text;
});

algoSelect.addEventListener("change", updateAlgoInfo);
btnGenerate.addEventListener("click", generateArray);

btnStart.addEventListener("click", async function () {
  if (isSorting) return;
  isSorting = true;
  stopRequested = false;

  btnStart.disabled = true;
  btnGenerate.disabled = true;
  sizeSlider.disabled = true;
  algoSelect.disabled = true;
  btnStop.disabled = false;

  resetStats();
  startTime = performance.now();
  timer = setInterval(() => {
    const elapsed = Math.floor(performance.now() - startTime);
    statTime.textContent = formatTime(elapsed);
  }, 40);

  const selectedAlgo = algoSelect.value;
  if (selectedAlgo === "bubble") {
    await bubbleSort();
  } else if (selectedAlgo === "selection") {
    await selectionSort();
  } else if (selectedAlgo === "insertion") {
    await insertionSort();
  } else if (selectedAlgo === "merge") {
    await mergeSort(0, array.length - 1);
  } else if (selectedAlgo === "quick") {
    await quickSort(0, array.length - 1);
  } else if (selectedAlgo === "heap") {
    await heapSort();
  }

  // Finalize
  clearInterval(timer);
  const totalTime = Math.floor(performance.now() - startTime);
  statTime.textContent = formatTime(totalTime);

  if (!stopRequested) {
    for (let i = 0; i < array.length; i++) {
      setBarState(i, "sorted");
    }
  }

  isSorting = false;
  btnStart.disabled = false;
  btnGenerate.disabled = false;
  sizeSlider.disabled = false;
  algoSelect.disabled = false;
  btnStop.disabled = true;
});

btnStop.addEventListener("click", function () {
  stopRequested = true;
  isSorting = false;
  clearInterval(timer);
  generateArray();
  btnStart.disabled = false;
  btnGenerate.disabled = false;
  sizeSlider.disabled = false;
  algoSelect.disabled = false;
  btnStop.disabled = true;
});

// ==========================================
// SORTING ALGORITHMS IMPLEMENTATION
// ==========================================

// 1. Bubble Sort
async function bubbleSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (stopRequested) return;

      comparisons++;
      statComp.textContent = comparisons;
      setBarState(j, "comparing");
      setBarState(j + 1, "comparing");
      await sleep(getDelay());

      if (array[j] > array[j + 1]) {
        // Swap
        swaps++;
        statSwaps.textContent = swaps;
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;

        updateBar(j, array[j], "swapping");
        updateBar(j + 1, array[j + 1], "swapping");
        await sleep(getDelay());
      }

      clearBarState(j);
      clearBarState(j + 1);
    }
    setBarState(n - i - 1, "sorted");
  }
}

// 2. Selection Sort
async function selectionSort() {
  const n = array.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    setBarState(minIdx, "swapping");

    for (let j = i + 1; j < n; j++) {
      if (stopRequested) return;

      comparisons++;
      statComp.textContent = comparisons;
      setBarState(j, "comparing");
      await sleep(getDelay());

      if (array[j] < array[minIdx]) {
        if (minIdx !== i) clearBarState(minIdx);
        minIdx = j;
        setBarState(minIdx, "swapping");
      } else {
        clearBarState(j);
      }
    }

    if (minIdx !== i) {
      swaps++;
      statSwaps.textContent = swaps;
      let temp = array[i];
      array[i] = array[minIdx];
      array[minIdx] = temp;

      updateBar(i, array[i], "swapping");
      updateBar(minIdx, array[minIdx], "swapping");
      await sleep(getDelay());
    }

    clearBarState(minIdx);
    setBarState(i, "sorted");
  }
}

// 3. Insertion Sort
async function insertionSort() {
  const n = array.length;
  setBarState(0, "sorted");

  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    setBarState(i, "swapping");
    await sleep(getDelay());

    while (j >= 0) {
      if (stopRequested) return;

      comparisons++;
      statComp.textContent = comparisons;
      setBarState(j, "comparing");
      await sleep(getDelay());

      if (array[j] > key) {
        swaps++;
        statSwaps.textContent = swaps;
        array[j + 1] = array[j];
        updateBar(j + 1, array[j + 1], "swapping");
        clearBarState(j);
        j--;
      } else {
        clearBarState(j);
        break;
      }
    }

    array[j + 1] = key;
    updateBar(j + 1, array[j + 1], "sorted");
    await sleep(getDelay());

    for (let k = 0; k <= i; k++) {
      setBarState(k, "sorted");
    }
  }
}

// 4. Merge Sort (Divide & Conquer)
async function mergeSort(low, high) {
  if (low >= high || stopRequested) return;
  const mid = Math.floor((low + high) / 2);
  await mergeSort(low, mid);
  await mergeSort(mid + 1, high);
  await merge(low, mid, high);
}

async function merge(low, mid, high) {
  const left = [];
  const right = [];

  for (let i = low; i <= mid; i++) left.push(array[i]);
  for (let j = mid + 1; j <= high; j++) right.push(array[j]);

  let i = 0, j = 0, k = low;

  while (i < left.length && j < right.length) {
    if (stopRequested) return;

    comparisons++;
    statComp.textContent = comparisons;
    setBarState(k, "comparing");
    await sleep(getDelay());

    if (left[i] <= right[j]) {
      swaps++;
      statSwaps.textContent = swaps;
      array[k] = left[i];
      updateBar(k, array[k], "swapping");
      i++;
    } else {
      swaps++;
      statSwaps.textContent = swaps;
      array[k] = right[j];
      updateBar(k, array[k], "swapping");
      j++;
    }
    await sleep(getDelay());
    clearBarState(k);
    k++;
  }

  while (i < left.length) {
    if (stopRequested) return;
    swaps++;
    statSwaps.textContent = swaps;
    array[k] = left[i];
    updateBar(k, array[k], "swapping");
    await sleep(getDelay());
    clearBarState(k);
    i++;
    k++;
  }

  while (j < right.length) {
    if (stopRequested) return;
    swaps++;
    statSwaps.textContent = swaps;
    array[k] = right[j];
    updateBar(k, array[k], "swapping");
    await sleep(getDelay());
    clearBarState(k);
    j++;
    k++;
  }
}

// 5. Quick Sort (Divide & Conquer)
async function quickSort(low, high) {
  if (low < high && !stopRequested) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  setBarState(high, "swapping");
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (stopRequested) return;

    comparisons++;
    statComp.textContent = comparisons;
    setBarState(j, "comparing");
    await sleep(getDelay());

    if (array[j] < pivot) {
      i++;
      swaps++;
      statSwaps.textContent = swaps;
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;

      updateBar(i, array[i], "swapping");
      updateBar(j, array[j], "swapping");
      await sleep(getDelay());
      clearBarState(i);
    }
    clearBarState(j);
  }

  swaps++;
  statSwaps.textContent = swaps;
  let temp = array[i + 1];
  array[i + 1] = array[high];
  array[high] = temp;

  updateBar(i + 1, array[i + 1], "sorted");
  updateBar(high, array[high]);
  await sleep(getDelay());

  return i + 1;
}

// 6. Heap Sort (Binary Heap)
async function heapSort() {
  const n = array.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (stopRequested) return;
    await heapify(n, i);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    if (stopRequested) return;

    swaps++;
    statSwaps.textContent = swaps;
    let temp = array[0];
    array[0] = array[i];
    array[i] = temp;

    updateBar(0, array[0], "swapping");
    updateBar(i, array[i], "sorted");
    await sleep(getDelay());

    await heapify(i, 0);
  }
  setBarState(0, "sorted");
}

async function heapify(n, i) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < n) {
    comparisons++;
    statComp.textContent = comparisons;
    if (array[left] > array[largest]) {
      largest = left;
    }
  }

  if (right < n) {
    comparisons++;
    statComp.textContent = comparisons;
    if (array[right] > array[largest]) {
      largest = right;
    }
  }

  if (largest !== i) {
    swaps++;
    statSwaps.textContent = swaps;
    let temp = array[i];
    array[i] = array[largest];
    array[largest] = temp;

    updateBar(i, array[i], "swapping");
    updateBar(largest, array[largest], "swapping");
    await sleep(getDelay());
    clearBarState(i);
    clearBarState(largest);

    await heapify(n, largest);
  }
}

// Initial Run
updateAlgoInfo();
generateArray();
