//Quantidade de fileiras do tabuleiro
var grid_columns;// = document.getElementById("grid_columns").value;
//Quantidade de fileiras do fileira
var grid_rows;// = document.getElementById("grid_rows").value;
//Quantidade de bombas do jogo
var bomb_qnt;// = document.getElementById("bomb_qnt").value;

function valueChange(e) {
    console.log(e);
    
    //Impede que hajam mais bombas do que posições
    document.getElementById("bomb_qnt").setAttribute("max", Math.floor(grid_columns*grid_rows-1));

    grid_columns = document.getElementById("grid_columns").value;
    grid_rows = document.getElementById("grid_rows").value;
    bomb_qnt = document.getElementById("bomb_qnt").value;
}

function change() {
    localStorage.setItem('grid_columns', grid_columns);
    localStorage.setItem('grid_rows', grid_rows);
    localStorage.setItem('bomb_qnt', bomb_qnt);
}