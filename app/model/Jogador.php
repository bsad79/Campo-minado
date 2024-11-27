<?php

use Database\Connection;

class Jogador
{
    private $id;
    private $nomeCompleto;
    private $dataNascimento;
    private $cpf;
    private $telefone;
    private $email;
    private $username;
    private $senha;

    public function createPlayer($data)
    {
        $conn = Connection::getConn();

        // Verifica duplicidade
        if ($this->checkDuplicate('cpf', $data['cpf'])) {
            throw new \Exception('CPF ja está em uso.');
        }

        if ($this->checkDuplicate('email', $data['email'])) {
            throw new \Exception('Email ja está em uso.');
        }

        if ($this->checkDuplicate('username', $data['username'])) {
            throw new \Exception('Username ja está em uso.');
        }

        $sql = 'INSERT INTO jogador (nome_completo, data_nascimento, cpf, telefone, email, username, senha) 
                VALUES (:nome, :data_nascimento, :cpf, :telefone, :email, :username, :senha)';

        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':nome', $data['name']);
        $stmt->bindValue(':data_nascimento', $data['data-nascimento']);
        $stmt->bindValue(':cpf', $data['cpf']);
        $stmt->bindValue(':telefone', $data['telefone']);
        $stmt->bindValue(':email', $data['email']);
        $stmt->bindValue(':username', $data['username']);
        $stmt->bindValue(':senha', password_hash($data['senha'], PASSWORD_DEFAULT));

        $stmt->execute();
    }

    public function validateLogin($username, $password){
        $conn = Connection::getConn();

        $sql = 'SELECT * FROM jogador WHERE username = :username';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':username', $username);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            throw new \Exception('Usuário ou senha inválidos.');
        }

        $result = $stmt->fetch();

        if (password_verify($password, $result['senha'])) {
            unset($result['senha']); // Remove a senha para segurança
            return $result;
        }

        throw new \Exception('Usuário ou senha inválidos.');
    }



    public function checkDuplicate($field, $value){
        $conn = Connection::getConn();

        $sql = "SELECT COUNT(*) as count FROM jogador WHERE $field = :value";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':value', $value);
        $stmt->execute();

        $result = $stmt->fetch();
        return $result['count'] > 0;
    }


    public function setNomeCompleto($nomeCompleto)
    {
        $this->nomeCompleto = $nomeCompleto;
    }

    public function setDataNascimento($dataNascimento)
    {
        $this->dataNascimento = $dataNascimento;
    }

    public function setCpf($cpf)
    {
        $this->cpf = $cpf;
    }

    public function setTelefone($telefone)
    {
        $this->telefone = $telefone;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function setUsername($username)
    {
        $this->username = $username;
    }

    public function setSenha($senha)
    {
        $this->senha = $senha;
    }

    public function getNomeCompleto()
    {
        return $this->nomeCompleto;
    }

    public function getDataNascimento()
    {
        return $this->dataNascimento;
    }

    public function getCpf()
    {
        return $this->cpf;
    }

    public function getTelefone()
    {
        return $this->telefone;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function getSenha()
    {
        return $this->senha;
    }
}
