<?php

use Twig\Loader\FilesystemLoader;
use Twig\Environment;
use Database\Connection;

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

        // Busca os dados do banco de dados
        $ranking = $this->getRanking();

        // Renderiza a página ranking.html
        echo $twig->render('ranking.html', [
            'title' => 'Ranking Global',
            'ranking' => $ranking,
        ]);
    }

    private function getRanking()
    {
        $conn = Connection::getConn();

        $sql = "
            SELECT 
                nome_jogador AS nome,
                COUNT(CASE WHEN resultado = 'vitoria' THEN 1 END) AS vitorias,
                COUNT(CASE WHEN resultado = 'derrota' THEN 1 END) AS derrotas,
                SUM(tempo_gasto) AS tempo_total,
                SUM(quantidade_bombas) AS total_bombas
            FROM jogo 
            GROUP BY 
                1
            ORDER BY 
                vitorias DESC, tempo_total ASC; 
        ";

        $stmt = $conn->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }
}
