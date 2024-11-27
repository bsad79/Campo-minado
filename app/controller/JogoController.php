<?php

use Twig\Loader\FilesystemLoader;
use Twig\Environment;
use app\model\Jogo;
use Database\Connection;

class JogoController
{
    public function index()
    {
       
        if (!isset($_SESSION['usr'])) {
            header('Location: ?url=Index/index');
            exit();
        }

       
        $loader = new FilesystemLoader(__DIR__ . '/../view');
        $twig = new Environment($loader, [
            'cache' => false,
            'auto_reload' => true,
        ]);

       
        echo $twig->render('jogo.html', [
            'title' => 'Campo Minado',
            'username' => $_SESSION['usr']['username']
        ]);
    }

    public function salvarPartida()
    {
       
        if (!isset($_SESSION['usr'])) {
            echo json_encode(['status' => 'error', 'message' => 'Usuário não logado.']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            echo json_encode(['status' => 'error', 'message' => 'Dados inválidos.']);
            return;
        }


       
        $partida = [
            'id_jogador' => $_SESSION['usr']['id'],
            'nome_jogador' => $_SESSION['usr']['nome_completo'],
            'dimensoes_campo' => $data['dimensoes_campo'] ?? '13x13',
            'quantidade_bombas' => $data['quantidade_bombas'] ?? 0,
            'modalidade_partida' => $data['modalidade_partida'],
            'tempo_gasto' => $data['tempo_gasto'] ?? 0,
            'resultado' => $data['resultado'] ?? 'Desconhecido',
            'data_hora' => date('Y-m-d H:i:s')
        ];

        try {
            $jogo = new Jogo();
            $jogo->saveGame($partida);

           
            echo json_encode(['status' => 'success', 'message' => 'Partida salva com sucesso!']);
        } catch (\Exception $e) {
           
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function carregarHistorico(){
       
        if (!isset($_SESSION['usr'])) {
            echo json_encode(['status' => 'error', 'message' => 'Usuário não logado.']);
            return;
        }

        $idJogador = $_SESSION['usr']['id'];

        try {
            $jogo = new Jogo();
            $historico = $jogo->buscarHistoricoPorJogador($idJogador);

           
            echo json_encode(['status' => 'success', 'historico' => $historico]);
        } catch (\Exception $e) {
           
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

}
