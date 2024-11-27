<?php

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

class JogoController
{
    public function index()
    {
        // Configuração do Twig
        $loader = new FilesystemLoader(__DIR__ . '/../view');
        $twig = new Environment($loader, [
            'cache' => false, // Sem cache para desenvolvimento
            'auto_reload' => true, // Recarregar templates automaticamente
        ]);

        // Simular dados do histórico (isso pode vir de um banco de dados no futuro)
        $historico = [
            [
                'tempo' => '120 segundos',
                'configuracao' => '13x13',
                'modalidade' => 'Clássico',
                'resultado' => 'Vitória'
            ],
            [
                'tempo' => '98 segundos',
                'configuracao' => '10x10',
                'modalidade' => 'Rivotril',
                'resultado' => 'Derrota'
            ]
        ];

        // Renderizar a página do jogo
        echo $twig->render('jogo.html', [
            'title' => 'Campo Minado',
            'historico' => $historico,
        ]);
    }

    public function salvarPartida($dados)
    {
        // Simulação de salvamento no banco de dados
        $tempoPartida = $dados['tempo'] ?? '0 segundos';
        $configuracaoTabuleiro = $dados['configuracao'] ?? '13x13';
        $modalidadePartida = $dados['modalidade'] ?? 'Clássico';
        $resultado = $dados['resultado'] ?? 'Desconhecido';

        // Simular salvamento (a lógica real salvaria em um banco de dados)
        $partida = [
            'tempo' => $tempoPartida,
            'configuracao' => $configuracaoTabuleiro,
            'modalidade' => $modalidadePartida,
            'resultado' => $resultado
        ];

        // Retorna uma mensagem de sucesso (em um sistema real, redirecionaria ou retornaria JSON)
        return json_encode(['status' => 'success', 'message' => 'Partida salva com sucesso!', 'partida' => $partida]);
    }

    public function carregarHistorico()
    {
        // Simulação de carregamento de histórico do banco de dados
        $historico = [
            [
                'tempo' => '120 segundos',
                'configuracao' => '13x13',
                'modalidade' => 'Clássico',
                'resultado' => 'Vitória'
            ],
            [
                'tempo' => '98 segundos',
                'configuracao' => '10x10',
                'modalidade' => 'Rivotril',
                'resultado' => 'Derrota'
            ]
        ];

        // Retorna o histórico como JSON
        return json_encode($historico);
    }
}
