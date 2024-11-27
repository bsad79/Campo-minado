<?php

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

class EditarCadastroController
{
    public function index()
    {
        // Configuração do Twig
        $loader = new FilesystemLoader(__DIR__ . '/../view');
        $twig = new Environment($loader, [
            'cache' => false, // Sem cache para desenvolvimento
            'auto_reload' => true, // Recarregar templates automaticamente
        ]);

        // Simulação de dados do usuário (normalmente viria de um banco de dados)
        $usuario = [
            'nome' => 'João Silva',
            'data_nascimento' => '1990-01-01',
            'cpf' => '12345678901',
            'telefone' => '(11) 98765-4321',
            'email' => 'joao.silva@example.com',
            'username' => 'joaosilva',
        ];

        // Renderiza o template
        echo $twig->render('editar-cadastro.html', [
            'title' => 'Editar Cadastro',
            'usuario' => $usuario,
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
