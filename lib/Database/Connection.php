<?php

// Configurações de conexão ao RDS
$host = 'campominado.chei0i0oqrr3.us-east-2.rds.amazonaws.com'; 
$port = 3306; 
$dbname = 'campominado'; 
$username = 'admin'; 
$password = ''; 

try {

    $dsn = "mysql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    echo "Conexão bem-sucedida ao banco de dados RDS!";

    // Teste: Exemplo de consulta
    $query = $pdo->query('SELECT NOW() AS data_atual');
    $result = $query->fetch();
    echo "Data atual do servidor: " . $result['data_atual'];

} catch (PDOException $e) {
    // Erro ao conectar ao banco de dados
    echo "Erro ao conectar ao banco de dados: " . $e->getMessage();
}
