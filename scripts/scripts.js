let grid = [];
let bombPositions = [];
let timerInterval;
let gameHistory = [];
let gameStartTime;
let gameEndTime;
let hasGameStarted = false;
let timeInterval;

function startGame() {
  const mode = document.querySelector('input[name="gameMode"]:checked').value;
  const rows = document.getElementById("grid_rows").value;
  const columns = document.getElementById("grid_columns").value;

  document.getElementById("modalidadePartida").textContent = mode;
  document.getElementById(
    "configuracaoTabuleiro"
  ).textContent = `${rows}x${columns}`;

  if (mode === "Rivotril") {
    startRivotrilMode();
  }

  createGrid();
}

function startRivotrilMode() {
  const rows = document.getElementById("grid_rows").value;
  const columns = document.getElementById("grid_columns").value;

  let timeRemaining = (rows * columns) / 5;

  const timerDisplay = document.getElementById("timerDisplay");
  timerDisplay.textContent = `${timeRemaining} segundos`;

  timerInterval = setInterval(() => {
    timeRemaining--;
    timerDisplay.textContent = `${Math.round(timeRemaining)} segundos`;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      endGame(false); 
    }
  }, 1000); 
}

function startTimer() {
  const timerElement = document.getElementById("tempoPartida");

  timeInterval = setInterval(() => {
    const currentTime = new Date();
    const timeSpent = Math.floor((currentTime - gameStartTime) / 1000); 
    timerElement.textContent = `${timeSpent} segundos`; 
  }, 1000); 
}

function endGame(win) {
  clearInterval(timerInterval); 
  clearInterval(timeInterval); 
  gameEndTime = new Date(); 

  const timeSpent = ((gameEndTime - gameStartTime) / 1000).toFixed(2); 

 
  const timerElement = document.getElementById("tempoPartida");
  timerElement.textContent = `${timeSpent} segundos`;

  const result = win ? "Vitória" : "Derrota";

  const gameDetails = {
    playerName: "teste", //document.getElementById('playerName').value,
    fieldDimensions: `${document.getElementById("grid_rows").value}x${
      document.getElementById("grid_columns").value
    }`,
    bombs: document.getElementById("bomb_qnt").value,
    mode:
      document.querySelector('input[name="gameMode"]:checked').value ===
      "rivotril"
        ? "Rivotril"
        : "Clássico",
    timeSpent: `${timeSpent} segundos`,
    result: result,
    dateTime: gameEndTime.toLocaleString(),
  };

  
  gameHistory.push(gameDetails);
  localStorage.setItem("gameHistory", JSON.stringify(gameHistory)); 

  // Exibe o histórico atualizado
  displayGameHistory();

  if (win) {
    alert("Parabéns, você venceu!");
  } else {
    alert("Você perdeu.");
  }

  hasGameStarted = false; 
}

function displayGameHistory() {
  const historyContainer = document.getElementById("historyContainer");
  historyContainer.innerHTML = "";

  gameHistory.forEach((game, index) => {
    const gameElement = document.createElement("div");
    gameElement.innerHTML += `
        <section class="ultimos-jogos">
        <p> Partida ${index + 1} </p>
        <p> Jogador: ${game.playerName} </p>
        <p> Dimensões do campo: ${game.fieldDimensions} </p>
        <p> Quantidade de bombas: ${game.bombs} </p> 
        <p> Modalidade da partida: ${game.mode} </p> 
        <p> Tempo gasto: ${game.timeSpent} </p> 
        <p> Resultado: ${game.result} </p> 
        <p> Data: ${game.dateTime} </p>
        </section>`;
    historyContainer.appendChild(gameElement);
  });
}

function createGrid() {
  const columns = document.getElementById("grid_columns").value;
  const rows = document.getElementById("grid_rows").value;
  const bombs = document.getElementById("bomb_qnt").value;

  const gridContainer = document.getElementById("campo-minado");
  gridContainer.innerHTML = "";

  grid = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => 0)
  );

  bombPositions = generateBombs(rows, columns, bombs);

  renderGrid(rows, columns);
}

