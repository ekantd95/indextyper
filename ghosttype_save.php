<?php
session_start();
// hook up database
require ('indextyper_connect.php');

$response_errors = [];
// check if data arrived
if ( isset($_POST['target_wpm']) ) {
  $target_wpm = mysqli_real_escape_string($dbc, $_POST['target_wpm']);
} else {
  $response_errors[] = "target wpm,";
}

if ( isset($_POST['avg_wpm']) ) {
  $avg_wpm = mysqli_real_escape_string($dbc, $_POST['avg_wpm']);
} else {
  $response_errors[] = "avg_wpm,";
}

if ( isset($_POST['graph_map']) ) {
  $graph_map = mysqli_real_escape_string($dbc, $_POST['graph_map']);
} else {
  $response_errors[] = "graph_map,";
}

if ( isset($_POST['ghost_wpm']) ) {
  $ghost_wpm = mysqli_real_escape_string($dbc, $_POST['ghost_wpm']);
} else {
  $response_errors[] = "ghost_wpm,";
}

if ( isset($_POST['head_start']) ) {
  $head_start = mysqli_real_escape_string($dbc, $_POST['head_start']);
} else {
  $response_errors[] = "head_start,";
}

if ( isset($_POST['passage']) ) {
  $passage = mysqli_real_escape_string($dbc, $_POST['passage']);
} else {
  $response_errors[] = "passage,";
}

if ( isset($_POST['errors']) ) {
  $errors = mysqli_real_escape_string($dbc, $_POST['errors']);
} else {
  $response_errors[] = "errors";
}

if ( isset($_SESSION['user_id']) ) {
  $user_id = mysqli_real_escape_string($dbc, $_SESSION['user_id']);
} else {
  $response_errors[] = "user_id";
}

$date_saved = time();

if (empty($response_errors)) {

  // compile and run query
  $q = "INSERT INTO ghosttype_performances (target_wpm, avg_wpm, graph_map, ghost_wpm, head_start, passage, date_saved, errors, user_id)
    VALUES ('$target_wpm', '$avg_wpm', '$graph_map', '$ghost_wpm', '$head_start', '$passage', '$date_saved', '$errors', '$user_id')";
  $r = mysqli_query($dbc, $q);
  if ($r) {
    echo "yes";
  } else {
    echo "something wrong with query";
  }

} else { // if all values weren't passed
  for ($i = 0; $i < count($response_errors); $i++) {
    $echo = $response_errors[$i];
    echo $echo;
  }
}



// // check if data arrived
// if (
// isset($_POST['target_wpm']) &&
// isset($_SESSION['avg_wpm']) &&
// isset($_POST['graph_map']) &&
// isset($_POST['ghost_wpm']) &&
// isset($_POST['head_start']) &&
// isset($_POST['passage']) &&
// // performance id auto incremented
// // date_saved generated in php
// isset($_POST['errors'])
// // user_id picked up from session
// )


// // pull values into variables
// $target_wpm = mysqli_real_escape_string($dbc, $_POST['target_wpm']);
// $avg_wpm = mysqli_real_escape_string($dbc, $_POST['avg_wpm']);
// $graph_map = mysqli_real_escape_string($dbc, $_POST['graph_map']);
// $ghost_wpm = mysqli_real_escape_string($dbc, $_POST['ghost_wpm']);
// $head_start = mysqli_real_escape_string($dbc, $_POST['head_start']);
// $passage = mysqli_real_escape_string($dbc, $_POST['passage']);
// // performance id auto incremented
// $date_saved = time();
// $errors = mysqli_real_escape_string($dbc, $_POST['errors']);
// $user_id = mysqli_real_escape_string($dbc, $_SESSION['user_id']);
