<?php
  session_start();
  $title = 'Quicktype';
  $script = 'quicktype.js';
  include ('header.php');
  include ('quicktype_passage_list.php');
  ?>
  <div id="quicktype_page_container">
    <div id="quicktype_wrapper">
  <?
  if (isset($_POST['desired_wpm']) && $_POST['desired_wpm'] > 0) {
    ?>
      <table id="passage_table">
        <tr>
          <th>Passage</th>
          <th>Clock</th>
          <th>Average WPM</th>
          <th>completion<th>
        </tr>
    <?
    for ($i = 0; $i < count($qps); $i++) {
      echo '<tr id="section_' . $i . '" class="section">
          <td class="section_text">
            <span id="section_' . $i . '_green" class="green"></span><span id="section_' . $i . '_speed" class="speed"></span><span id="section_' . $i . '_red" class="red"></span><span id="section_' . $i . '_black" class="black">' . $qps[$i] . '</span>
          </td>
          <td id="countdown_' . $i . '" class="countdown section_square"></td>
          <td id="avg_wpm_' . $i . '" class="avg_wpm section_square">-</td>
          <td id="completion_' . $i . '" class="completion section_square">
            <img id="check_' . $i . '" src="check.svg" style="position:absolute;visibility:hidden;"/><img id="cross_' . $i . '" src="cross.svg" style="visibility:hidden;"/>
          </td>

        </tr>';
    }
    echo '</table>';
    echo '<button id="save_performance_button" class="save_performance_button">Save Performance</button>';
    echo '<input type="hidden" name="wanted_wpm" id="wanted_wpm" value="' . $_POST['desired_wpm'] . '" />';
  } else { // navigated to
    ?>
    <div id="welcome_box">
      <p>You'll be presented with 10 passages. Based on the speed you select, you'll be given a certain amount of time to complete each passage.</p><br />
      <form action="quicktype.php" method="post">
        <input type="number" name="desired_wpm" id="desired_wpm" size="60"/><label for="desired_wpm">  wpm </label>
        <input type="submit" value="Go" />
      </form>
    </div><!-- welcome_box -->
    <?
  }
  ?>
    </div><!-- quicktype_wrapper -->
  </div><!-- quicktype page container -->
  <?
  include ('footer.php');
