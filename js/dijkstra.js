// Shortest Path (Dijkstra's Algorithm) on a 2D Grid
// DAA Semester 5 Syllabus (Greedy Algorithm for Single Source Shortest Path)

const gridContainer = document.getElementById("grid-container");
const btnRunDijkstra = document.getElementById("btn-run-dijkstra");
const btnClearPath = document.getElementById("btn-clear-path");
const btnClearWalls = document.getElementById("btn-clear-walls");
const graphVisited = document.getElementById("graph-visited");
const graphLength = document.getElementById("graph-length");

const ROWS = 15;
const COLS = 28;

let grid = [];
let startNode = { r: 7, c: 4 };
let targetNode = { r: 7, c: 23 };
let isRunningDijkstra = false;

// Create 2D Grid
function createGrid() {
  gridContainer.innerHTML = "";
  gridContainer.style.gridTemplateColumns = `repeat(${COLS}, 24px)`;
  gridContainer.style.gridTemplateRows = `repeat(${ROWS}, 24px)`;
  grid = [];

  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.id = `cell-${r}-${c}`;

      const isStart = (r === startNode.r && c === startNode.c);
      const isTarget = (r === targetNode.r && c === targetNode.c);

      if (isStart) cell.classList.add("start");
      if (isTarget) cell.classList.add("target");

      cell.addEventListener("click", () => toggleWall(r, c));

      gridContainer.appendChild(cell);
      row.push({
        r: r,
        c: c,
        isWall: false,
        isStart: isStart,
        isTarget: isTarget,
        dist: Infinity,
        visited: false,
        parent: null
      });
    }
    grid.push(row);
  }
}

function toggleWall(r, c) {
  if (isRunningDijkstra) return;
  const node = grid[r][c];
  if (node.isStart || node.isTarget) return;

  node.isWall = !node.isWall;
  const cell = document.getElementById(`cell-${r}-${c}`);
  if (node.isWall) {
    cell.classList.add("wall");
  } else {
    cell.classList.remove("wall");
  }
}

function clearPath() {
  if (isRunningDijkstra) return;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node = grid[r][c];
      node.dist = Infinity;
      node.visited = false;
      node.parent = null;

      const cell = document.getElementById(`cell-${r}-${c}`);
      cell.classList.remove("visited", "path");
    }
  }
  graphVisited.textContent = "0";
  graphLength.textContent = "0";
}

function clearAllWalls() {
  if (isRunningDijkstra) return;
  clearPath();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grid[r][c].isWall = false;
      const cell = document.getElementById(`cell-${r}-${c}`);
      cell.classList.remove("wall");
    }
  }
}

// Dijkstra Algorithm Implementation
async function runDijkstra() {
  if (isRunningDijkstra) return;
  clearPath();
  isRunningDijkstra = true;
  btnRunDijkstra.disabled = true;

  const start = grid[startNode.r][startNode.c];
  const target = grid[targetNode.r][targetNode.c];
  start.dist = 0;

  // Collect all unvisited nodes
  const unvisitedNodes = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!grid[r][c].isWall) {
        unvisitedNodes.push(grid[r][c]);
      }
    }
  }

  let visitedCount = 0;
  let foundTarget = false;

  while (unvisitedNodes.length > 0) {
    // Sort to pick node with minimum distance (Greedy choice)
    unvisitedNodes.sort((a, b) => a.dist - b.dist);
    const current = unvisitedNodes.shift();

    if (current.dist === Infinity) {
      // Remaining nodes unreachable
      break;
    }

    current.visited = true;
    visitedCount++;
    graphVisited.textContent = visitedCount;

    // Animate visited node
    if (!current.isStart && !current.isTarget) {
      const cell = document.getElementById(`cell-${current.r}-${current.c}`);
      cell.classList.add("visited");
      await new Promise(res => setTimeout(res, 15));
    }

    if (current === target) {
      foundTarget = true;
      break;
    }

    // Relax 4 adjacent neighbors (Up, Down, Left, Right)
    const neighbors = [];
    const { r, c } = current;
    if (r > 0) neighbors.push(grid[r - 1][c]);
    if (r < ROWS - 1) neighbors.push(grid[r + 1][c]);
    if (c > 0) neighbors.push(grid[r][c - 1]);
    if (c < COLS - 1) neighbors.push(grid[r][c + 1]);

    for (let neighbor of neighbors) {
      if (!neighbor.visited && !neighbor.isWall) {
        const altDist = current.dist + 1; // Unweighted grid edge cost = 1
        if (altDist < neighbor.dist) {
          neighbor.dist = altDist;
          neighbor.parent = current;
        }
      }
    }
  }

  // Draw Shortest Path
  if (foundTarget) {
    let curr = target.parent;
    let pathLength = 0;

    while (curr && !curr.isStart) {
      pathLength++;
      graphLength.textContent = pathLength;
      const cell = document.getElementById(`cell-${curr.r}-${curr.c}`);
      cell.classList.remove("visited");
      cell.classList.add("path");
      curr = curr.parent;
      await new Promise(res => setTimeout(res, 25));
    }
  } else {
    alert("No path exists between Start and Target!");
  }

  isRunningDijkstra = false;
  btnRunDijkstra.disabled = false;
}

// Event Listeners
if (btnRunDijkstra) btnRunDijkstra.addEventListener("click", runDijkstra);
if (btnClearPath) btnClearPath.addEventListener("click", clearPath);
if (btnClearWalls) btnClearWalls.addEventListener("click", clearAllWalls);

// Initialize Grid
createGrid();
