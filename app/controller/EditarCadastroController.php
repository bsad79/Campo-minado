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

    public function salvar()
{
    // Verifica se o usuário está logado
    if (!isset($_SESSION['usr'])) {
        echo json_encode(['status' => 'error', 'message' => 'Usuário não está logado.']);
        return;
    }

    // Recebe os dados enviados via POST ou JSON
    $dados = json_decode(file_get_contents('php://input'), true);

    // Dados do formulário
    $nome = $dados['name'] ?? null;
    $telefone = $dados['telefone'] ?? null;
    $email = $dados['email'] ?? null;
    $senha = $dados['senha'] ?? null;

    // Verifica se os campos obrigatórios estão preenchidos
    if (!$nome || !$telefone || !$email || !$senha) {
        echo json_encode(['status' => 'error', 'message' => 'Todos os campos obrigatórios devem ser preenchidos.']);
        return;
    }

    try {
        // Atualiza no banco de dados usando o modelo
        $jogador = new Jogador(); // Certifique-se de que o modelo Jogador está correto
        $jogador->atualizar([
            'id' => $_SESSION['usr']['id'], // ID do usuário logado
            'nome_completo' => $nome,
            'telefone' => $telefone,
            'email' => $email,
            'senha' => password_hash($senha, PASSWORD_DEFAULT), // Criptografa a senha
        ]);

        // Atualiza os dados na sessão
        $_SESSION['usr']['nome_completo'] = $nome;
        $_SESSION['usr']['telefone'] = $telefone;
        $_SESSION['usr']['email'] = $email;

        
        echo json_encode(['status' => 'success', 'message' => 'Dados atualizados com sucesso!']);
    } catch (\Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar os dados: ' . $e->getMessage()]);
    }
    }

}
