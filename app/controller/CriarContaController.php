<?php

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

class CriarContaController
{
    public function index()
    {
       
        $loader = new FilesystemLoader(__DIR__ . '/../view');
        $twig = new Environment($loader, [
            'cache' => false,
            'auto_reload' => true,
        ]);

       
        echo $twig->render('criar-conta.html', [
            'title' => 'Criar Conta'
        ]);
    }

    public function salvar(){
        $data = $_POST;

       
        $requiredFields = ['name', 'data-nascimento', 'cpf', 'telefone', 'email', 'username', 'senha'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                echo json_encode(['status' => 'error', 'message' => "O campo $field é obrigatório."]);
                return;
            }
        }

        try {
            $jogador = new Jogador();

           
            if ($jogador->checkDuplicate('cpf', $data['cpf'])) {
                echo json_encode(['status' => 'error', 'message' => 'CPF já está em uso.']);
                return;
            }

            if ($jogador->checkDuplicate('email', $data['email'])) {
                echo json_encode(['status' => 'error', 'message' => 'E-mail já está em uso.']);
                return;
            }

            if ($jogador->checkDuplicate('username', $data['username'])) {
                echo json_encode(['status' => 'error', 'message' => 'Username já está em uso.']);
                return;
            }

            $jogador->createPlayer($data);

           
            echo json_encode(['status' => 'success', 'message' => 'Conta criada com sucesso!']);
        } catch (\PDOException $e) {
           
            echo json_encode(['status' => 'error', 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
        } catch (\Exception $e) {
           
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }


}
