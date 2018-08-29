<?
  session_start();
  $title = 'Analytics';
  $script = 'analytics_new.js';
  include ('header.php');
  include ('login_functions.inc.php');

  // check for credentials and bounce if needed
  if (!isset($_SESSION['agent']) OR ($_SESSION['agent'] != md5($_SERVER['HTTP_USER_AGENT']) )) {
    require ('login_functions.inc.php');
    redirect_user();
  }

  // pull in needed data from database
  // first name, last name, overall avg wpm

  require ('indextyper_connect.php');
  $q1 = "SELECT first_name, last_name
  FROM users
  WHERE user_id={$_SESSION['user_id']}";
  $r = mysqli_query($dbc, $q1);
  if ($r) {
    $row = mysqli_fetch_assoc($r);
  };

?><div id="act_wrapper">


    <div id="upper3">
      <h1 id="name_container" class="up3"><? echo "{$row['first_name']}<br />{$row['last_name']}"; ?></h1>
      <?

        // find average passage_performance wpm
        $q2 = "SELECT avg_wpm
        FROM passage_performances
        WHERE user_id={$_SESSION['user_id']}";
        $r = mysqli_query($dbc, $q2);
        if ($r) {
          $total = 0;
          while ($row = mysqli_fetch_array($r)) {
            $total += $row[0];
          }
          if (mysqli_num_rows($r) > 0) {
            $pp_average = $total/mysqli_num_rows($r); // found here
          }
        }

        // find average quicktype_performance wpm
        $q3 = "SELECT avg_wpm_all
        FROM quicktype_performances
        WHERE user_id={$_SESSION['user_id']}";
        $r = mysqli_query($dbc, $q3);
        if ($r) {
          $total = 0;
          while ($row = mysqli_fetch_array($r)) {
            $total += $row[0];
          }
          if (mysqli_num_rows($r) > 0) {
            $qp_average = $total/mysqli_num_rows($r); // found here
          }
        }

        $overall_average = round(($pp_average + $qp_average)/2); // calculated here
        $pp_average = round($pp_average);

      ?>

      <div class="up3"><h2 id="overall_average"><? echo "$overall_average"; ?></h2>
        <h4>Overall average words per minute</h4>
      </div>
      <div style="clear:both;"></div>
    </div><!-- upper3 -->


    <div id="passage_performance_graph">
      <h2 style="float:left;">Passage Performances</h3><h3 style="float: right;"><? echo "Avg passage wpm: $pp_average"; ?></h3><br><br>
      <div id="passage_canvas_container"><?

        // get data for the performance graph
        $q3 = "SELECT avg_wpm, date_saved
        FROM passage_performances
        WHERE user_id={$_SESSION['user_id']};";
        $r = mysqli_query($dbc, $q3);
        if ($r) {
          $passage_dates_array = [];
          $passage_values_array = [];
          while ($row = mysqli_fetch_array($r)) {
              $passage_dates_array[] = $row[1];
              $passage_values_array[] = $row[0];
          }
          $passage_dates_string = join(',', $passage_dates_array);
          $passage_values_string = join(',', $passage_values_array);
          echo "<input type=\"hidden\" id=\"passage_dates\" value=\"$passage_dates_string\" />";
          echo "<input type=\"hidden\" id=\"passage_values\" value=\"$passage_values_string\" />";
        }

      ?><canvas id="passage_performance_canvas"></canvas>
    </div>
  </div><!-- passage_performance_container -->
  <div id="top_passage_performances">
    <h3>Top performances</h3>
      <table id="passage_performances_table">
        <tr>
          <th>Rank</th>
          <th>Passage</th>
          <th>Average WPM</th>
          <th>Errors</th>
          <th>Date</th>
        </tr><?

      $q = "SELECT CONCAT(SUBSTR(passage, 1, 35), '...') AS passage, avg_wpm, errors, date_saved
      FROM passage_performances
      WHERE user_id={$_SESSION['user_id']}
      ORDER BY avg_wpm DESC LIMIT 10;";
      $r = mysqli_query($dbc, $q);
      if ($r) {
          // for each row
          $num = 1;
          while ($row = mysqli_fetch_array($r)) {
                echo "<tr class='row'>";
                echo "<td>{$num}</td>";
                echo "<td>{$row['passage']}</td>";
                echo "<td>{$row['avg_wpm']}</td>";
                echo "<td>{$row['errors']}</td>";
                $date = date('Y-m-d',$row['date_saved']);
                echo "<td>{$date}</td>";
                echo "</tr>";
                $num++;
          }
    } else { echo 'query failed'; };

      ?></table>
  </div><!-- top_passage_performances -->
  <div id="quicktype_performance_graph">
      <h2 style="float:left;">Quicktype Performances</h3><h3 style="float: right;"><? echo "Avg quicktype wpm: $qp_average"; ?></h3><br /><br />
      <div id="quicktype_canvas_container"><?

        // get data for the performance graph
        $q3 = "SELECT avg_wpm_all, date_saved
        FROM quicktype_performances
        WHERE user_id={$_SESSION['user_id']};";
        $r = mysqli_query($dbc, $q3);
        if ($r) {
          $quicktype_dates = [];
          $quicktype_values = [];
          while ($row = mysqli_fetch_array($r)) {
            $quicktype_dates[] = $row[1];
            $quicktype_values[] = $row[0];
          }
          $quicktype_dates_string = join(',',$quicktype_dates);
          $quicktype_values_string = join(',',$quicktype_values);
          echo "<input type=\"hidden\" id=\"quicktype_dates\" value=\"$quicktype_dates_string\" />";
          echo "<input type=\"hidden\" id=\"quicktype_values\" value=\"$quicktype_values_string\" />";
        } else { // query didn't work
          echo "query didn work";
        }

      ?><canvas id="quicktype_performance_canvas"></canvas>
    </div><!-- quicktype_canvas_container -->
</div><!-- quicktype_performance_table -->
  <div id="top_quicktype_performances">
    <h3>Top performances</h3>
      <table id="quicktype_performances_table">
        <tr>
          <th>Rank</th>
          <th>Target WPM</th>
          <th>Average WPM</th>
          <th>Number Right</th>
          <th>Date</th>
        </tr><?

      // pull all data and put into a multi-dimensional array
      $q = "SELECT target_wpm, avg_wpm_all, number_correct, date_saved
      FROM quicktype_performances
      WHERE user_id={$_SESSION['user_id']}
      ORDER BY avg_wpm_all DESC LIMIT 10;";
      $r = mysqli_query($dbc, $q);
      if ($r) {
          $num = 1;
          while ($row = mysqli_fetch_array($r)) {
                echo "<tr class='row'>";
                echo "<td>{$num}</td>";
                echo "<td>{$row['target_wpm']}</td>";
                echo "<td>{$row['avg_wpm_all']}</td>";
                echo "<td>{$row['number_correct']}</td>";
                $date = date('Y-m-d',$row['date_saved']);
                echo "<td>{$date}</td>";
                echo "</tr>";
                $num++;
          }
      } else { echo 'query didn\'t work' ; };

      ?></table>
  </div><!-- top_quicktype_performances -->
  <br /><br />

</div><!-- act_wrapper -->
<!-- <script src="quicktype_analytics.js"></script> -->
<? include ('footer.php'); ?>
