//Quantidade de fileiras do tabuleiro
var grid_columns = document.getElementById("grid_columns").valueAsNumber;
//Quantidade de fileiras do fileira
var grid_rows = document.getElementById("grid_rows").valueAsNumber;
//Quantidade de bombas do jogo
var bomb_qnt = document.getElementById("bomb_qnt").valueAsNumber;
//Tempo para o modo rivotril
var timer = document.getElementById("timer").value;
console.log(timer);

//Chamada para atualizar o valor máximo do campo de quantidade de bombas caso o usuário volte após iniciar um jogo com valores diferente do padrão
updateBombQnt();

//Função chamada para garantir que os valores não ultrapassem os limites
function valueChange(e) {
    console.log(e.target.valueAsNumber);
    //Impede o campo de receber um valor menor que o mínimo
    if (e.target.valueAsNumber < e.target.min) {
        e.target.value = e.target.min;
    }

    //Impede o campo de receber um valor maior que o máximo
    if (e.target.valueAsNumber > e.target.max) {
        e.target.value = e.target.max;
    }

    updateBombQnt();
}

//Função para atualizar o campo de quantidade de bombas
//Necessária pois ela depende dos outros
function updateBombQnt() {
    //Salva o valor que está inserido no campo "bomb_qnt"
    bomb_qnt = document.getElementById("bomb_qnt").valueAsNumber;

    //Salva o valor que está inserido no campo "grid_columns"
    grid_columns = document.getElementById("grid_columns").valueAsNumber;

    //Salva o valor que está inserido no campo "grid_rows"
    grid_rows = document.getElementById("grid_rows").valueAsNumber;

    //Verifica se há mais bombas do que posições
    if (bomb_qnt.max !== grid_columns*grid_rows-1) {
        if (bomb_qnt > grid_columns*grid_rows-1) {
            //Cria um novo campo para poder alterar o valor máximo do input e para reduzir o valor atual dele caso este ultrapasse o limite
            let novo_campo = document.createElement("input");
            novo_campo.setAttribute("id", "bomb_qnt");
            novo_campo.setAttribute("type", "number");
            novo_campo.setAttribute("min", "1");
            novo_campo.setAttribute("max", grid_columns*grid_rows-1);
            novo_campo.setAttribute("onchange", "valueChange(event)");
            novo_campo.setAttribute("required", "true");
            novo_campo.setAttribute("value", grid_columns*grid_rows-1);

            //Exclui o campo anterior e posiciona o novo
            let placeholder = document.getElementById("placeholder");
            placeholder.removeChild(document.getElementById("bomb_qnt"));
            placeholder.appendChild(novo_campo);
        }
        //Apenas atualiza o valor máximo caso não ultrapasse
        else {
            document.getElementById("bomb_qnt").setAttribute("max", grid_columns*grid_rows-1);
        }
    }

    bomb_qnt = document.getElementById("bomb_qnt").valueAsNumber;
}

//Função que habilita e desabilita o seletor de tempo
function rivotrilSwitch(e) {
    let timerPlaceholder = document.getElementById("timerPlaceholder");

    let novo_timer = document.createElement("input");
    novo_timer.setAttribute("id", "timer");
    novo_timer.setAttribute("type", "time");
    novo_timer.setAttribute("min", "00:00:01");
    novo_timer.setAttribute("step", "1");
    novo_timer.setAttribute("required", "true");
    if (!e.target.checked) {
        novo_timer.setAttribute("disabled", e.target.checked);
    }
    novo_timer.setAttribute("value", timer);

    //Exclui o campo anterior e posiciona o novo
    timerPlaceholder.removeChild(document.getElementById("timer"));
    timerPlaceholder.appendChild(novo_timer);
}

//Função para mudar de tela
function jogar() {
    //Limpa os valores anteriores da memória
    localStorage.clear();

    //Obtem os valores dos campos
    grid_columns = document.getElementById("grid_columns").value;
    grid_rows = document.getElementById("grid_rows").value;
    bomb_qnt = document.getElementById("bomb_qnt").value;

    //Salva os valores
    localStorage.setItem("grid_columns", String(grid_columns)); 
    localStorage.setItem("grid_rows", String(grid_rows));
    localStorage.setItem("bomb_qnt", String(bomb_qnt));
    if (document.getElementById("rivotril").checked) {
        localStorage.setItem("timer", (timer));
    }
    else {
        localStorage.setItem("timer", null);
    }
}