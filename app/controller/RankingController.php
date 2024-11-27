<?php

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

class RankingController
{
    public function index()
    {
        // Configuração do Twig
        $loader = new FilesystemLoader(__DIR__ . '/../view');
        $twig = new Environment($loader, [
            'cache' => false, // Sem cache para desenvolvimento
            'auto_reload' => true, // Recarregar templates automaticamente
        ]);

        // Dados fictícios de ranking (em um sistema real, seria carregado de um banco de dados)
        $ranking = [
            [
                'colocacao' => 1,
                'nome' => 'João Silva',
                'total_bombas' => 30,
                'vitorias' => 25,
                'derrotas' => 5,
                'tempo_total' => '15:32:45'
            ],
            [
                'colocacao' => 2,
                'nome' => 'Maria Souza',
                'total_bombas' => 25,
                'vitorias' => 20,
                'derrotas' => 10,
                'tempo_total' => '12:20:30'
            ],
            [
                'colocacao' => 3,
                'nome' => 'Carlos Pereira',
                'total_bombas' => 20,
                'vitorias' => 18,
                'derrotas' => 12,
                'tempo_total' => '10:15:20'
            ]
            // Adicione mais jogadores, se necessário
        ];

        // Renderiza a página ranking.html
        echo $twig->render('ranking.html', [
            'title' => 'Ranking Global',
            'ranking' => $ranking,
        ]);
    }
}
