"use strict";

function Listener(adapter) {
    this.adapter = adapter;
    this.port = chrome.runtime.connect(null, {
        name: Math.random().toString(36).substr(2),
    });
    this.port.postMessage({ "name": this.adapter.name });
    this.lastTrack = new Track();
    this.lastState = new TrackState();
    this.verbose = false;
}

Listener.prototype.handleRequest = function(request) {
    if (this.verbose) { console.log("Got request: %O", request); }

    if (request.type === "control") {
        if (request.control === "play_pause") {
            this.adapter.playPause();
        } else if (request.control === "next_song") {
            this.adapter.nextSong();
        } else if (request.control === "prev_song") {
            this.adapter.prevSong();
        }
    }
}

Listener.prototype.update = function() {
    var msg = {}

    var track = new Track(this.adapter.getTitle(), this.adapter.getArtist(),
                          this.adapter.getAlbum(), this.adapter.getArtUri());
    if (!this.lastTrack.equals(track)) {
        msg["track"] = track;
        this.lastTrack = track;
    }

    var state = new TrackState(toSeconds(this.adapter.getPlaytime()),
                               toSeconds(this.adapter.getLength()),
                               this.adapter.getPlaying());
    if (!this.lastState.equals(state)) {
        msg["state"] = state;
        this.lastState = state;
    }

    if (!$.isEmptyObject(msg)) {
        msg["source"] = this.adapter.name;
        if (this.verbose) { console.log("Sending message: %O", msg); }
        this.port.postMessage(msg);
    }
}

Listener.prototype.poll = function(timeout_ms) {
    this.update();
    setTimeout(this.poll.bind(this, timeout_ms), timeout_ms);
}

Listener.prototype.start = function(verbose) {
    console.log("Starting %s listener...", this.adapter.name);
    this.verbose = !!verbose;
    this.port.onMessage.addListener(this.handleRequest.bind(this));
    this.poll(500 /* ms */);
}
