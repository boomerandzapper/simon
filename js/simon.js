const KEYS = ['c', 'd', 'e', 'f'];
const NOTE_DURATION = 1000;

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
let notes = {};
let record = [];

//Setting Up
KEYS.forEach(function (key) {
	notes[key] = new NoteBox(key, save);
});

//Saving a Played Key
function save(key) {
	record.push(key);
	let record_length = record.length;
	setTimeout(function(){if (record_length === record.length) {playback(record); }}, ECHO_DELAY)
}

//Disabling all NoteBoxes
function disable_all() {
	for (var note in notes) {
		notes[note].disable();
}}

//Enabling all NoteBoxes
function enable_all() {
	for (var note in notes) {
		notes[note].enable();
}}

//Playing a set of keys while disabling user input
function playback(keys) {
	disable_all();
	keys.forEach(function(key, i) {
		setTimeout(function() {notes[key].play(); (i !== (keys.length - 1) || enable_all())}, i * NOTE_DURATION);
	});
	record = [];
}
