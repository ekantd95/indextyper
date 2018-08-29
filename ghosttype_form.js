var passages = document.getElementsByClassName('ghosttype_passage');
var passage_number;
var passage;
var target_wpm = document.getElementById('target_wpm');
var ghost_max_speed_cps = 400 * 5 / 60;
var max_number_seconds;

function select_passage(e) {
  passage_number = this.id.substr(8,1);
  passage = this.innerHTML;
  clear_all();
  this.style.backgroundColor = '#f9e7d6';
  this.style.color = '#6b2737';
  document.getElementById('selected_passage').value = passage_number;

  if (parseInt(target_wpm.value) > 0) {
    calculate_maximum();
  }
} // select_passage

target_wpm.addEventListener('input', function() {
  if (passage_number !== '' && parseInt(target_wpm.value) > 0) {
    calculate_maximum();
  }
})

function calculate_maximum() {
  var total_chars = passage.length;
  var target_cps = parseInt(target_wpm.value) * 5 / 60;
  var total_time = total_chars/target_cps;
  var ghost_time = total_chars/ghost_max_speed_cps;
  max_number_seconds = total_time - ghost_time;
  document.getElementById('head_start').max = max_number_seconds;
  document.getElementById('head_start').disabled = false;
}

function clear_all() {
  for (var i = 0; i < passages.length; i++) {
    passages[i].style.backgroundColor = '#6b2737';
    passages[i].style.color = '#f9e7d6';
    passages[i].value = '';
  }
}

// add listeners to passages
for (var i = 0; i < passages.length; i++) {
  passages[i].addEventListener('click', select_passage, false);
}
