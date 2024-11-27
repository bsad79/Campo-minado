<?php

use Twig\Loader\FilesystemLoader;
use Twig\Environment;
use app\model\Jogo;
use Database\Connection;

class JogoController
{
    public function index()
    {
        // Verifica se o usuário está logado
        if (!isset($_SESSION['usr'])) {
            header('Location: ?url=Index/index');
            exit();
        }

        // Configuração do Twig
        $loader = new FilesystemLoader(__DIR__ . '/../view');
        $twig = new Environment($loader, [
            'cache' => false,
            'auto_reload' => true,
        ]);

        // Renderiza a página do jogo
        echo $twig->render('jogo.html', [
            'title' => 'Campo Minado',
            'username' => $_SESSION['usr']['username'] // Passa o nome do usuário para o template
        ]);
    }

    public function salvarPartida()
    {
        // Verifica se o usuário está logado
        if (!isset($_SESSION['usr'])) {
            echo json_encode(['status' => 'error', 'message' => 'Usuário não logado.']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true); // Recebe os dados enviados via fetch

        if (!$data) {
            echo json_encode(['status' => 'error', 'message' => 'Dados inválidos.']);
            return;
        }


        // Monta os dados para salvar no banco
        $partida = [
            'id_jogador' => $_SESSION['usr']['id'], // ID do jogador logado
            'nome_jogador' => $_SESSION['usr']['nome_completo'], // Nome do jogador logado
            'dimensoes_campo' => $data['dimensoes_campo'] ?? '13x13',
            'quantidade_bombas' => $data['quantidade_bombas'] ?? 0,
            'modalidade_partida' => $data['modalidade_partida'],
            'tempo_gasto' => $data['tempo_gasto'] ?? 0, // Em segundos
            'resultado' => $data['resultado'] ?? 'Desconhecido', // Vitória ou Derrota
            'data_hora' => date('Y-m-d H:i:s') // Data e hora atuais
        ];

        try {
            $jogo = new Jogo();
            $jogo->saveGame($partida);

            // Retorna sucesso
            echo json_encode(['status' => 'success', 'message' => 'Partida salva com sucesso!']);
        } catch (\Exception $e) {
            // Retorna erro
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function carregarHistorico(){
        // Verifica se o usuário está logado
        if (!isset($_SESSION['usr'])) {
            echo json_encode(['status' => 'error', 'message' => 'Usuário não logado.']);
            return;
        }

        $idJogador = $_SESSION['usr']['id']; // Obtém o ID do jogador logado

        try {
            $jogo = new Jogo();
            $historico = $jogo->buscarHistoricoPorJogador($idJogador); // Busca o histórico no modelo

            // Retorna o histórico como JSON
            echo json_encode(['status' => 'success', 'historico' => $historico]);
        } catch (\Exception $e) {
            // Retorna erro
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

}
