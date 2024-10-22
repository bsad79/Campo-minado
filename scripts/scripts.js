// Variáveis globais para o grid e as bombas
let grid = [];
let bombPositions = [];
let timerInterval;
let gameHistory = []; 
let gameStartTime; 
let gameEndTime;   // Armazena o momento do fim do jogo
let hasGameStarted = false; 
let timeInterval; 

function startGame() {
    const mode = document.querySelector('input[name="gameMode"]:checked').value;
    const rows = document.getElementById('grid_rows').value;
    const columns = document.getElementById('grid_columns').value;

    document.getElementById('modalidadePartida').textContent = mode; 
    document.getElementById('configuracaoTabuleiro').textContent = `${rows}x${columns}`; 

    if (mode === 'Rivotril') {
        startRivotrilMode();
    } 

    createGrid();
}

function startRivotrilMode() {
    const rows = document.getElementById('grid_rows').value;
    const columns = document.getElementById('grid_columns').value;
    
    // Calcula o tempo com base na fórmula 15 * (rows x columns)
    let timeRemaining =  (rows * columns)/5;
    
    // Exibe o timer na tela
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.textContent = `${timeRemaining} segundos`;
    
    // Inicia o timer
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = `${Math.round(timeRemaining)} segundos`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endGame(false); // Função para encerrar o jogo com derrota
        }
    }, 1000); // Atualiza a cada segundo
}

function startTimer() {
    const timerElement = document.getElementById('tempoPartida');
    
    timeInterval = setInterval(() => {
        const currentTime = new Date();
        const timeSpent = Math.floor((currentTime - gameStartTime) / 1000); // Calcula o tempo em segundos
        timerElement.textContent = `${timeSpent} segundos`; // Atualiza o texto na div
    }, 1000); // Atualiza a cada segundo
}

function endGame(win) {
    clearInterval(timerInterval); // Para o timer, se aplicável
    clearInterval(timeInterval); // Para o cronômetro visual
    gameEndTime = new Date(); // Registra o momento do fim do jogo

    const timeSpent = ((gameEndTime - gameStartTime) / 1000).toFixed(2); // Tempo em segundos

    // Atualiza o tempo final dentro da div
    const timerElement = document.getElementById('tempoPartida');
    timerElement.textContent = `${timeSpent} segundos`;

    // Resultado da partida (vitória ou derrota)
    const result = win ? 'Vitória' : 'Derrota';

    // Detalhes da partida
    const gameDetails = {
        playerName: 'teste', //document.getElementById('playerName').value,
        fieldDimensions: `${document.getElementById('grid_rows').value}x${document.getElementById('grid_columns').value}`,
        bombs: document.getElementById('bomb_qnt').value,
        mode: document.querySelector('input[name="gameMode"]:checked').value === 'rivotril' ? 'Rivotril' : 'Clássico',
        timeSpent: `${timeSpent} segundos`,
        result: result,
        dateTime: gameEndTime.toLocaleString()
    };

    // Adiciona ao histórico de partidas
    gameHistory.push(gameDetails);
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory)); // Salva no localStorage

    // Exibe o histórico atualizado
    displayGameHistory();

    if (win) {
        alert("Parabéns, você venceu!");
    } else {
        alert("Você perdeu.");
    }

    // Reseta o estado do jogo
    hasGameStarted = false; // Reseta a variável para o próximo jogo
}


function displayGameHistory() {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.innerHTML = ''; // Limpa o histórico anterior

    gameHistory.forEach((game, index) => {
        const gameElement = document.createElement('div');
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
    const columns = document.getElementById('grid_columns').value;
    const rows = document.getElementById('grid_rows').value;
    const bombs = document.getElementById('bomb_qnt').value;

    // Limpa o grid anterior
    const gridContainer = document.getElementById('campo-minado');
    gridContainer.innerHTML = '';

    // Cria um grid 2D
    grid = Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0));

    // Adiciona bombas aleatoriamente
    bombPositions = generateBombs(rows, columns, bombs);

    // Renderiza o grid visualmente
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
            grid[row][col] = 'B'; // Marca a célula com uma bomba
        }
    }

    return positions;
}

