<?php

use Database\Connection;

class Jogo
{
    private $id;
    private $idJogador;
    private $nomeJogador;
    private $dimensoesCampo;
    private $quantidadeBombas;
    private $modalidadePartida;
    private $tempoGasto;
    private $resultado;
    private $dataHora;

    // Método para salvar um novo jogo no banco de dados
    public function salvar()
    {
        $conn = Connection::getConn();
        
        $sql = 'INSERT INTO jogo (
                    id_jogador, 
                    nome_jogador, 
                    dimensoes_campo, 
                    quantidade_bombas, 
                    modalidade_partida, 
                    tempo_gasto, 
                    resultado, 
                    data_hora
                ) VALUES (
                    :idJogador, 
                    :nomeJogador, 
                    :dimensoesCampo, 
                    :quantidadeBombas, 
                    :modalidadePartida, 
                    :tempoGasto, 
                    :resultado, 
                    :dataHora
                )';

        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':idJogador', $this->idJogador);
        $stmt->bindValue(':nomeJogador', $this->nomeJogador);
        $stmt->bindValue(':dimensoesCampo', $this->dimensoesCampo);
        $stmt->bindValue(':quantidadeBombas', $this->quantidadeBombas);
        $stmt->bindValue(':modalidadePartida', $this->modalidadePartida);
        $stmt->bindValue(':tempoGasto', $this->tempoGasto);
        $stmt->bindValue(':resultado', $this->resultado);
        $stmt->bindValue(':dataHora', $this->dataHora);

        if (!$stmt->execute()) {
            throw new \Exception('Erro ao salvar o jogo.');
        }

        return true;
    }

    // Método para buscar todos os jogos
    public static function buscarTodos()
    {
        $conn = Connection::getConn();

        $sql = 'SELECT * FROM jogo';
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // Método para buscar um jogo por ID
    public static function buscarPorId($id)
    {
        $conn = Connection::getConn();

        $sql = 'SELECT * FROM jogo WHERE id = :id';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // Setters
    public function setIdJogador($idJogador)
    {
        $this->idJogador = $idJogador;
    }

    public function setNomeJogador($nomeJogador)
    {
        $this->nomeJogador = $nomeJogador;
    }

    public function setDimensoesCampo($dimensoesCampo)
    {
        $this->dimensoesCampo = $dimensoesCampo;
    }

    public function setQuantidadeBombas($quantidadeBombas)
    {
        $this->quantidadeBombas = $quantidadeBombas;
    }

    public function setModalidadePartida($modalidadePartida)
    {
        $this->modalidadePartida = $modalidadePartida;
    }

    public function setTempoGasto($tempoGasto)
    {
        $this->tempoGasto = $tempoGasto;
    }

    public function setResultado($resultado)
    {
        $this->resultado = $resultado;
    }

    public function setDataHora($dataHora)
    {
        $this->dataHora = $dataHora;
    }

    // Getters
    public function getIdJogador()
    {
        return $this->idJogador;
    }

    public function getNomeJogador()
    {
        return $this->nomeJogador;
    }

    public function getDimensoesCampo()
    {
        return $this->dimensoesCampo;
    }

    public function getQuantidadeBombas()
    {
        return $this->quantidadeBombas;
    }

    public function getModalidadePartida()
    {
        return $this->modalidadePartida;
    }

    public function getTempoGasto()
    {
        return $this->tempoGasto;
    }

    public function getResultado()
    {
        return $this->resultado;
    }

    public function getDataHora()
    {
        return $this->dataHora;
    }
}
