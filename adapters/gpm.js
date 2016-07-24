"use strict";

function GpmAdapter() {
    this.name = "Google Play Music";
}

GpmAdapter.prototype = new Adapter();

GpmAdapter.prototype.title = function() {
    return $("#currently-playing-title").text();
}

GpmAdapter.prototype.artist = function() {
    return $("#player-artist").text();
}

GpmAdapter.prototype.album = function() {
    return $(".player-album").text();
}

GpmAdapter.prototype.playing = function() {
    return $('#player *[data-id="play-pause"]').hasClass('playing');
}

$(document).ready(function() {
    console.log("Starting GPM listener...");
    new Listener(new GpmAdapter()).start();
});
