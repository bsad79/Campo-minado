<?php

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

class CriarContaController
{
    public function index()
    {
        // Configuração do Twig
        $loader = new FilesystemLoader(__DIR__ . '/../view');
        $twig = new Environment($loader, [
            'cache' => false, // Sem cache para desenvolvimento
            'auto_reload' => true, // Recarregar templates automaticamente
        ]);

        // Renderiza o formulário de criação de conta
        echo $twig->render('criar-conta.html', [
            'title' => 'Criar Conta'
        ]);
    }

    public function salvar(){
        $data = $_POST;

        // Verifica se todos os campos obrigatórios estão preenchidos
        $requiredFields = ['name', 'data-nascimento', 'cpf', 'telefone', 'email', 'username', 'senha'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                echo json_encode(['status' => 'error', 'message' => "O campo $field é obrigatório."]);
                return;
            }
        }

        try {
            $jogador = new Jogador();

            // Verifica duplicidade
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

            // Retorna sucesso
            echo json_encode(['status' => 'success', 'message' => 'Conta criada com sucesso!']);
        } catch (\PDOException $e) {
            // Captura erros de banco de dados e retorna como JSON
            echo json_encode(['status' => 'error', 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
        } catch (\Exception $e) {
            // Captura outros erros
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }


}
