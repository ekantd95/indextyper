window.addEventListener('load', function() {
  var inputs = document.getElementsByTagName('input');
  var submit = document.getElementById('register');

  function everything_is_complete() {
    var empty = [];
    // check all inputs if values
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value == "") { // input is empty
        empty.push('1');
      }
    }
    if (empty.length > 0) {
      return 0;
    } else {
      return 1;
    }
  } // end of is_everything_empty

  function check(id) {
    document.getElementById(id + '_check').style.visibility = 'visible';
    document.getElementById(id + '_cross').style.visibility = 'hidden';
  }

  function cross(id) {
    document.getElementById(id + '_check').style.visibility = 'hidden';
    document.getElementById(id + '_cross').style.visibility = 'visible';
  }

  function validate_registration(e) {
    switch (this.name) {
      case 'first_name':
        if (this.value == '') { cross(this.id);
        } else { // there is a value
          check(this.id);
        }
        if (everything_is_complete()) { submit.disabled = false; };
        break;
      case 'last_name':
        if (this.value == '') {
          cross(this.id);
        } else { // there is a value
          check(this.id);
        }
        if (everything_is_complete()) { submit.disabled = false; };
        break;
      case 'email':
        var x = this.value;
        var atpos = x.indexOf("@");
        var dotpos = x.lastIndexOf(".");
        if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) { // failed validation
          cross(this.id);
        } else {
          check(this.id);
        }
        if (everything_is_complete()) { submit.disabled = false; };
        break;
      case 'pass1':
        if (this.value == '') {
          cross(this.id);
        } else { // there is a value
          check(this.id);
        }
        if (everything_is_complete()) { submit.disabled = false; };
        break;
      case 'pass2':
        if (this.value == document.getElementById('pass1').value) { // accurate
          check(this.id);
        } else {
          cross(this.id);
        }
        if (everything_is_complete()) { submit.disabled = false; };
        break;
    } // end of switch
  } // end of validate_registration

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('blur', validate_registration, false);
  }

}, false);
