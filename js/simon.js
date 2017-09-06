const KEYS = ['c', 'd', 'e', 'f'];
const NOTE_DURATION = 1000;
const GAME_DELAY = 2 * NOTE_DURATION;
const ECHO_DELAY = 2500;

// NoteBox
//
// Acts as an interface to the coloured note boxes on the page, exposing methods
// for playing audio, handling clicks,and enabling/disabling the note box.
function NoteBox(key, onClick) {
	// Create references to box element and audio element.
	let boxEl = document.getElementById(key);
	let audioEl = document.getElementById(key + '-audio');
	if (!boxEl) throw new Error('No NoteBox element with id' + key);
	if (!audioEl) throw new Error('No audio element with id' + key + '-audio');

	// When enabled, will call this.play() and this.onClick() when clicked.
	// Otherwise, clicking has no effect.
	let enabled = true;
	// Counter of how many play calls have been made without completing.
	// Ensures that consequent plays won't prematurely remove the active class.
	let playing = 0;

	this.key = key;
	this.onClick = onClick || function () {};

	// Plays the audio associated with this NoteBox
	this.play = function () {
		playing++;
		// Always play from the beginning of the file.
		audioEl.currentTime = 0;
		audioEl.play();

		// Set active class for NOTE_DURATION time
		boxEl.classList.add('active');
		setTimeout(function () {
			playing--
			if (!playing) {
				boxEl.classList.remove('active');
			}
		}, NOTE_DURATION)
	}

	// Enable this NoteBox
	this.enable = function () {
		enabled = true;
	}

	// Disable this NoteBox
	this.disable = function () {
		enabled = false;
	}

	// Call this NoteBox's clickHandler and play the note.
	this.clickHandler = function () {
		if (!enabled) return;

		this.onClick(this.key)
		this.play()
	}.bind(this)

	boxEl.addEventListener('mousedown', this.clickHandler);
}

// Example usage of NoteBox.
//
// This will create a map from key strings (i.e. 'c') to NoteBox objects so that
// clicking the corresponding boxes on the page will play the NoteBox's audio.
// It will also demonstrate programmatically playing notes by calling play directly.

// GENERAL/SWITCH CODE

// General/Switch Variables:
let notes = {};
let game = false

let echo_game_switch = document.getElementById("echo_game_switch");
let score_card = document.getElementById("current_score");

// General/Switch Functions:
// Disabling all NoteBoxes + Switch
function disable_all(notes) {
	echo_game_switch.removeEventListener('mousedown', echo_game_switch_function);
	for (var note in notes) {
		notes[note].disable();
}}

// Enabling all NoteBoxes + Switch
function enable_all(notes) {
	echo_game_switch.addEventListener('mousedown', echo_game_switch_function);
	for (var note in notes) {
		notes[note].enable();
}}

//Setting Up
function setup(callback) {
	KEYS.forEach(function (key) {
		notes[key] = new NoteBox(key, callback);
	});
	enable_all(notes);
}

// Playing a set of keys while disabling user input
function playback(keys) {
	disable_all(notes);
	keys.forEach(function(key, i) {
		setTimeout(function() {notes[key].play(); setTimeout(function(){i !== (keys.length - 1) || enable_all(notes)}, NOTE_DURATION)}, i * NOTE_DURATION);
	});
}

//SWITCH CODE

function echo_game_switch_function() {
	disable_all(notes);
	game = !game;
	sequence = [];
	record = [];
	game ? score_card.style.visibility = "visible" : score_card.style.visibility = "hidden";
	this.innerHTML = game ? "Switch to Echo" : "Switch to Game";
	setup(game ? check : save);
	!game || run_round();
}


// GAME CODE

// Game Variables:
let sequence = [];
let progress = 0;

// Game Functions:
// Taken from https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
function random_key() {
	return KEYS[Math.floor(Math.random()*KEYS.length)];
}

function run_round() {
	disable_all(notes);
	score_card.innerHTML = ("Score: " + sequence.length.toString());
	progress = 0;
	sequence.push(random_key());
	setTimeout(function(){playback(sequence)}, GAME_DELAY);
}

function check(key) {
	if (game === false) {
		return
	}
	if (sequence[progress] === key) {
		progress++;
		if (progress === sequence.length) {
			run_round();
		}
	} else {
		reset_game()
	}
}

function reset_game() {
	sequence = [];
	run_round();
}

// ECHO CODE

// Echo Variables:
let record = [];

// Echo Functions:

// Saving a Played Key
function save(key) {
  record.push(key);
  let record_length = record.length;
  setTimeout(function(){if (record_length === record.length && game === false) {playback(record); record = [];}}, ECHO_DELAY)
}

// Initialization
setup(save);
