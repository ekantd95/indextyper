<? # script 12.4 - loggedin.php

  session_start();

  if (!isset($_SESSION['agent']) OR ($_SESSION['agent'] != md5($_SERVER['HTTP_USER_AGENT']) )) {
    require ('login_functions.inc.php');
    redirect_user();
  }

  $page_title = 'Logged In!';
  include ('header.php');

  ?><div id="loggedin_page_container">
      <div id="loggedin">
        <p>You are now logged in, <?echo $_SESSION['first_name']; ?>!</p>
      </div>
    </div><?



  include ('footer.php');
?>
