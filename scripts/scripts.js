// Variáveis globais para o grid e as bombas
let grid = [];
let bombPositions = [];

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

    // Verifica se é uma bomba
    if (grid[row][col] === 'B') {
        revealBombs();
        alert("Você perdeu!");
    } else {
        revealCell(row, col);
    }
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