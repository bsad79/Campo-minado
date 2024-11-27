<?php

namespace Database;

abstract class Connection
{
    private static $conn;

    public static function getConn()
    {
        if (!self::$conn) {
            try {
                self::$conn = new \PDO(
                    'mysql:host=campominado.chei0i0oqrr3.us-east-2.rds.amazonaws.com;dbname=campominado', 
                    'admin', 
                    ''
                );
                self::$conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
                echo "Conexão estabelecida com sucesso!";
            } catch (\PDOException $e) {
                die("Erro ao conectar ao banco de dados: " . $e->getMessage());
            }
        }

        return self::$conn;
    }
}
