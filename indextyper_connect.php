<?php # indextyper_connect.php

  // Set credentials
  DEFINE ('DB_USER', '');
  DEFINE ('DB_PASSWORD', '');
  DEFINE ('DB_HOST', '');
  DEFINE ('DB_NAME', '');

  // Establish connection
  $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) OR die('Could not connect to MySql: ' . mysqli_connect_error() );
