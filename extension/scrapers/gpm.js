"use strict";

function GpmScraper() {
    this.name = "Google Play Music";
}

GpmScraper.prototype = new Scraper();

GpmScraper.prototype.title = function() {
    return $("#currently-playing-title").text();
}

GpmScraper.prototype.artist = function() {
    return $("#player-artist").text();
}

GpmScraper.prototype.album = function() {
    return $(".player-album").text();
}

GpmScraper.prototype.playing = function() {
    return $('#player *[data-id="play-pause"]').hasClass('playing');
}

GpmScraper.prototype.playtime = function() {
    return $('#time_container_current').text();
}

GpmScraper.prototype.length = function() {
    return $('#time_container_duration').text();
}

$(document).ready(function() {
    console.log("Starting GPM listener...");
    new Listener(new GpmScraper()).start();
});
