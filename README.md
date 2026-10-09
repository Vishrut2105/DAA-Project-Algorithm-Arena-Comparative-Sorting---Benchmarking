# DAA Project: Algorithm Visualizer & Performance Analysis

A web-based algorithm visualization and empirical performance analysis tool developed for the **Design and Analysis of Algorithms (DAA)** course in **Semester 5, B.Tech Information Technology**.

- **Student Name:** Vishrut Sharma
- **Enrollment Number:** 12402080601153
- **Department / Division:** Information Technology (IT-B)
- **Semester:** V

This project provides step-by-step visual demonstrations and quantitative benchmarks of classical sorting and graph pathfinding algorithms using a pure, dependency-free technology stack.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Modules](#key-modules)
  - [1. Sorting Visualizer](#1-sorting-visualizer)
  - [2. Algorithm Race Track](#2-algorithm-race-track)
  - [3. Algorithm Comparison Benchmark](#3-algorithm-comparison-benchmark)
  - [4. Shortest Path Visualizer (Dijkstra)](#4-shortest-path-visualizer-dijkstra)
  - [5. Complexity Reference Table](#5-complexity-reference-table)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation and Execution](#installation-and-execution)
- [Algorithm Implementations and Theoretical Analysis](#algorithm-implementations-and-theoretical-analysis)
- [Viva and Academic Defense Guide](#viva-and-academic-defense-guide)

---

## Project Overview

The primary objective of this project is to bridge the gap between theoretical algorithm analysis (asymptotic Big-O notations, recurrence relations) and practical execution behavior. 

Key objectives:
- Visualize how elements are compared, swapped, and partitioned in real time.
- Verify theoretical time complexities empirically on identical datasets.
- Implement greedy graph traversal on an interactive grid to find single-source shortest paths.
- Maintain simple, readable, and clean code without external libraries or frameworks.

---

## Key Modules

### 1. Sorting Visualizer
- **Supported Algorithms:** Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort.
- **Uniform Triangle Distribution:** Elements are generated with strictly uniform step increments and shuffled using the Fisher-Yates algorithm. When sorting completes, the bars form a clean, perfectly linear increasing triangle without duplicate flat spots.
- **Dual Time Tracking:** Live timers report execution time in both milliseconds and seconds (e.g., `3420 ms (3.42 s)`).
- **Interactive Controls:** Adjustable array size (10 to 60 elements), dynamic animation speed slider, play, pause, and reset options.
- **Real-Time Counters:** Dynamic tracking of comparison count and swap/write operations.

### 2. Algorithm Race Track
- **Side-by-Side Execution:** Simultaneously runs Quick Sort, Merge Sort, Heap Sort, and Bubble Sort on the exact same randomized array.
- **Empirical Proof of Efficiency:** Visually demonstrates why $O(n \log n)$ divide-and-conquer and heap-based algorithms finish significantly faster than $O(n^2)$ quadratic algorithms.
- **Standings Table:** Automatically ranks each algorithm from 1st to 4th place upon completion, displaying total execution time, comparisons, and writes.

### 3. Algorithm Comparison Benchmark
- Runs all 6 comparison-based sorting algorithms sequentially on identical permutations of size $N$ without UI animation delays.
- Outputs an empirical comparison table detailing exact comparison counts, swap operations, and execution time measured via `performance.now()`.

### 4. Shortest Path Visualizer (Dijkstra)
- Implements Dijkstra's Algorithm on a 2D grid matrix.
- Interactive obstacle placement: click any grid cell to create or remove walls.
- Visual animation of explored nodes (visited set) followed by shortest path reconstruction from target to source using parent pointers.

### 5. Complexity Reference Table
- A centralized academic summary displaying the Best Case ($\Omega$), Average Case ($\Theta$), Worst Case ($O$), and Space Complexity for each algorithm in the syllabus.

---

## Technology Stack

- **Markup:** HTML5 (Semantic document layout, tabbed navigation)
- **Styling:** CSS3 (Light academic design, CSS Grid, Flexbox, responsive layouts)
- **Scripting:** Vanilla JavaScript (ES6+, Async/Await, Promise-based sleep timers)
- **Dependencies:** None (Zero external npm packages, frameworks, or CDN libraries required)

---

## Project Structure

```
d:/Personal/DAA project/
├── index.html        # Main HTML file containing all tab views and panels
├── styles.css        # Academic layout, grid rules, and bar animations
├── README.md         # Comprehensive project documentation
└── js/
    ├── sorting.js    # Visual sorting logic, step timers, and live counters
    ├── race.js       # 4-lane concurrent race engine and standings logger
    ├── comparison.js # Benchmark runner measuring operations on identical arrays
    ├── dijkstra.js   # 2D grid matrix and Dijkstra shortest path traversal
    └── main.js       # Tab navigation and UI state controller
```

---

## Installation and Execution

No build step, compiler, or package manager is needed.

### Method 1: Direct File Launch
Double-click `index.html` in your file explorer to open it in any modern browser (Google Chrome, Mozilla Firefox, Microsoft Edge).

### Method 2: Local HTTP Server
Run a simple HTTP server using Python:

```bash
# Navigate to the project directory
cd "d:/Personal/DAA project"

# Start Python HTTP server
python -m http.server 8080
```

Open your browser and navigate to:
```
http://localhost:8080
```

---

## Algorithm Implementations and Theoretical Analysis

### Summary Table

| Algorithm | Paradigm | Best Case | Average Case | Worst Case | Auxiliary Space | Stability |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Bubble Sort** | Brute Force | $\Omega(n)$ | $\Theta(n^2)$ | $O(n^2)$ | $O(1)$ | Stable |
| **Selection Sort** | Iterative | $\Omega(n^2)$ | $\Theta(n^2)$ | $O(n^2)$ | $O(1)$ | Unstable |
| **Insertion Sort** | Incremental | $\Omega(n)$ | $\Theta(n^2)$ | $O(n^2)$ | $O(1)$ | Stable |
| **Merge Sort** | Divide & Conquer | $\Omega(n \log n)$ | $\Theta(n \log n)$ | $O(n \log n)$ | $O(n)$ | Stable |
| **Quick Sort** | Divide & Conquer | $\Omega(n \log n)$ | $\Theta(n \log n)$ | $O(n^2)$ | $O(\log n)$ | Unstable |
| **Heap Sort** | Binary Heap | $\Omega(n \log n)$ | $\Theta(n \log n)$ | $O(n \log n)$ | $O(1)$ | Unstable |
| **Dijkstra** | Greedy | $O((V+E) \log V)$ | $O((V+E) \log V)$ | $O((V+E) \log V)$ | $O(V)$ | N/A |

---

### Detailed Algorithm Descriptions

#### 1. Bubble Sort
- **Mechanism:** Repeatedly passes through the array, comparing adjacent items and swapping them if out of order.
- **Analysis:** Performs $n(n - 1) / 2$ comparisons in the worst and average cases.

#### 2. Selection Sort
- **Mechanism:** Divides the array into sorted and unsorted segments. Repeatedly finds the minimum element in the unsorted segment and swaps it with the first unsorted element.
- **Analysis:** Always requires $n(n - 1) / 2$ comparisons regardless of initial array ordering.

#### 3. Insertion Sort
- **Mechanism:** Iteratively inserts each element into its proper position within a sorted sub-array by shifting larger elements one position to the right.
- **Analysis:** Achieves linear $\Omega(n)$ best-case time on nearly sorted arrays.

#### 4. Merge Sort
- **Mechanism:** Recursively splits the array into two halves until single-element arrays are reached, then merges the sorted halves using an auxiliary array.
- **Recurrence:** $T(n) = 2T(n/2) + \Theta(n) \implies \Theta(n \log n)$ by Master Theorem (Case 2).

#### 5. Quick Sort
- **Mechanism:** Selects a pivot element (Lomuto partition uses the rightmost element), partitions elements smaller than the pivot to the left and greater to the right, and recursively sorts the sub-partitions.
- **Recurrence:** 
  - Best/Average Case: $T(n) = 2T(n/2) + \Theta(n) \implies \Theta(n \log n)$.
  - Worst Case: $T(n) = T(n-1) + \Theta(n) \implies O(n^2)$ when the pivot is always the extreme element.

#### 6. Heap Sort
- **Mechanism:** Converts the array into a Binary Max-Heap in $O(n)$ time. Repeatedly swaps the root (maximum value) with the last element of the heap, reduces heap size by 1, and calls `heapify()` to restore the max-heap property.
- **Analysis:** Guarantees $O(n \log n)$ worst-case time while operating in-place ($O(1)$ auxiliary space).

#### 7. Dijkstra's Algorithm
- **Mechanism:** Computes the shortest path from a starting node to all other nodes on a weighted graph with non-negative edge weights.
- **Greedy Choice:** At each step, selects the unvisited node with the lowest cumulative distance, marks it visited, relaxes all outgoing adjacent edges, and updates parent pointers.

---

## Viva and Academic Defense Guide

### Commonly Asked Questions in University Viva

**1. Why does Quick Sort have a worst-case time complexity of $O(n^2)$?**
- *Answer:* When the chosen pivot divides the array into highly unbalanced partitions of size $0$ and $n-1$ (such as picking the last element in an already sorted or reverse-sorted array), the recurrence becomes $T(n) = T(n-1) + O(n)$, which evaluates to $O(n^2)$.

**2. Why does Merge Sort require $O(n)$ auxiliary space while Heap Sort operates in $O(1)$?**
- *Answer:* Merge Sort combines two separately sorted halves into a temporary buffer to avoid overwriting unmerged elements. In contrast, Heap Sort organizes the array elements in-place using implicit binary heap indexing ($2i+1$ for left child, $2i+2$ for right child).

**3. What is an algorithm's stability, and why does it matter?**
- *Answer:* A sorting algorithm is stable if it preserves the relative order of duplicate elements. Stability is essential when sorting records by multiple secondary keys (for example, sorting students by roll number after previously sorting them by name).

**4. Why cannot Dijkstra's algorithm handle negative edge weights?**
- *Answer:* Dijkstra operates on a greedy invariant: once a vertex is marked visited and extracted from the priority queue, its shortest distance from the source is considered finalized. A negative weight edge encountered later could produce a shorter path to an already-finalized vertex, invalidating the greedy premise. For graphs with negative weights, the Bellman-Ford algorithm must be used.

**5. What is the Master Theorem and when does it apply?**
- *Answer:* The Master Theorem provides a cookbook method for solving divide-and-conquer recurrences of the form $T(n) = aT(n/b) + f(n)$, where $a \ge 1$ and $b > 1$. It compares $f(n)$ with $n^{\log_b a}$ across three cases:
  - If $f(n) = O(n^{\log_b a - \epsilon})$, then $T(n) = \Theta(n^{\log_b a})$.
  - If $f(n) = \Theta(n^{\log_b a})$, then $T(n) = \Theta(n^{\log_b a} \log n)$.
  - If $f(n) = \Omega(n^{\log_b a + \epsilon})$ and regularity holds, then $T(n) = \Theta(f(n))$.

---

## Student and Academic Information

- **Student Name:** Vishrut Sharma
- **Enrollment Number:** 12402080601153
- **Department / Division:** Information Technology (IT-B)
- **Programme:** Bachelor of Technology (Information Technology)
- **Semester:** Semester 5
- **Course Title:** Design and Analysis of Algorithms (DAA)
- **Project Type:** Academic Course Project
