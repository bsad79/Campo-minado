<?php

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

class EditarCadastroController
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

       
        echo $twig->render('editar-cadastro.html', [
            'title' => 'Editar Cadastro',
            'user' => $_SESSION['usr']
        ]);
    }

    public function salvar()
{
   
    if (!isset($_SESSION['usr'])) {
        echo json_encode(['status' => 'error', 'message' => 'Usuário não está logado.']);
        return;
    }

   
    $dados = json_decode(file_get_contents('php://input'), true);

   
    $nome = $dados['name'] ?? null;
    $telefone = $dados['telefone'] ?? null;
    $email = $dados['email'] ?? null;
    $senha = $dados['senha'] ?? null;

   
    if (!$nome || !$telefone || !$email || !$senha) {
        echo json_encode(['status' => 'error', 'message' => 'Todos os campos obrigatórios devem ser preenchidos.']);
        return;
    }

    try {
       
        $jogador = new Jogador();
        $jogador->atualizar([
            'id' => $_SESSION['usr']['id'],
            'nome_completo' => $nome,
            'telefone' => $telefone,
            'email' => $email,
            'senha' => password_hash($senha, PASSWORD_DEFAULT),
        ]);

       
        $_SESSION['usr']['nome_completo'] = $nome;
        $_SESSION['usr']['telefone'] = $telefone;
        $_SESSION['usr']['email'] = $email;

        
        echo json_encode(['status' => 'success', 'message' => 'Dados atualizados com sucesso!']);
    } catch (\Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar os dados: ' . $e->getMessage()]);
    }
    }

}
