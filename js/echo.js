/*
//ECHO
let record = [];
//Saving a Played Key
function save(key) {
  record.push(key);
  let record_length = record.length;
  setTimeout(function(){if (record_length === record.length) {playback(record); record = [];}}, ECHO_DELAY)
}
*/

//ALSO change callback to save