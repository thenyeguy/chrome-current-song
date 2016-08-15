"use strict";

function YoutubeAdapter() {
    this.lastUpdate = Date.now();
    this.currentTime = 0;
}

YoutubeAdapter.prototype = new Adapter("YouTube");

YoutubeAdapter.prototype.getTitle = function() {
    return $("#eow-title").text();
}

YoutubeAdapter.prototype.getPlaying = function() {
    // The button has the label for the action it will perform it clicked.
    return $(".ytp-play-button").attr("aria-label") === "Pause";
}

YoutubeAdapter.prototype.getPlaytime = function() {
    // If the player is currently playing, and the player bar is hidden,
    // then it doesn't update the currently playing time. Instead, we will
    // estimate the player time by updating it ourselves.
    if ($(".html5-video-player").hasClass("ytp-autohide")) {
        if (this.getPlaying) {
            this.currentTime += (Date.now() - this.lastUpdate) / 1000;
        }
    } else {
        this.currentTime = toSeconds($(".ytp-time-current").text());
    }
    this.lastUpdate = Date.now();
    return Math.floor(this.currentTime);
}

YoutubeAdapter.prototype.getLength = function() {
    return $(".ytp-time-duration").text();
}

YoutubeAdapter.prototype.getArtUri = function() {
    return $("[itemprop=thumbnailUrl]").attr("href");
}

YoutubeAdapter.prototype.playPause = function() {
    $(".ytp-play-button").click();
}

var listener = null;
$(document).ready(function() {
    listener = new Listener(new YoutubeAdapter());
    listener.start();
});