function renderGrid(rows, columns) {
    const gridContainer = document.getElementById('campo-minado');
    
    // Define o layout de grid baseado no número de colunas e linhas
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`; // Cada célula terá 40px de altura
    gridContainer.style.gridTemplateColumns = `repeat(${columns}, 30px)`; // Cada célula terá 40px de largura

    // Cria as células visualmente
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            gridContainer.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    // Inicia o cronômetro no primeiro clique
    if (!hasGameStarted) {
        gameStartTime = new Date(); // Registra o momento do primeiro clique
        hasGameStarted = true;
        startTimer(); // Inicia o timer visual
    }

    // Verifica se é uma bomba
    if (grid[row][col] === 'B') {
        revealBombs();
        endGame(false); // Chama a função para encerrar o jogo com derrota
    } else {
        revealCell(row, col);
        
        // Verifica se todas as células sem bomba foram reveladas (condição de vitória)
        if (checkForWin()) {
            endGame(true); // Chama a função para encerrar o jogo com vitória
        }
    }
}


function checkForWin() {
    let cellsRemaining = 0;
    
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.querySelector(`.cell[data-row="${rowIndex}"][data-col="${colIndex}"]`);
            if (!cellElement.classList.contains('revealed') && grid[rowIndex][colIndex] !== 'B') {
                cellsRemaining++;
            }
        });
    });

    return cellsRemaining === 0; // Se não restar mais células para abrir, é vitória
}

function stopTimer() {
    clearInterval(timerInterval); // Para o timer se o jogador vencer antes do tempo acabar
}

function revealBombs() {
    bombPositions.forEach(position => {
        const [row, col] = position.split(',').map(Number);
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.textContent = '💣'; // Mostra a bomba
        cell.classList.add('bomb');
    });
}

function revealCell(row, col) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    
    // Se a célula já foi aberta, retorna
    if (cell.classList.contains('revealed')) return;
    
    cell.classList.add('revealed');
    const bombCount = countBombsAround(row, col);
    cell.textContent = bombCount > 0 ? bombCount : '';

    // Se não há bombas ao redor, revela as células vizinhas
    if (bombCount === 0) {
        revealAdjacentCells(row, col);
    }
}

function countBombsAround(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    let bombCount = 0;

    directions.forEach(([dRow, dCol]) => {
        const newRow = parseInt(row) + dRow;
        const newCol = parseInt(col) + dCol;

        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
            if (grid[newRow][newCol] === 'B') {
                bombCount++;
            }
        }
    });

    return bombCount;
}

function revealAdjacentCells(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    directions.forEach(([dRow, dCol]) => {
        const newRow = parseInt(row) + dRow;
        const newCol = parseInt(col) + dCol;

        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
            revealCell(newRow, newCol);
        }
    });
}


function valueChange(event) {
    const linhas = document.getElementById('grid_rows').value;
    const colunas = document.getElementById('grid_columns').value;
    const bombas = document.getElementById('bomb_qnt').value;

    const maxBombs = linhas * colunas; 

    if (bombas > maxBombs) {
        alert(`A quantidade de bombas não pode ser maior que ${maxBombs} (linhas * colunas).`);
        document.getElementById('bomb_qnt').value = maxBombs; 
    }

    if ((linhas) > (colunas)) {
        alert(`A quantidade de linhas não pode ser maior que a quantidade de colunas. Ou seja, deve ser menor ou igual a ${colunas} `);
        document.getElementById('grid_rows').value = colunas; 
    }
}

function activateCheatMode() {
    // Exibe as bombas
    revealBombs();

    // Desabilita o botão temporariamente para evitar múltiplos cliques seguidos
    const cheatButton = document.getElementById('cheatButton');
    cheatButton.disabled = true;

    // Esconde as bombas após 5 segundos
    setTimeout(() => {
        hideBombs();
        cheatButton.disabled = false; // Habilita o botão novamente após 5 segundos
    }, 3000); // Altere o valor para 5000 ms (5 segundos)
}


function hideBombs() {
    bombPositions.forEach(position => {
        const [row, col] = position.split(',').map(Number);
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

        // Esconde as bombas se a célula ainda não estiver aberta
        if (!cell.classList.contains('revealed')) {
            cell.textContent = '';
            cell.classList.remove('bomb');
        }
    });
}