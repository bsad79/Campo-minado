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

    public function validateLogin()
    {
        $conn = Connection::getConn();
        // Selecionar o jogador com o email informado
        $sql = 'SELECT * FROM jogador WHERE email = :email';

        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':email', $this->email);
        $stmt->execute();

        if ($stmt->rowCount()) {
            $result = $stmt->fetch();

            // Verifica a senha (idealmente com hash)
            if (password_verify($this->senha, $result['senha'])) {
                $_SESSION['jogador'] = array(
                    'id' => $result['id'],
                    'nomeCompleto' => $result['nome_completo'],
                    'username' => $result['username']
                );

                return true;
            }
        }

        throw new \Exception('Login Inválido');
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
