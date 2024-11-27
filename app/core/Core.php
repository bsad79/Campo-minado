<?php

class Core
{
    private $url;
    private $controller;
    private $method = 'index';
    private $params = [];
    private $user;
    private $error;

    public function __construct()
    {
        // Inicia sessão e verifica se o usuário está logado
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        if (isset($_GET['logout']) && $_GET['logout'] === 'true') {
            session_unset(); // Remove todas as variáveis de sessão
            session_destroy(); // Destroi a sessão ativa
    
            // Redireciona para a página de login após logout
            header('Location: ?url=Index/index');
            exit();
        }

        $this->user = $_SESSION['usr'] ?? null;
        $this->error = $_SESSION['msg_error'] ?? null;

        // Gerencia exibição de mensagens de erro
        if (isset($this->error)) {
            if ($this->error['count'] === 0) {
                $_SESSION['msg_error']['count']++;
            } else {
                unset($_SESSION['msg_error']);
            }
        }
    }

    public function start($request)
    {
        // Processa a URL e define controlador, método e parâmetros
        if (isset($request['url'])) {
            $this->url = explode('/', $request['url']);

            $this->controller = ucfirst($this->url[0]) . 'Controller';
            array_shift($this->url);

            if (isset($this->url[0]) && $this->url[0] != '') {
                $this->method = $this->url[0];
                array_shift($this->url);

                if (isset($this->url[0]) && $this->url[0] != '') {
                    $this->params = $this->url;
                }
            }
        }

        // Gerenciamento de permissões
        if ($this->user) {
            // Usuário autenticado
            $pg_permission = ['JogoController', 'RankingController', 'EditarCadastroController'];

            if (!isset($this->controller) || !in_array($this->controller, $pg_permission)) {
                $this->controller = 'JogoController';
                $this->method = 'index';
            }
        } else {
            // Usuário não autenticado
            $pg_permission = ['IndexController', 'CriarContaController'];

            if (!isset($this->controller) || !in_array($this->controller, $pg_permission)) {
                $this->controller = 'IndexController';
                $this->method = 'index';
            }
        }

        // Verifica se o controlador e método existem antes de chamá-los
        if (class_exists($this->controller)) {
            $controller = new $this->controller;
        
            if (method_exists($controller, $this->method)) {
                call_user_func_array([$controller, $this->method], $this->params);
            } else {
                throw new Exception("Método {$this->method} não encontrado.");
            }
        } else {
            throw new Exception("Controlador {$this->controller} não encontrado.");
        }
        
        
    }
}
