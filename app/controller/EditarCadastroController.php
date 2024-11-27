<?php

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

class EditarCadastroController
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

        // Renderiza a página de edição de cadastro
        echo $twig->render('editar-cadastro.html', [
            'title' => 'Editar Cadastro',
            'user' => $_SESSION['usr'] // Passa os dados do usuário para o template
        ]);
    }

    public function salvar($dados)
    {
        // Simula atualização no banco de dados (em um sistema real, haveria uma conexão ao BD)
        $nome = $dados['name'] ?? null;
        $telefone = $dados['telefone'] ?? null;
        $email = $dados['email'] ?? null;
        $senha = $dados['senha'] ?? null;

        // Verifica se os dados obrigatórios foram preenchidos
        if (!$nome || !$telefone || !$email || !$senha) {
            return json_encode(['status' => 'error', 'message' => 'Todos os campos obrigatórios devem ser preenchidos.']);
        }

        // Simula a lógica de atualização
        $atualizado = [
            'nome' => $nome,
            'telefone' => $telefone,
            'email' => $email,
            'senha' => password_hash($senha, PASSWORD_DEFAULT), // Hash da senha
        ];

        // Retorna uma mensagem de sucesso (ou redireciona em um sistema real)
        return json_encode(['status' => 'success', 'message' => 'Dados atualizados com sucesso!', 'usuario' => $atualizado]);
    }
}
