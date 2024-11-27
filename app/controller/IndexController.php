<?php

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

class IndexController
{
    public function index()
    {
        // Configuração do Twig
        $loader = new FilesystemLoader(__DIR__ . '/../view');
        $twig = new Environment($loader, [
            'cache' => false, // Sem cache para desenvolvimento
            'auto_reload' => true, // Recarregar templates automaticamente
        ]);

        // Renderiza a página index.html
        echo $twig->render('index.html', [
            'title' => 'Campo Minado', // Parâmetro que pode ser usado no template
        ]);
    }

    public function login(){
        try {
            $username = $_POST['user'] ?? null;
            $password = $_POST['password'] ?? null;

            if (!$username || !$password) {
                echo json_encode(['status' => 'error', 'message' => 'Usuário e senha são obrigatórios.']);
                return;
            }

            $jogador = new Jogador();
            $user = $jogador->validateLogin($username, $password);

            // Salva os dados do usuário na sessão
            $_SESSION['usr'] = $user;

            // Retorna uma resposta de sucesso
            echo json_encode(['status' => 'success', 'message' => 'Login bem-sucedido!']);
        } catch (\Exception $e) {
            // Retorna a mensagem de erro como JSON
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }


}
