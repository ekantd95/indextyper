<? # script 12.3 - login.php
  if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    require ('login_functions.inc.php');
    require ('indextyper_connect.php');

    // validate
    list ($check, $data) = check_login($dbc, $_POST['email'], $_POST['pass']);

    if ($check) {
      // set session data
      session_start();
      $_SESSION['user_id'] = $data['user_id'];
      $_SESSION['first_name'] = $data['first_name'];
      // Store the HTTP_USER_AGENT
      $_SESSION['agent'] = md5($_SERVER['HTTP_USER_AGENT']);
      // redirect

      redirect_user('loggedin.php');
    } else {
      $errors = $data;
    }

    mysqli_close($dbc);

  } // server request method conditional

  $page_title = 'Login';
  include ('header.php');

  ?><div class="page_container" id="login_page_container"><?

  if (isset($errors) && !empty($errors)) {
    echo '<h3>Error!</h3>
    <p class="error">The following error(s) occured:<br />';
    foreach ($errors as $msg) {
      echo " - $msg<br />\n";
    }
    echo '</p><p>Please try again.</p>';
  }

?>
  <div class="form_container" id="form_container">
    <h1>Login</h1><br />
    <form class="site_form" action="login.php" method="post">
      <p>Email Address:<br /> <input type="text" name="email" size="20" maxlength="60" /></p><br />
      <p>Password:<br /> <input type="password" name="pass" size="20" maxlength="20" /></p><br /><br />
      <p><input type="submit" name="submit" value="Login"/></p>
    </form>
  </div><!-- form container -->
</div><!-- page container -->
<? include ('footer.php'); ?>
