"use strict";

function GpmAdapter() {
    this.name = "Google Play Music";
}

GpmAdapter.prototype.getCurrentSong = function() {
    return {
        "title": $("#currently-playing-title").text(),
        "artist": $("#player-artist").text(),
        "album": $(".player-album").text(),
    }
}

$(document).ready(function() {
    console.log("Starting GPM listener...");
    new Listener(new GpmAdapter()).start();
});
