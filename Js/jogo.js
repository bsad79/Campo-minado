var grid_columns = 12;
var grid_rows = 8;
var bomb_qnt = 10;

/*console.log("grid_columns: ", grid_columns);
console.log("grid_rows: ", grid_rows);
console.log("bomb_qnt: ", bomb_qnt);*/

document.getElementsByClassName("container")[0].style.gridTemplateColumns = "repeat("+grid_columns+", 1fr)";

for (let i = 0; i < grid_columns*grid_rows; i++) {
    let div = document.createElement("div");
    div.setAttribute("class", "tile covered");
    document.getElementsByClassName("container")[0].appendChild(div);
}

//Vetor para armazenar todas as posições do tabuleiro
var tiles = document.getElementsByClassName("tile");

console.log(tiles);

//Posicionamento das bombas
for (let i = 0; i < bomb_qnt; i++) {
    //Sorteia uma posição aleatória do tabuleiro
    let sort = Math.floor(Math.random() * tiles.length);

    //Verifica se a posição sorteada já não possui uma bomba, se possuir, sorteia outra
    while (tiles[sort].innerHTML == "0") {
        sort = Math.floor(Math.random() * tiles.length);
    }

    //Posiciona a bomba na posição sorteada
    tiles[sort].appendChild(document.createTextNode("0"));
}


//Posiciona os números que indicam quantas bombas estão próximas de uma determinada posição
for (let i = 0; i < tiles.length; i++) {
    //Filtra para obter apenas as bombas
    if (tiles[i].innerHTML == "0") {
        //Vetor que contém às posições ao redor da bomba
        let around = getSurrounding(i);
        for (let j = 0; j < around.length; j++) {
            //Faz o teste para verifiar se a posição não é ocupada por uma bomba
            if (tiles[around[j]].innerHTML !== "0") {
                //Incrementa o valor da posição ao lado da bomba
                tiles[around[j]].innerHTML++;
            }
        }
    }
}

for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].innerHTML == "") {
        tiles[i].innerHTML = -1;
    }
}

//Função que retorna as posições válidas ao redor da bomba
//Ele remove aquelas que fogem do tabuleiro
function getSurrounding(pos) {
    let surronding = [pos-grid_columns-1, pos-grid_columns, pos-grid_columns+1, pos-1, pos+1, pos+grid_columns-1, pos+grid_columns, pos+grid_columns+1];

    //Verifica se a bomba pertence a extremidade esquerda ou direita
    let aux = pos;
    while (aux > grid_columns-1) {
        aux -= grid_columns;
    }

    //Impede que as bombas da extremidade esquerda influenciem na extremidade direita do tabuleiro
    if (aux == 0) {
        surronding.splice(5,1);
        surronding.splice(3,1);
        surronding.splice(0,1);
    }
    //Impede que as bombas da extremidade direita influenciem na extremidade esquerda do tabuleiro
    if (aux == grid_columns-1) {
        surronding.splice(7,1);
        surronding.splice(4,1);
        surronding.splice(2,1);
    }

    for (let i = surronding.length - 1; i >= 0; i--) {
        if (surronding[i] < 0 || surronding[i] > grid_columns*grid_rows - 1)
            surronding.splice(i, 1);
    }
    return surronding;
}

function listener(e) {
    //console.log(e);
    //console.log(e.target);
    let target = e.target;
    flip(target);
}

//Função ativada ao clicar em uma posição
function flip(target) {
    if (target.className == "tile covered") {
        target.setAttribute("class", "tile flipped number");
        switch (parseInt(target.innerHTML)) {
            case -1:
                //Campo vazio. Não faz nada

                for (let i = 0; i < tiles.length; i++) {
                    if (target === tiles[i]) {

                        let around = getSurrounding(i);
                        for (let j = 0; j < around.length; j++) {
                            if (tiles[around[j]].innerHTML != 0) {
                                flip(tiles[around[j]]);
                            }
                        }
                    }
                }

                break;
            case 0:
                //Campo com bomba, ficará como vermelho até ter imagem da bomba. Depois não fará nada
                target.style.color = "red";

                //Chamar função de fim de jogo quando ela ficar pronta
                alert("Fim de jogo");
                break;

            //Fazer uma paleta de cores para cada número depois
            /*case 1:
                target.style.color = "";
                break;
            case 2:
                target.style.color = "";
                break;
            case 3:
                target.style.color = "";
                break;
            case 4:
                target.style.color = "";
                break;
            case 5:
                target.style.color = "";
                break;
            case 6:
                target.style.color = "";
                break;
            case 7:
                target.style.color = "";
                break;
            case 8:
                target.style.color = "";
                break;
                */
            default:
                target.style.color = "black";
                break;
        }
    }
}

//Função para que o botão direito marque a posição com uma bandeira ao invés de chamar o menu de contexto
document.addEventListener("contextmenu", function() {
    var e = window.event;
    if (e.target.className == "container" || e.target.className == "tile covered" || e.target.className == "tile flipped number" || e.target.className == "tile covered marked") {
        e.preventDefault();
    }
    if (e.target.className == "tile covered") {
        e.target.setAttribute("class", "tile covered marked");
    }
    else if (e.target.className == "tile covered marked") {
        e.target.setAttribute("class", "tile covered");
    }
});