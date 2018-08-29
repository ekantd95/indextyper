window.addEventListener('load', function() {

  var current_section = 0;
  var mainstring = document.getElementById('section_' + current_section + '_black').innerHTML;
  var error_number = 0;
  var text_iterator = 0;
  var error_iterator = 0;
  var error_index = 0;
  var key_stamps = [];
  var tall_box_id;
  var fishfry;
  var avg_wpm;
  var avg_wpm_10_array = [];
  var mainstring_10_array = [];
  var number_correct = 0;

  function alter_text() {
      text_iterator++;
      var greentext = mainstring.slice(0,text_iterator);
      var blacktext = mainstring.slice(text_iterator, 1000);
      document.getElementById('section_' + current_section + '_green').innerHTML = greentext;
      document.getElementById('section_' + current_section + '_black').innerHTML = blacktext;
  }

  function error_display() {
    error_index = text_iterator + error_iterator;
    var greentext = mainstring.slice(0,text_iterator);
    var redtext = mainstring.slice(text_iterator, error_index);
    var blacktext = mainstring.slice(error_index, 1000);
    document.getElementById('section_' + current_section + '_green').innerHTML = greentext;
    document.getElementById('section_' + current_section + '_red').innerHTML = redtext;
    document.getElementById('section_' + current_section + '_black').innerHTML = blacktext;
  }

  function advance_tooltip() {

    // set tooltip height
    var new_top = document.getElementById('section_' + current_section + '_green').offsetHeight;
    document.getElementById('section_' + current_section + '_speed').top = + new_top + 'px';

    // once 8 characters have been typed update the tooltip
    if (text_iterator > 8) {

      time_in_seconds = ( key_stamps[text_iterator-1] - key_stamps[(text_iterator - 8)] )/1000;
      var chars_per_second = 7/time_in_seconds;
      var words_per_minute = chars_per_second * 12;

      // Update tooltip
      if (text_iterator % 3 == 0) {
        // document.getElementById('speed').style.visibility = 'visible';
        document.getElementById('section_' + current_section + '_speed').innerHTML = words_per_minute.toFixed(0);

      } // on every third
    } // once iterator gets to 8
  } // end of advance_tooltip

  function update_average() {
    if (text_iterator % 3 == 0) {
      var total_time_in_seconds = (key_stamps[text_iterator-1] - key_stamps[0])/1000;
      var total_chars = text_iterator;
      avg_wpm = Math.round(total_chars/total_time_in_seconds * 12);
      document.getElementById('avg_wpm_' + current_section).innerHTML = avg_wpm;
    } // on every third
    // update avg_wpm_10 everytime a passage completes
    if (text_iterator == mainstring.length) {
      avg_wpm_10_array.push(avg_wpm);
    }

  } // end of update average

  function success() {
    // mark the time
    key_stamps.push( new Date().getTime() );
    error_iterator = 0;
    alter_text();
    advance_tooltip();
    update_average();
  }

  function incorrect() {
    error_iterator++;
    error_display();
  }

  function special_validate(special) {
    if ( mainstring.charAt(text_iterator) == special && error_iterator == 0 ) {
      success();
    } else {
      incorrect();
    }
  }

  function save_performance() {
    // avg wpm's for all 10
    var avg_wpm_10 = avg_wpm_10_array.join();


    // average of all 10
    var total = 0;
    for (var i = 0; i < avg_wpm_10_array.length; i++) {
      total += (avg_wpm_10_array[i]);

    }
    var average = total / avg_wpm_10_array.length;

    // target wpm
    var target_wpm = document.getElementById('wanted_wpm').value;

    var mainstring_10 = sections.join();

    var ajax = getXMLHttpRequestObject();

    ajax.open('POST', 'quicktype_save.php', true);
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var data = 'target_wpm=' + target_wpm +
    '&avg_wpm_10=' + avg_wpm_10 +
    '&avg_wpm_all=' + average +
    '&passage=' + mainstring_10 +
    '&number_correct=' + number_correct;
    ajax.send(data);

    // once the ready state  of the ajax object changes
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4) {
        if ((ajax.status >= 200 && ajax.status < 300) || (ajax.status == 304)) {
          if (ajax.responseText == 'yes') {
            // disable button
            document.getElementById('save_performance_button').innerHTML = 'Saved successfully';
            document.getElementById('save_performance_button').disabled = 'disabled';
            document.getElementById('save_performance_button').className = 'save_performance_complete';
          } else {
            document.getElementById('save_performance_button').innerHTML = ajax.responseText;
          }
        }
      } // ready state not equal 4
    }; // end of onreadystatechange function
  } // end of save_performance



  function character_validate(e) {

    var inputCharacter = String.fromCharCode(e.keyCode).toLowerCase();

    if (e.which === 222) {
        e.preventDefault();
    }

    // check if the characters match
    if (inputCharacter == mainstring.charAt(text_iterator).toLowerCase()) {

      // if character being verified against is lower case
      if ( (mainstring.charAt(text_iterator).toLowerCase() == mainstring.charAt(text_iterator)) && (error_iterator == 0) ) {
        if (e.shiftKey) {
          incorrect();
        } else {
          success();
        }
      } else { // the character is upper case
        if (e.shiftKey) {
          success();
        } else {
          incorrect();
        }
      } // character is upper case else

    } else {
      switch(e.which) {
        case 8:
          if (error_iterator !== 0) {
            error_iterator--;
            error_display();
          }
          break;
        case 16: case 20: case 17: case 18: case 91: case 93: case 40:
          console.log('fishfry');
          break;
        case 188:
          special_validate(',');
          break;
        case 190:
          special_validate('.');
          break;
        case 222:
          e.preventDefault();
          special_validate('\'');
          break;
        case 32:
          e.preventDefault();
          break;
        default:
          incorrect();
      } // end of switch
    } // end of original if characters match if

    // to prevent backspace from flipping back a page
    var elm = e.target.nodeName.toLowerCase();
    if (e.which === 8 && (elm !== 'input' && elm  !== 'textarea')) {
        e.preventDefault();
    }

    // to prevent backspace from flipping back a page
    var elm = e.target.nodeName.toLowerCase();
    if (e.which === 9 && (elm !== 'input' && elm  !== 'textarea')) {
        e.preventDefault();
    }

    // stopping event bubbling up the DOM tree..
    e.stopPropagation();

    // when a section is completed
    if (text_iterator == mainstring.length) {
      number_correct++;
      clearInterval(fishfry);
      document.getElementById('check_' + current_section).style.visibility = 'visible';
      text_iterator = 0;
      current_section++;

      // after completion of all passages
      if (current_section == 10 && document.getElementById('customer_fn')) {
        document.getElementById('save_performance_button').style.display = 'block';
      }

      key_stamps.length = 0;
      if (current_section !== 10) {
        mainstring = document.getElementById('section_' + current_section + '_black').innerHTML;
      }
    }

    // set timer on completion of first character
    if (text_iterator == 1 && error_iterator == 0 && e.which !== 8){
      fishfry = window.setInterval(function() {
        var time_on_clock = document.getElementById('countdown_' + current_section).innerHTML;
        time_on_clock -= 1;
        document.getElementById('countdown_' + current_section).innerHTML = time_on_clock;
        if (time_on_clock == 0) { // if time runs out
          avg_wpm_10_array.push(avg_wpm);
          clearInterval(fishfry);
          document.getElementById('cross_' + current_section).style.visibility = 'visible';
          current_section++;
          text_iterator = 0;
          key_stamps.length = 0;
          if (current_section !== 10) {
            mainstring = document.getElementById('section_' + current_section + '_black').innerHTML
          }
          // after completion of all passages
          if (current_section == 10 && document.getElementById('customer_fn')) {
            document.getElementById('save_performance_button').style.display = 'block';
          }

        }
      }, 1000);
    }

  } // character validate event listener

  document.addEventListener('keydown', character_validate, false);

  document.getElementById('save_performance_button').addEventListener('click', save_performance, false);

    // retrieve all section strings
    var sections = [];
    for (var i = 0; i < 10; i ++) {
      sections.push(document.getElementById('section_' + i + '_black').innerHTML);
    };
    // calculate timer amounts and set to various timers
    for (var i = 0; i < sections.length; i++) {
      var wanted_wpm = document.getElementById('wanted_wpm').value;
      var seconds = Math.round( sections[i].length / ((wanted_wpm * 5)/60) );
      document.getElementById('countdown_' + i).innerHTML = '' + seconds;
    }

}, false); // onload function
