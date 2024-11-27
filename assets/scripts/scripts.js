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

  if (mode === "rivotril") {
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
    playerName: "teste",
    fieldDimensions: `${document.getElementById("grid_rows").value}x${
      document.getElementById("grid_columns").value
    }`,
    bombs: document.getElementById("bomb_qnt").value,
    mode:
      document.querySelector('input[name="gameMode"]:checked').value ===
      "rivotril"
        ? "rivotril"
        : "classica",
    timeSpent: `${timeSpent} segundos`,
    result: result,
    dateTime: gameEndTime.toLocaleString(),
  };

  
  gameHistory.push(gameDetails);
  localStorage.setItem("gameHistory", JSON.stringify(gameHistory)); 


  if (win) {
    alert("Parabéns, você venceu!");
  } else {
    alert("Você perdeu.");
  }

  finalizarJogo(result, timeSpent);
  carregarHistorico();
  hasGameStarted = false; 
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
      grid[row][col] = "B";
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

    if (!cell.classList.contains("revealed")) {
      cell.textContent = "";
      cell.classList.remove("bomb");
    }
  });
}

function finalizarJogo(resultado, tempoGasto) {
  const data = {
      dimensoes_campo: document.getElementById('grid_columns').value + 'x' + document.getElementById('grid_rows').value,
      quantidade_bombas: document.getElementById('bomb_qnt').value,
      modalidade_partida: document.querySelector('input[name="gameMode"]:checked').value,
      tempo_gasto: tempoGasto,
      resultado: resultado
  };

  fetch('?url=Jogo/salvarPartida', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
  })
      .then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              alert(data.message);
          } else {
              alert('Erro: ' + data.message);
          }
      })
      .catch(error => {
          console.error('Erro na requisição:', error);
          alert('Erro inesperado ao registrar o jogo.');
      });
}

function carregarHistorico() {
  fetch('?url=Jogo/carregarHistorico')
      .then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              const historico = data.historico;
              const container = document.getElementById('historyContainer');

              container.innerHTML = '';

              historico.forEach(jogo => {
                  const div = document.createElement('div');
                  div.innerHTML = `
                    <div>  
                    <p><b>Data:</b> ${jogo.data_hora}</p>
                      <p><b>Configuração:</b> ${jogo.dimensoes_campo}</p>
                      <p><b>Bombas:</b> ${jogo.quantidade_bombas}</p>
                      <p><b>Modalidade:</b> ${jogo.modalidade_partida}</p>
                      <p><b>Tempo:</b> ${jogo.tempo_gasto} segundos</p>
                      <p><b>Resultado:</b> ${jogo.resultado}</p>
                     </div> 
                     <hr>
                     <br>
                  `;
                  container.appendChild(div);
                  console.log(jogo)
              });
              
          } else {
              alert('Erro ao carregar o histórico: ' + data.message);
          }
      })
      .catch(error => {
          console.error('Erro na requisição:', error);
          alert('Erro inesperado ao carregar o histórico.');
      });
}

function salvarDados() {
  const data = {
      name: document.getElementById('name').value,
      telefone: document.getElementById('telefone').value,
      email: document.getElementById('e-mail').value,
      senha: document.getElementById('senha').value,
  };

  fetch('?url=EditarCadastro/salvar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
  })
      .then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              alert(data.message);
              
              location.reload();
          } else {
              alert('Erro: ' + data.message);
          }
      })
      .catch(error => {
          console.error('Erro na requisição:', error);
          alert('Erro inesperado ao salvar os dados.');
      });
}


document.addEventListener('DOMContentLoaded', carregarHistorico);

