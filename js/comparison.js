// Algorithm Comparison Benchmark (Synchronous Execution without delay)
// Compares Bubble, Selection, Insertion, Merge, Quick, and Heap Sort on the same random array.

const compSizeSlider = document.getElementById("comp-size");
const compSizeVal = document.getElementById("comp-size-val");
const btnRunComparison = document.getElementById("btn-run-comparison");
const comparisonTbody = document.getElementById("comparison-tbody");

if (compSizeSlider) {
  compSizeSlider.addEventListener("input", function (e) {
    compSizeVal.textContent = e.target.value;
  });
}

if (btnRunComparison) {
  btnRunComparison.addEventListener("click", function () {
    const n = parseInt(compSizeSlider.value);
    runBenchmark(n);
  });
}

function runBenchmark(n) {
  // Generate random base array with distinct values 1 to n
  const baseArray = [];
  for (let i = 1; i <= n; i++) {
    baseArray.push(i);
  }
  for (let i = baseArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    let temp = baseArray[i];
    baseArray[i] = baseArray[j];
    baseArray[j] = temp;
  }

  function formatTime(ms) {
    const sec = (ms / 1000).toFixed(4);
    return `${ms.toFixed(2)} ms (${sec} s)`;
  }

  const results = [];

  // 1. Bubble Sort
  {
    const arr = [...baseArray];
    let comps = 0, swaps = 0;
    const t0 = performance.now();
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        comps++;
        if (arr[j] > arr[j + 1]) {
          swaps++;
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    const t1 = performance.now();
    results.push({
      name: "Bubble Sort",
      paradigm: "Brute Force",
      comps: comps,
      swaps: swaps,
      time: formatTime(t1 - t0),
      complexity: "O(n²)"
    });
  }

  // 2. Selection Sort
  {
    const arr = [...baseArray];
    let comps = 0, swaps = 0;
    const t0 = performance.now();
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        comps++;
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        swaps++;
        let temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
      }
    }
    const t1 = performance.now();
    results.push({
      name: "Selection Sort",
      paradigm: "Iterative",
      comps: comps,
      swaps: swaps,
      time: formatTime(t1 - t0),
      complexity: "O(n²)"
    });
  }

  // 3. Insertion Sort
  {
    const arr = [...baseArray];
    let comps = 0, swaps = 0;
    const t0 = performance.now();
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0) {
        comps++;
        if (arr[j] > key) {
          swaps++;
          arr[j + 1] = arr[j];
          j--;
        } else {
          break;
        }
      }
      arr[j + 1] = key;
    }
    const t1 = performance.now();
    results.push({
      name: "Insertion Sort",
      paradigm: "Incremental",
      comps: comps,
      swaps: swaps,
      time: formatTime(t1 - t0),
      complexity: "O(n²)"
    });
  }

  // 4. Merge Sort
  {
    const arr = [...baseArray];
    let comps = 0, swaps = 0;

    function merge(low, mid, high) {
      const left = arr.slice(low, mid + 1);
      const right = arr.slice(mid + 1, high + 1);
      let i = 0, j = 0, k = low;

      while (i < left.length && j < right.length) {
        comps++;
        if (left[i] <= right[j]) {
          swaps++;
          arr[k++] = left[i++];
        } else {
          swaps++;
          arr[k++] = right[j++];
        }
      }
      while (i < left.length) {
        swaps++;
        arr[k++] = left[i++];
      }
      while (j < right.length) {
        swaps++;
        arr[k++] = right[j++];
      }
    }

    function sort(low, high) {
      if (low < high) {
        const mid = Math.floor((low + high) / 2);
        sort(low, mid);
        sort(mid + 1, high);
        merge(low, mid, high);
      }
    }

    const t0 = performance.now();
    sort(0, arr.length - 1);
    const t1 = performance.now();

    results.push({
      name: "Merge Sort",
      paradigm: "Divide and Conquer",
      comps: comps,
      swaps: swaps,
      time: formatTime(t1 - t0),
      complexity: "O(n log n)"
    });
  }

  // 5. Quick Sort
  {
    const arr = [...baseArray];
    let comps = 0, swaps = 0;

    function partition(low, high) {
      let pivot = arr[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        comps++;
        if (arr[j] < pivot) {
          i++;
          swaps++;
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
      swaps++;
      let temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      return i + 1;
    }

    function sort(low, high) {
      if (low < high) {
        let pi = partition(low, high);
        sort(low, pi - 1);
        sort(pi + 1, high);
      }
    }

    const t0 = performance.now();
    sort(0, arr.length - 1);
    const t1 = performance.now();

    results.push({
      name: "Quick Sort",
      paradigm: "Divide and Conquer",
      comps: comps,
      swaps: swaps,
      time: formatTime(t1 - t0),
      complexity: "O(n log n)"
    });
  }

  // 6. Heap Sort
  {
    const arr = [...baseArray];
    let comps = 0, swaps = 0;

    function heapify(n, i) {
      let largest = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;

      if (l < n) {
        comps++;
        if (arr[l] > arr[largest]) largest = l;
      }
      if (r < n) {
        comps++;
        if (arr[r] > arr[largest]) largest = r;
      }
      if (largest !== i) {
        swaps++;
        let temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(n, largest);
      }
    }

    const t0 = performance.now();
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      heapify(arr.length, i);
    }
    for (let i = arr.length - 1; i > 0; i--) {
      swaps++;
      let temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;
      heapify(i, 0);
    }
    const t1 = performance.now();

    results.push({
      name: "Heap Sort",
      paradigm: "Binary Heap",
      comps: comps,
      swaps: swaps,
      time: formatTime(t1 - t0),
      complexity: "O(n log n)"
    });
  }

  // Render Table
  comparisonTbody.innerHTML = "";
  results.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${r.name}</strong></td>
      <td>${r.paradigm}</td>
      <td>${r.comps}</td>
      <td>${r.swaps}</td>
      <td>${r.time}</td>
      <td><code>${r.complexity}</code></td>
    `;
    comparisonTbody.appendChild(tr);
  });
}
