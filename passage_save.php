<?php
session_start();
// hook up database
require ('indextyper_connect.php');


// check if data arrived
if (
isset($_POST['passage']) &&
isset($_SESSION['user_id']) &&
isset($_POST['avg_wpm']) &&
isset($_POST['wpmover7']) &&
isset($_POST['errors'])
) {

  // pull values into variables
  $p = mysqli_real_escape_string($dbc, $_POST['passage']);
  $ui = mysqli_real_escape_string($dbc, $_SESSION['user_id']);
  $avg_wpm = mysqli_real_escape_string($dbc, $_POST['avg_wpm']);
  $wpmover7 = mysqli_real_escape_string($dbc, $_POST['wpmover7']);
  $errors = mysqli_real_escape_string($dbc, $_POST['errors']);
  $date = time(); // in seconds

  // compile and run query
  $q = "INSERT INTO passage_performances (passage, user_id, avg_wpm, wpmover7, errors, date_saved)
    VALUES ('$p', '$ui', '$avg_wpm', '$wpmover7', '$errors', '$date')";
  $r = mysqli_query($dbc, $q);
  if ($r) {
    echo "yes";
  } else {
    echo "something wrong with query";
  }

} else { // if all values weren't passed
  echo "values not present";
}
