<?php

namespace Database;

use PDO;
use PDOException;

class Connection
{
    private static $conn;

    public static function getConn()
    {
        if (!self::$conn) {
            try {
                self::$conn = new PDO(
                    'mysql:host=campominado.chei0i0oqrr3.us-east-2.rds.amazonaws.com;dbname=campominado',
                    'admin',
                    'admin123',
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    ]
                );
            } catch (PDOException $e) {
                // Retorna uma mensagem clara para o frontend
                echo json_encode(['status' => 'error', 'message' => 'Erro ao conectar ao banco de dados.']);
                exit(); // Interrompe o processamento
            }
        }

        return self::$conn;
    }
}