function generateBombs(rows, columns, bombs) {
  let positions = [];

  while (positions.length < bombs) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * columns);
    const position = `${row},${col}`;

    if (!positions.includes(position)) {
      positions.push(position);
      grid[row][col] = "B"; // Marca a célula com uma bomba
    }
  }

  return positions;
}

function renderGrid(rows, columns) {
  const gridContainer = document.getElementById("campo-minado");

  gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
  gridContainer.style.gridTemplateColumns = `repeat(${columns}, 30px)`; 


  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", handleCellClick);
      gridContainer.appendChild(cell);
    }
  }
}

function handleCellClick(event) {
  const row = event.target.dataset.row;
  const col = event.target.dataset.col;

 
  if (!hasGameStarted) {
    gameStartTime = new Date(); 
    hasGameStarted = true;
    startTimer(); 
  }

  
  if (grid[row][col] === "B") {
    revealBombs();
    endGame(false); 
  } else {
    revealCell(row, col);

    
    if (checkForWin()) {
      endGame(true); 
    }
  }
}

function checkForWin() {
  let cellsRemaining = 0;

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.querySelector(
        `.cell[data-row="${rowIndex}"][data-col="${colIndex}"]`
      );
      if (
        !cellElement.classList.contains("revealed") &&
        grid[rowIndex][colIndex] !== "B"
      ) {
        cellsRemaining++;
      }
    });
  });

  return cellsRemaining === 0;
}

function stopTimer() {
  clearInterval(timerInterval); 
}

function revealBombs() {
  bombPositions.forEach((position) => {
    const [row, col] = position.split(",").map(Number);
    const cell = document.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`
    );
    cell.textContent = "💣";
    cell.classList.add("bomb");
  });
}

function revealCell(row, col) {
  const cell = document.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
  );

  if (cell.classList.contains("revealed")) return;

  cell.classList.add("revealed");
  const bombCount = countBombsAround(row, col);
  cell.textContent = bombCount > 0 ? bombCount : "";


  if (bombCount === 0) {
    revealAdjacentCells(row, col);
  }
}

function countBombsAround(row, col) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  let bombCount = 0;

  directions.forEach(([dRow, dCol]) => {
    const newRow = parseInt(row) + dRow;
    const newCol = parseInt(col) + dCol;

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length
    ) {
      if (grid[newRow][newCol] === "B") {
        bombCount++;
      }
    }
  });

  return bombCount;
}

function revealAdjacentCells(row, col) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  directions.forEach(([dRow, dCol]) => {
    const newRow = parseInt(row) + dRow;
    const newCol = parseInt(col) + dCol;

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length
    ) {
      revealCell(newRow, newCol);
    }
  });
}

function valueChange(event) {
  const rows = document.getElementById("grid_rows").value;
  const columns = document.getElementById("grid_columns").value;
  const bombs = document.getElementById("bomb_qnt").value;

  const maxBombs = linhas * colunas;

  if (bombs > maxBombs) {
    alert(
      `A quantidade de bombas não pode ser maior que ${maxBombs} (linhas * colunas).`
    );
    document.getElementById("bomb_qnt").value = maxBombs;
  }

  if (rows > columns) {
    alert(
      `A quantidade de linhas não pode ser maior que a quantidade de colunas. Ou seja, deve ser menor ou igual a ${columns} `
    );
    document.getElementById("grid_rows").value = columns;
  }
}

function activateCheatMode() {
  revealBombs();

  const cheatButton = document.getElementById("cheatButton");
  cheatButton.disabled = true;

  setTimeout(() => {
    hideBombs();
    cheatButton.disabled = false;
  }, 1000);
}

function hideBombs() {
  bombPositions.forEach((position) => {
    const [row, col] = position.split(",").map(Number);
    const cell = document.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`
    );

    // Esconde as bombas se a célula ainda não estiver aberta
    if (!cell.classList.contains("revealed")) {
      cell.textContent = "";
      cell.classList.remove("bomb");
    }
  });
}
