<?php

	require_once 'app/core/Core.php';

	require_once 'lib/Database/Connection.php';

	require_once 'app/controller/CriarContaController.php';
	require_once 'app/controller/EditarCadastroController.php';
	require_once 'app/controller/RankingController.php';
	require_once 'app/controller/JogoController.php';
	require_once 'app/controller/IndexController.php';

	require_once 'app/model/Jogador.php';
    require_once 'app/model/Jogo.php';

	require_once 'vendor/autoload.php';

	$core = new Core;
	echo $core->start($_GET);