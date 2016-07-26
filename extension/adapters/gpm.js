"use strict";

function GpmAdapter() {
    this.name = "Google Play Music";
}

GpmAdapter.prototype = new Adapter();

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

GpmAdapter.prototype.playPause = function() {
    $("[data-id=play-pause]").click();
}

$(document).ready(function() {
    console.log("Starting GPM listener...");
    new Listener(new GpmAdapter()).start();
});
