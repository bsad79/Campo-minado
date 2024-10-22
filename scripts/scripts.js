let grid = [];
let bombPositions = [];

function criaGrid(){
    const linhas = document.getElementById('grid_rows').value;
    const colunas = document.getElementById('grid_columns').value;
    const gridContainer = document.getElementById('campo-minado');

    gridContainer.innerHTML = '';

    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateRows = `repeat(${linhas}, 1fr)`;
    gridContainer.style.gridTemplateColumns = `repeat(${colunas}, 1fr)`;
    gridContainer.classList.add('grid');

    for (let i = 0; i < linhas * colunas; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', function() {
          if (cell.textContent === '') {
            cell.textContent = 'X'; 
          }
        });
        gridContainer.appendChild(cell);
      }
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