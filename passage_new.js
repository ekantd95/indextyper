window.addEventListener('load', function() {

  var error_number = 0;
  var text_iterator = 0;
  var error_iterator = 0;
  var error_index = 0;
  var mainstring = document.getElementById('black').innerHTML;
  var key_stamps = [];
  var tall_box_id;
  var graph = [];
  var avg_wpm;

  var width = document.getElementById('current_cps_container').clientWidth;
  var height = document.getElementById('current_cps_container').clientHeight;
  var vertical_unit = height/250;

  // initialize the x-coordinate and set tick distance
  var tick_distance = (width - 35)/mainstring.length;
  var x_coordinate = 35 + 7 * tick_distance;
  // General
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');

  // set up canvas
  function setup_canvas() {
    // find new container width/height and update global variables
    width = document.getElementById('canvas').clientWidth;
    height = document.getElementById('canvas').clientHeight;
    // set to canvas height/width
    canvas.width = width * 2;
    canvas.height = height * 2;
    // update vertical_unit
    vertical_unit = height/250;

    c.scale(2,2);

    // draw scale lines
    var label_height = 228 * vertical_unit;
    for (var i = 1; i < 10; i++) {
      c.beginPath();
      c.moveTo(35,(height - ((25 * vertical_unit) * i) ) - .5) ;
      c.lineTo(width, height - ((25 * vertical_unit) * i));
      c.fillStyle = '';
      c.strokeStyle = '#f9e7d6';
      c.lineWidth = 1;
      c.stroke();
      c.font = "10px Montserrat";
      c.fillStyle = '#f9e7d6';
      c.textAlign = 'right';
      c.fillText( 25 * i, 22, label_height);
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

      c.moveTo(35 + 7 * tick_distance,height - (words_per_minute.toFixed(2)) * vertical_unit);

    } else if (text_iterator > 8) {
      c.lineTo(x_coordinate + .5,height - (words_per_minute.toFixed(2)) * vertical_unit);
      c.strokeStyle = '#f9e7d6';
      c.stroke();
      x_coordinate += tick_distance;
    }
  } // end of update graph

  function alter_text() {
      text_iterator++;
      var greentext = mainstring.slice(0,text_iterator);
      var blacktext = mainstring.slice(text_iterator, 1000);
      document.getElementById('green').innerHTML = greentext;
      document.getElementById('black').innerHTML = blacktext;
  }

  function error_display() {
    error_index = text_iterator + error_iterator;
    var greentext = mainstring.slice(0,text_iterator);
    var redtext = mainstring.slice(text_iterator, error_index);
    var blacktext = mainstring.slice(error_index, 1000);
    document.getElementById('green').innerHTML = greentext;
    document.getElementById('red').innerHTML = redtext;
    document.getElementById('black').innerHTML = blacktext;
  }

  var error_string = '';
  function update_error_string() {
    var error_letter = mainstring.slice(error_index - 1, error_index);
    error_string += error_letter;
    var p = document.createElement('p');
    p.textContent = error_letter;
    document.getElementById('error_chars').appendChild(p);
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
      document.getElementById('average_output').innerHTML = avg_wpm;
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

    var graph_map = graph.slice(7,10000).join();
    console.log(graph_map);
    // run ajax sequence
    // Run ajax sequence
    var ajax = getXMLHttpRequestObject();

    ajax.open('POST', 'passage_save.php', true);
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var data = 'passage=' + mainstring +
    '&avg_wpm=' + avg_wpm +
    '&wpmover7=' + graph_map +
    '&errors=' + error_string;
    ajax.send(data);

    // once the ready state  of the ajax object changes
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4) {
        if ((ajax.status >= 200 && ajax.status < 300) || (ajax.status == 304)) {
          if (ajax.responseText == 'yes') {
            // disable button

            document.getElementById('save_passage_button').innerHTML = 'Saved successfully';
            document.getElementById('save_passage_button').disabled = 'disabled';
            document.getElementById('save_passage_button').className = 'save_passage_complete';
          } else {
            document.getElementById('save_passage_container').innerHTML = ajax.responseText;
          }
        }
      } // ready state not equal 4
    }; // end of onreadystatechange function
  } // end of save_passage



  document.addEventListener('keydown', function() {

        var inputCharacter = String.fromCharCode(e.keyCode).toLowerCase();

        // check if the characters match
        if (inputCharacter == mainstring.charAt(text_iterator).toLowerCase()) {

          // if character being verified against is lower case
          if ( (mainstring.charAt(text_iterator).toLowerCase() == mainstring.charAt(text_iterator)) && (error_iterator == 0) ) {
            if (e.shiftKey) {
              incorrect();
            } else {
                console.log('success without shift key')
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
            case 16: case 20: case 17: case 18: case 91: case 93: case 40: case 9:
              console.log('fishfry');
              break;
            case 188:
              special_validate(',');
              break;
            case 190:
              special_validate('.');
              break;
            case 32:
              e.preventDefault();
              break;
            case 222:
              e.preventDefault();
              special_validate('\'');
              break;
            case 191:
              e.preventDefault();
              if (e.shiftKey) {
                special_validate('?');
              }
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

        // upon completion
        if (text_iterator == mainstring.length) {
          // show save passage button
          if (document.getElementById('customer_fn')) {
            document.getElementById('save_passage_button').style.display = 'block';
            // if it's a record say so
            is_record('passage_performances', 'avg_wpm', avg_wpm);
          }
          // add listeners to 'fifth' boxes for highlighting
          var fifths = document.getElementsByClassName('fifth');
          for (var i = 0; i < fifths.length; i++) {
            fifths[i].addEventListener('mouseenter', highlight, false);
            fifths[i].addEventListener('mouseleave', unhighlight, false);
          }

        }

  }, false); // on keydown

  // every time show tooltip is clicked
  document.getElementById('tooltip_checkbox').addEventListener('click', function() {
    if (document.getElementById('speed').style.visibility == 'hidden' || document.getElementById('speed').style.visibility == '') {
      document.getElementById('speed').style.visibility = 'visible'
    } else { // if $(tooltip_checkbox').checked == false
      document.getElementById('speed').style.visibility = 'hidden';
    }
  }, false);


  document.getElementById('save_passage_button').addEventListener('click', save_passage, false);

}, false); // on window load
