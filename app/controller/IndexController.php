<?php

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

class IndexController
{
    public function index()
    {
       
        $loader = new FilesystemLoader(__DIR__ . '/../view');
        $twig = new Environment($loader, [
            'cache' => false,
            'auto_reload' => true,
        ]);

       
        echo $twig->render('index.html', [
            'title' => 'Campo Minado',
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

           
            $_SESSION['usr'] = $user;

           
            echo json_encode(['status' => 'success', 'message' => 'Login bem-sucedido!']);
        } catch (\Exception $e) {
           
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }


}
