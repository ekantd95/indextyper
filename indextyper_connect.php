<?php # indextyper_connect.php

  // Set credentials
  DEFINE ('DB_USER', 'ekantd95_first');
  DEFINE ('DB_PASSWORD', 'fishtacos');
  DEFINE ('DB_HOST', 'localhost');
  DEFINE ('DB_NAME', 'ekantd95_indextyper');

  // Establish connection
  $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) OR die('Could not connect to MySql: ' . mysqli_connect_error() );
