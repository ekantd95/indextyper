<!DOCTYPE html>
<html lang="eng">
  <head>
    <title><?php echo $title ?></title>
    <meta charset="utf-8" />
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
    <link rel="stylesheet" type="text/css" href="indextyper.css" />

    <link href="https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i" rel="stylesheet">
  </head>
  <body<?
  if (basename($_SERVER['PHP_SELF']) == 'analytics.php') {
    echo " style=\"background-color: #01110A;\"";
  }
  ?>>
    <header>
      <nav>
        <ul id="left-nav">
          <li><a href="index.php"><p>Home</p></a></li>
          <li><a href="passage.php"><p>Passages</p></a></li>
          <li><a href="quicktype.php"><p>Quick Type</p></a></li>
          <li><a href="ghosttype.php"><p>Ghost Type</p></a></li>
            <?

            // if session exists and it isn't the logout page
              if ( (isset($_SESSION['user_id'])) && (basename($_SERVER['PHP_SELF']) != 'logout.php') ) {
                ?><div class="dropdown-container right">
                    <li class="right"><a id="customer_fn" href="#"><p><?

                    if (isset($_SESSION['first_name'])) {
                      echo $_SESSION['first_name'];
                    } else {
                      echo 'first name not set';
                    }

                    ?></p></a></li>
                    <ul class="dropdown-content">
                      <li><a href="logout.php"><p>Logout</p></a></li>
                      <li><a href="analytics.php"><p>Analytics</p></a></li>
                    </ul>
                  </div><?
              } else {
                echo "<li class=\"right\"><a href=\"login.php\"><p>Login</p></a></li>\n
                <li class=\"right\"><a href=\"user_registration.php\"><p>Register</p></a></li>";
              }

            ?>
          </div>
        </ul>
      </nav>
    </header>
    <body>
    <!-- Begin page specific content -->
