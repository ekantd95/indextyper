<?php
session_start();
$errors = [];

// hook up database
require ('indextyper_connect.php');

if (
  isset($_POST['passage']) &&
  isset($_SESSION['user_id']) &&
  isset($_POST['avg_wpm_10']) &&
  isset($_POST['avg_wpm_all']) &&
  isset($_POST['target_wpm']) &&
  isset($_POST['number_correct'])
) {

  // assign variables and escape non-sql-friendly characters
  $ui = $_SESSION['user_id'];
  $passage = mysqli_real_escape_string($dbc, $_POST['passage']);
  $avg_wpm_10 = mysqli_real_escape_string($dbc, $_POST['avg_wpm_10']);
  $avg_wpm_all = mysqli_real_escape_string($dbc, $_POST['avg_wpm_all']);
  $target_wpm = mysqli_real_escape_string($dbc, $_POST['target_wpm']);
  $number_correct = mysqli_real_escape_string($dbc, $_POST['number_correct']);
  $date = time();// in seconds

  // compile and run query
  $q = "INSERT INTO quicktype_performances (passage, user_id, avg_wpm_10, avg_wpm_all, target_wpm, number_correct ,date_saved)
    VALUES ('$passage', '$ui', '$avg_wpm_10', '$avg_wpm_all', '$target_wpm', '$number_correct', '$date' )";
  $r = mysqli_query($dbc, $q);
  if ($r) {
    echo "yes";
  } else {
    $erra = mysqli_error($dbc);
    echo "<p>something wrong with query: $erra</p>";
  }

} else { // if all values weren't passed
  foreach ($errors as $error) {
    echo $error;
  };
}
