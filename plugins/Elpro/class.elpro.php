<?php

//////////////////////////////////////////////////////////////////////////////80
// Template Class
//////////////////////////////////////////////////////////////////////////////80
// Copyright (c) 2020 Liam Siira (liam@siira.io), distributed as-is and without
// warranty under the MIT License. See [root]/license.md for more.
// This information must remain intact.
//////////////////////////////////////////////////////////////////////////////80
// Authors: Atheos Team, @hlsiira
//////////////////////////////////////////////////////////////////////////////80

class Elpro {

	//////////////////////////////////////////////////////////////////////////80
	// PROPERTIES
	//////////////////////////////////////////////////////////////////////////80
	private $activeUser = null;

	//////////////////////////////////////////////////////////////////////////80
	// METHODS
	//////////////////////////////////////////////////////////////////////////80

	// ----------------------------------||---------------------------------- //

	//////////////////////////////////////////////////////////////////////////80
	// Construct
	//////////////////////////////////////////////////////////////////////////80
	public function __construct($activeUser) {
		$this->activeUser = $activeUser;
		// Imposta i parametri della richiesta
		$user_id = $activeUser;
		$access_token = "abcd1234567890";
		$secret = "my-secret";

		// Crea una richiesta HTTP
		$request = curl_init("localhost:8025/atheos_login");

		// Imposta la richiesta come POST
		curl_setopt($request, CURLOPT_POST, 1);

		// Imposta i parametri della richiesta
		curl_setopt($request, CURLOPT_POSTFIELDS, "user_id=$user_id&access_token=$access_token&secret=$secret");

		// Imposta la richiesta come sicura
		curl_setopt($request, CURLOPT_SSL_VERIFYPEER, false);

		// Esegui la richiesta
		$response = curl_exec($request);

		// Controlla il codice di stato della risposta
		$statusCode = curl_getinfo($request, CURLINFO_HTTP_CODE);

		// Se il codice di stato è 200, la richiesta è riuscita
		if ($statusCode == 200) {

			// Stampa il corpo della risposta
			echo "200ok";

		} else {

			// La richiesta non è riuscita
			echo "La richiesta non è riuscita. Codice di stato: $statusCode";

		}



	}

	public function test()
	{
       return "ciao";
	}

}