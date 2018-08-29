<?
  session_start();
  // hook up database
  require ('indextyper_connect.php');

  $table = $_POST['table'];
  $column = $_POST['column'];
  $value = round($_POST['value']);

  $q = "SELECT avg_wpm
  FROM $table
  WHERE user_id={$_SESSION['user_id']}
  AND $column > $value;";
  $r = mysqli_query($dbc, $q);
  $count = mysqli_num_rows($r);
  if ($count == 0) {
    echo 'yes';
  } else {
    echo 'not a record';
  }
