<?php
  session_start();
  $title = 'GhostType';
  include 'header.php';
  include 'ghosttype_passage_list.php';
  ?><div id="ghosttype_page_container"><?
  if (isset($_GET['selected_passage'])) { // display passage
    ?>
      <div id="top_3">
        <!-- graph segment -->
        <div id="graph" class="small_top segment">
          <canvas id="ghosttype_canvas"><!-- ghosttype.js takes care of canvas contents --></canvas>
        </div>
        <!-- errors segment -->
        <div id="errors" class="small_top segment">
          <p id="error_chars_ghosttype" style="margin: auto;">-</p>
          <p id="errors_label" class="label">Errors</p>
        </div>
        <!-- avg_wpm segment -->
        <div id="avg_wpm" class="small_top segment">
          <p id="ghosttype_wpm_label"></p>
          <p id="avg_wpm_p" class="value"></p>
          <p id="avg_wpm_label" class="label">Average words per minute</p>
        </div>
      </div><!-- top_3 -->
      <div id="left_2">
        <!-- target_wpm segment -->
        <div id="target_wpm_b" class="segment">
          <p id="target_wpm_p" class="value"><? if (isset($_GET['target_wpm'])) { echo $_GET['target_wpm']; } ?></p>
          <p id="target_label" class="label">Target words per minute</p>
        </div>
        <!-- ghost_wpm segment -->
        <div id="ghost_wpm_b" class="segment">
          <p id="ghost_wpm_p" class="value"><?

            $target_wpm = $_GET['target_wpm'];
            $target_cps = $target_wpm * 5 / 60; // 5 chars are 1 word and 60 seconds are one minute

            $total_chars = strlen($gp[$_GET['selected_passage']]);
            $total_time = $total_chars/$target_cps;

            $head_start = $_GET['head_start'];
            $actual_ghost_time = $total_time - $head_start;
            $ghost_cps = $total_chars/$actual_ghost_time;
            $ghost_wpm = round($ghost_cps * 60 / 5);

            echo $ghost_wpm;
          ?></p>
          <p id="ghost_label" class="label">Ghost's words per minute</p>
        </div>
      </div><!-- top_3 -->
      <div id="right_1">
        <!-- text spans -->
        <span id="blue" class="blue"></span><span id="green" class="green"></span><span id="speed" class="speed"></span><span id="red" class="red"></span><span id="black"><? echo $gp[$_GET['selected_passage']]; ?></span><br /><br />
        <!-- upon completion either-->
        <div id="caught" class="hide">
          <?
            echo "<a href=\"ghosttype.php?selected_passage={$_GET['selected_passage']}&target_wpm={$_GET['target_wpm']}&head_start={$_GET['head_start']}\">Try again</a><a href=\"ghosttype.php\">New passage</a>";
          ?>
        </div>
        <!-- or -->
        <div id="made_it" class="hide"><a href="ghosttype.php">New passage</a></div>
        <!-- save button -->
        <div id="save_ghosttype_passage_container" class="hide">
          <button id="save_ghosttype_passage_button">Save Performance</button>
        </div>
        <!-- tooltip button -->
        <div id="tooltip_ghosttype_checkbox_container">
            <button id="tooltip_ghosttype_checkbox">Average WPM over last 7 characters</button>
        </div>
      </div><!-- right_1 -->
      <input type="hidden" id="target_wpm" value="<? echo $target_wpm; ?>" />
      <!-- avg_wpm picked up from javascript variable -->
      <!-- graph_map picked up from javascript variable -->
      <input type="hidden" id="ghost_wpm" value="<? echo $ghost_wpm; ?>" />
      <input type="hidden" id="head_start" value="<? echo $head_start; ?>" />
      <!-- passage picked up from javascript variable -->
      <!-- performance id auto incremented -->
      <!-- date_saved created in php -->
      <!-- errors picked up from javascript variable -->
      <!-- user_id picked up from php Session -->
      <script src="ghosttype.js"></script>
    <?
  } else { // display passage selection
    ?>
      <form id="ghosttype_form" method="get" action="ghosttype.php">
        <p>After you start typing your passage, a ghost will start chasing you after a specified head-start (in seconds). The ghost's WPM will be calculated based on the head-start you specify and your target WPM. Finish your passage averaging at least your target WPM to beat the ghost.</p><br><br>
        <h3>Select a passage</h3>
        <div id="corralled_passages">
          <?
            for ($i = 0; $i < count($gp); $i++) {
              echo "<p id=\"passage_$i\" class=\"ghosttype_passage\">{$gp[$i]}</p>";
            }
          ?>
          <div style="clear: both;"></div>
        </div><!-- corralled_passages --><br />
        <input type="hidden" id="selected_passage" name="selected_passage" value="" />
        <label for="target_wpm">Target WPM: <br /><input name="target_wpm" id="target_wpm" type="number"/></label><br />
        <br />
        <label for="head_start">Head start:</label><br />
        <input name="head_start" type="number" id="head_start" min="2" max="" disabled/><br /><br />
        <input type="hidden" name="ghost_wpm" value="" />
        <input type="submit" value="Go" />
      </form><!-- ghosttype_form -->
      <script src="ghosttype_form.js"></script>
    <?
  }
  ?></div><!-- page_container -->

  <? include 'footer.php'; ?>
