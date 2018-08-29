<?php
  session_start();
  $title = 'Register';
  include 'header.php';
  include 'functions.php';
  $script = 'login.js';
  echo "<div id=\"registration_page_container\">";

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

      // connect
      require ('indextyper_connect.php');

      $errors = array();

      // Validate first name
      if (empty($_POST['first_name'])) {
        $errors[] = 'You forgot to enter your first name.';
      } else {
        $fn = mysqli_real_escape_string($dbc, trim($_POST['first_name']));
      }

      // Validate last_name
      if (empty($_POST['last_name'])) {
        $errors[] = 'You forgot to enter your last name.';
      } else {
        $ln = mysqli_real_escape_string($dbc, trim($_POST['last_name']));
      }

      // Validate email
      if (!empty($_POST['email'])) {

        $e = mysqli_real_escape_string($dbc, trim($_POST['email']));

        // make sure email doesn't already exist
        $eq = "SELECT user_id FROM users WHERE email='$e'";
        $r = mysqli_query($dbc, $eq);
        if (mysqli_num_rows($r) > 0) {
          $errors[] = 'Selected email alredy exists';
        }

      } else { // empty field
        $errors[] = 'You forgot to enter your email.';
      }


      // Validate the passwords
      if (!empty($_POST['pass1'])) {
        if ($_POST['pass1'] != $_POST['pass2']) {
          $errors[] = 'Your password did not match the confirmed password.';
        } else {
          $p = mysqli_real_escape_string($dbc, trim($_POST['pass1']));
        }
      } else {
        $errors[] = 'You forgot to enter your password.';
      }

      if (empty($errors)) {


        // Compile query
        $q = "INSERT INTO users (first_name, last_name, email, pass, registration_date)
          VALUES ('$fn', '$ln', '$e', SHA1('$p'), NOW() )";

        // Submit/set equal to $r
        $r = @mysqli_query($dbc, $q);


        if ($r) {
          echo '<div id="registered_page_container"><p>You are now registered!</p></div>';
        } else {
          echo '<h1>System Error</h1>
          <p class="error">You could not be registered due to a system error. We apologize for any inconvenience.</p>';
          echo '<p>' . mysqli_error($dbc) . '<br /><br />Query: ' . $q . '</p>';
        } // End of if ($r) IF

        mysqli_close($dbc);
        include('footer.php');
        exit();

      } else { // if any errors popped up
        echo '<h1>Error!</h1>
        <p class="error">The following error(s) occured:<br />';
        foreach ($errors as $msg) {
          echo " - $msg<br />\n";
        }
        echo '</p><p><br /></p>';
      } // End of empty($errors) if

      mysqli_close($dbc);

    } // End of main submit

    ?>
    <div class="form_container">
      <h1>Register</h1><br />
      <form class="site_form" id="registration_form" action="user_registration.php" method="post">
        <p>First Name:
          <br />
          <input type="text" id="first_name" name="first_name" size="15" maxlength="20" value="<?php if (isset($_POST['first_name'])) echo $_POST['first_name']; ?>" />
          <img src="check.svg" class="up" id="first_name_check" />
          <img src="cross.svg" id="first_name_cross" />
        </p><br />
        <p>Last Name:
          <br />
          <input type="text" id="last_name" name="last_name" size="40" maxlength="20" value="<?php if (isset($_POST['last_name'])) echo $_POST['last_name']; ?>"/>
          <img src="check.svg" class="up" id="last_name_check" />
          <img src="cross.svg" id="last_name_cross" />
        </p><br />
        <p>Email Address:
          <br />
          <input type="text" id="email" name="email" size="20" maxlength="60" value="<?php if (isset($_POST['email'])) echo $_POST['email']; ?>" />
          <img src="check.svg" class="up" id="email_check" />
          <img src="cross.svg" id="email_cross" />
        </p><br />
        <p>Password:
          <br />
          <input type="password" id="pass1" name="pass1" size="10" maxlength="20" value="<?php if (isset($_POST['pass1'])) echo $_POST['pass1']; ?>" />
          <img src="check.svg" class="up" id="pass1_check" />
          <img src="cross.svg" id="pass1_cross" />
        </p><br />
        <p>Confirm Password:
          <br />
          <input type="password" id="pass2" name="pass2" size="10" maxlength="20" value="<?php if (isset($_POST['pass2'])) echo $_POST['pass2']; ?>" />
          <img src="check.svg" class="up" id="pass2_check" />
          <img src="cross.svg" id="pass2_cross" />
        </p><br /><br />
        <p><input type="submit" id="register" name="submit" value="Register" disabled="true"/></p>
      </form>
    </div>
  </div><!-- user registration page container -->
  <?php include ('footer.php'); ?>
