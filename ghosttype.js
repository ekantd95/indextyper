window.addEventListener('load', function () {

  // typing variables
  var error_number = 0;
  var text_iterator = 0;
  var error_iterator = 0;
  var error_index = 0;
  var blue_iterator;
  var mainstring = document.getElementById('black').innerHTML;
  var key_stamps = [];
  var tall_box_id;
  var graph = [];
  var avg_wpm;
  var ghost;

  // graph variables
  var width = document.getElementById('ghosttype_canvas').clientWidth;
  var height = document.getElementById('ghosttype_canvas').clientHeight;
  var y_lab_width = .06 * width;
  var graph_width = 0.94 * width;
  var graph_height = height;
  var vertical_unit = graph_height/250;

  // initialize the x-coordinate and set tick distance
  var tick_distance = graph_width/mainstring.length;
  var x_coordinate = y_lab_width;

  // General
  var canvas = document.getElementById('ghosttype_canvas');
  var c = canvas.getContext('2d');
  canvas.width = width * 2;
  canvas.height = height * 2;
  c.scale(2,2);

  // set up canvas
  function setup_canvas() {
    // update vertical_unit
    vertical_unit = height/250;

    // draw scale lines
    var label_height = 228 * vertical_unit;
    for (var i = 1; i < 10; i++) {
      c.beginPath();
      c.moveTo(y_lab_width,(graph_height - ((25 * vertical_unit) * i) )) ;
      c.lineTo(width, graph_height - ((25 * vertical_unit) * i));
      c.fillStyle = '';
      c.strokeStyle = '#f9e7d6';
      c.lineWidth = 1;
      c.stroke();

      // y-axis labels
      c.font = "10px Montserrat";
      c.fillStyle = '#f9e7d6';
      c.textAlign = 'right';
      c.fillText(25 * i, y_lab_width - 9, label_height);
      label_height -= (25 * vertical_unit);
    }
  } // end of setup_canvas()
  setup_canvas();

  function update_graph() {
    time_in_seconds = ( key_stamps[text_iterator-1] - key_stamps[(text_iterator - 8)] )/1000;
    var chars_per_second = 7/time_in_seconds;
    var words_per_minute = chars_per_second * 12;
    graph.push(words_per_minute.toFixed(2));


    if (text_iterator == 8) {
      // start the path for the current_cps line
      c.beginPath();
      c.lineWidth = .5;

      c.moveTo(y_lab_width, height - (words_per_minute.toFixed(2)) * vertical_unit);

    } else if (text_iterator > 8) {
      c.lineTo(x_coordinate, graph_height - (words_per_minute.toFixed(2)) * vertical_unit);
      c.strokeStyle = '#f9e7d6';
      c.stroke();
      x_coordinate += tick_distance;
    }
  } // end of update graph

  function alter_text() {
      var greentext = mainstring.slice(blue_iterator, text_iterator);
      var blacktext = mainstring.slice(text_iterator, mainstring.length);
      document.getElementById('green').innerHTML = greentext;
      document.getElementById('black').innerHTML = blacktext;
  }

  function error_display() {
    error_index = text_iterator + error_iterator;
    var greentext = mainstring.slice(blue_iterator,text_iterator);
    var redtext = mainstring.slice(text_iterator, error_index);
    var blacktext = mainstring.slice(error_index, mainstring.length);
    document.getElementById('green').innerHTML = greentext;
    document.getElementById('red').innerHTML = redtext;
    document.getElementById('black').innerHTML = blacktext;
  }

  var error_string = '';
  function update_error_string() {
    var error_letter = mainstring.slice(error_index - 1, error_index);
    error_string += error_letter;
    document.getElementById('error_chars_ghosttype').innerHTML = error_string;
  }

  function advance_tooltip() {

    // set tooltip height
    var new_top = document.getElementById('green').offsetHeight;
    document.getElementById('speed').top = + new_top + 'px';

    // once 8 characters have been typed update the tooltip
    if (text_iterator > 8) {

      time_in_seconds = ( key_stamps[text_iterator-1] - key_stamps[(text_iterator - 8)] )/1000;
      var chars_per_second = 7/time_in_seconds;
      var words_per_minute = chars_per_second * 12;

      // Update tooltip
      if (text_iterator % 3 == 0) {
        // document.getElementById('speed').style.visibility = 'visible';
        document.getElementById('speed').innerHTML = words_per_minute.toFixed(0);

      } // on every third
    } // once iterator gets to 8
  } // end of advance_tooltip

  function update_average() {
    if (text_iterator % 3 == 0) {
      var total_time_in_seconds = (key_stamps[text_iterator-1] - key_stamps[0])/1000;
      var total_chars = text_iterator;
      avg_wpm = (total_chars/total_time_in_seconds * 12);
      avg_wpm = avg_wpm.toFixed(2);
      document.getElementById('avg_wpm_p').innerHTML = avg_wpm;
    } // on every third
  } // end of update average

  function highlight() {
    tall_box_id = this.id.slice(5,7);
    this.style.backgroundColor = 'rgba(255,87,51,.5)';
    var segment_length = Math.round(mainstring.length/5);
    var first_index = segment_length * tall_box_id - segment_length;
    var last_index = segment_length * tall_box_id;
    var portion_1 = mainstring.slice(0, first_index);
    var portion_2 = mainstring.slice(first_index, last_index);
    var portion_3 = mainstring.slice(last_index, 1000000);

    var new_span = portion_1 + '<span class="orange">' + portion_2 + '</span>'  + portion_3;
    document.getElementById('green').innerHTML = new_span;
  }

  function unhighlight() {
    this.style.backgroundColor = '';
    document.getElementById('green').innerHTML = mainstring;
  }

  function success() {
    // mark the time
    key_stamps.push( new Date().getTime() );
    text_iterator++;
    error_iterator = 0;
    alter_text();
    advance_tooltip();
    update_average();
    update_graph();
  }

  function incorrect() {
    error_iterator++;
    error_display();
    update_error_string();
  }

  function special_validate(special) {
    if (mainstring.charAt(text_iterator) == special && error_iterator == 0) {
      success();
    } else {
      incorrect();
    }
  }

  function save_passage() {
    var target_wpm = document.getElementById('target_wpm').value;
    // avg_wpm is a stored variable
    var graph_map = graph.slice(7,10000).join();

    // passage (mainstring) is a stored variable
    // performance_id auto incremented
    // errors(error_string) is a stored variable
    // user_id picked up from php session
    console.log(graph_map);


    var data = 'target_wpm=' + target_wpm +
    '&avg_wpm=' + avg_wpm +
    '&graph_map=' + graph_map +
    '&ghost_wpm=' + ghost_wpm +
    '&head_start=' + head_start +
    '&passage=' + mainstring +
    // performance id auto incremented
    // date saved created in php
    '&errors=' + error_string;
    // user id picked up from session

    // Jquery ajax
    $.post('ghosttype_save.php', data, function(data, status) {
        if (data == "success") {
            // disable button
            document.getElementById('save_ghosttype_passage_button').innerHTML = 'saved successfully';
            document.getElementById('save_ghosttype_passage_button').disabled = 'disabled';
        } else {
            document.getElementById('save_ghosttype_passage_container').innerHTML = ajax.responseText;
        }
    });

    // // Run ajax sequence
    // var ajax = getXMLHttpRequestObject();
    //
    // ajax.open('POST', 'ghosttype_save.php', true);
    // ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //
    // ajax.send(data);
    //
    // // once the ready state  of the ajax object changes
    // ajax.onreadystatechange = function() {
    //   if (ajax.readyState == 4) {
    //     if ((ajax.status >= 200 && ajax.status < 300) || (ajax.status == 304)) {
    //       if (ajax.responseText == 'yes') {
    //         // disable button
    //
    //         document.getElementById('save_ghosttype_passage_button').innerHTML = 'saved successfully';
    //         document.getElementById('save_ghosttype_passage_button').disabled = 'disabled';
    //       } else {
    //         document.getElementById('save_ghosttype_passage_container').innerHTML = ajax.responseText;
    //       }
    //     }
    //   } // ready state not equal 4
    // }; // end of onreadystatechange function
  } // end of save_passage

  var ghost_wpm = document.getElementById('ghost_wpm').value;
  var head_start = document.getElementById('head_start').value;
  var ghost_cps = ghost_wpm * 5 / 60;
  var blue_iterator = 0;
  function start_ghost() {
    ghost = setInterval(function() {
      blue_iterator++;
      var bluetext = mainstring.slice(0,blue_iterator);
      var greentext = mainstring.slice(blue_iterator, text_iterator);
      document.getElementById('blue').innerHTML = bluetext;
      document.getElementById('green').innerHTML = greentext;
      if (blue_iterator == text_iterator) {
        clearInterval(ghost);
        document.removeEventListener('keydown', character_validate, false);
        document.getElementById('caught').style.display = 'block';
      }
    }, 1 / ghost_cps * 1000)
  }

  function character_validate(e) {

    var inputCharacter = String.fromCharCode(e.keyCode).toLowerCase();

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
            e.preventDefault();
            error_iterator--;
            error_display();


          }
          break;
        case 16: case 20: case 17: case 18: case 91: case 93: case 40: case 9:

          break;
        case 188:
          special_validate(',');
          break;
        case 190:
          special_validate('.');
          break;
        case 189:
          special_validate('-');
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

    // stopping event bubbling up the DOM tree..
    e.stopPropagation();

    // add listener to 'fifth' boxes upon completion
    if (text_iterator == mainstring.length) {
      if (document.getElementById('customer_fn')) {
        document.getElementById('save_ghosttype_passage_button').style.display = 'inline-block';
      }
      var fifths = document.getElementsByClassName('fifth');
      for (var i = 0; i < fifths.length; i++) {
        fifths[i].addEventListener('mouseenter', highlight, false);
        fifths[i].addEventListener('mouseleave', unhighlight, false);
      }
      if (ghost !== 0) {
        clearInterval(ghost);
        document.getElementById('made_it').style.display = 'block';
      }
      is_record('ghosttype_performances', 'avg_wpm', avg_wpm);

    }

    if (text_iterator == 1) {
      setTimeout(start_ghost, document.getElementById('head_start').value * 1000);
    }

  }; // event listener

  document.addEventListener('keydown', character_validate, false);

  // prevent backspace from going back a page
  document.addEventListener('keydown', function(e) {
    if (e.which == 8) {
      e.preventDefault();
    }
  }, false);

  // every time show tooltip is clicked
  document.getElementById('tooltip_ghosttype_checkbox').addEventListener('click', function() {
    if (document.getElementById('speed').style.visibility == 'hidden' || document.getElementById('speed').style.visibility == '') {
      document.getElementById('speed').style.visibility = 'visible'
    } else { // if $(tooltip_checkbox').checked == false
      document.getElementById('speed').style.visibility = 'hidden';
    }
  }, false);


  document.getElementById('save_ghosttype_passage_button').addEventListener('click', save_passage, false);


  }); // on window load
