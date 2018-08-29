<?php
  session_start();
  $title = 'Passages';
  $script = 'passage.js';
  include 'header.php';
  include 'passages_list.php';
  ?><div id="passage_page_container"><?
  if (isset($_GET['selected_passage'])) { // page accessed through selecting a passage
    ?>
      <!-- left box -->
      <div id="text-container">
        <span id="green" class="green"></span><span id="speed" class="speed"></span><span id="red" class="red"></span><span id="black"><?
            echo $passages[$_GET['selected_passage']];
        ?></span>
        <div id="save_passage_container">
          <button id="save_passage_button" class="save_passage_button">Save Performance</button>
        </div>

        <div id="tooltip_checkbox_container">
            <button id="tooltip_checkbox" class="button">Average WPM over last 7 characters</button>
        </div>
      </div>
      <!-- end of left box -->

      <!-- right box -->
      <div id="right_box">

        <div class="square" id="avg_cps_container">
          <p id="passage_wpm_label"></p>
          <p id="average_output"></p>
          <p id="passage_avg_wpm_label">Words per minute</p>
        </div>

        <div class="square" id="current_cps_container">
          <div id="fifth_container">
            <div class="fifth" id="fifth1"></div>
            <div class="fifth" id="fifth2"></div>
            <div class="fifth" id="fifth3"></div>
            <div class="fifth" id="fifth4"></div>
            <div class="fifth" id="fifth5"></div>
          </div>
          <canvas id="canvas"></canvas>
        </div>

        <div class="square" id="error_chars">
          <h3 style="text-align: center;" id="error_title">Errors</h3>
        </div>

      </div>
      <!-- end of right box -->
    <?
  } else { // page accessed through nav link so display all passages
    ?>
      <h3>Select a passage</h3>
      <div id="select_passage_container">
        <br />
        <?
          for ($i = 0; $i < count($passages); $i++) {
            echo '<a href="passage.php?selected_passage=' . $i . '" class="sample_passage" id="passage_' . $i . '">' . $passages[$i] . '</a>';
          }
        ?>
      </div><!-- select passage container -->

    <?
  }
echo "</div><!-- passage_page_container -->";
include 'footer.php';
