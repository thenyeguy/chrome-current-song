"use strict";

function GpmAdapter() {}

GpmAdapter.prototype = new Adapter("Google Play Music");

GpmAdapter.prototype.enable = function() {
    return $("#playerSongInfo").is(":visible") || null;
}

GpmAdapter.prototype.getTitle = function() {
    return this.enable() && $("#currently-playing-title").text();
}

GpmAdapter.prototype.getArtist = function() {
    return this.enable() && $("#player-artist").text();
}

GpmAdapter.prototype.getAlbum = function() {
    return this.enable() && $(".player-album").text();
}

GpmAdapter.prototype.getPlaying = function() {
    return this.enable() && $("[data-id=play-pause]").hasClass("playing");
}

GpmAdapter.prototype.getPlaytime = function() {
    return this.enable() && $("#time_container_current").text();
}

GpmAdapter.prototype.getLength = function() {
    return this.enable() && $("#time_container_duration").text();
}

GpmAdapter.prototype.getArtUri = function() {
    var art = $("#playerBarArt");
    return this.enable() && art && art[0].src;
}

GpmAdapter.prototype.playPause = function() {
    $("[data-id=play-pause]").click();
}

GpmAdapter.prototype.nextSong = function() {
    $("[data-id=forward]").click();
}

GpmAdapter.prototype.prevSong = function() {
    $("[data-id=rewind]").click();
}

var listener = null;
$(document).ready(function() {
    listener = new Listener(new GpmAdapter());
    listener.start();
});
