"use strict";

function GpmScraper() {
    this.name = "Google Play Music";
}

GpmScraper.prototype = new Scraper();

GpmScraper.prototype.enable = function() {
    return $('#playerSongInfo').is(":visible") || null;
}

GpmScraper.prototype.title = function() {
    return this.enable() && $("#currently-playing-title").text();
}

GpmScraper.prototype.artist = function() {
    return this.enable() && $("#player-artist").text();
}

GpmScraper.prototype.album = function() {
    return this.enable() && $(".player-album").text();
}

GpmScraper.prototype.playing = function() {
    return this.enable() &&
        $('#player *[data-id="play-pause"]').hasClass('playing');
}

GpmScraper.prototype.playtime = function() {
    return this.enable() && $('#time_container_current').text();
}

GpmScraper.prototype.length = function() {
    return this.enable() && $('#time_container_duration').text();
}

$(document).ready(function() {
    console.log("Starting GPM listener...");
    new Listener(new GpmScraper()).start();
});
