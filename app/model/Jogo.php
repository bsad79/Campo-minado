<?php

namespace App\Model;

use Database\Connection;

class Jogo
{
    public function saveGame($data)
    {
        $conn = Connection::getConn();

        $sql = 'INSERT INTO jogo 
                (id_jogador, nome_jogador, dimensoes_campo, quantidade_bombas, modalidade_partida, tempo_gasto, resultado, data_hora)
                VALUES 
                (:id_jogador, :nome_jogador, :dimensoes_campo, :quantidade_bombas, :modalidade_partida, :tempo_gasto, :resultado, :data_hora)';

        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id_jogador', $data['id_jogador']);
        $stmt->bindValue(':nome_jogador', $data['nome_jogador']);
        $stmt->bindValue(':dimensoes_campo', $data['dimensoes_campo']);
        $stmt->bindValue(':quantidade_bombas', $data['quantidade_bombas']);
        $stmt->bindValue(':modalidade_partida', $data['modalidade_partida']);  
        $stmt->bindValue(':tempo_gasto', $data['tempo_gasto']);
        $stmt->bindValue(':resultado', $data['resultado']);
        $stmt->bindValue(':data_hora', $data['data_hora']);

        if (!$stmt->execute()) {
            $error = $stmt->errorInfo();
            throw new \Exception('Erro ao salvar o jogo: ' . $error[2]);
        }

        return true;
    }

    public function buscarHistoricoPorJogador($idJogador){
        $conn = Connection::getConn();

        $sql = 'SELECT dimensoes_campo, quantidade_bombas, modalidade_partida, tempo_gasto, resultado, data_hora 
                FROM jogo 
                WHERE id_jogador = :idJogador
                ORDER BY data_hora DESC';

        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':idJogador', $idJogador, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
