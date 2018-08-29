  function is_record(table, column, value) {
    var type = table.slice(0,-13);
    var ajax = getXMLHttpRequestObject();
    ajax.open('POST', 'passage_record.php', true);
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var data = 'table=' + table +
    '&column=' + column +
    '&value=' + value;
    ajax.send(data);

    // once the ready state  of the ajax object changes
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4) {
        if ( (ajax.status >= 200 && ajax.status < 300) || (ajax.status == 304) ) {
          if (ajax.responseText == 'yes') {
            document.getElementById(type + '_wpm_label').innerHTML = 'New Record!';
            document.getElementById(type + '_wpm_label').style.color = 'red';
          } else {
            console.log(ajax.responseText);
          }
        } // bad status
      } // ready state not equal 4
    }; // end of onreadystatechange function

  } // end of is_record()
