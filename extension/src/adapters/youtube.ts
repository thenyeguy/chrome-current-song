/// <reference path='adapter.ts' />
/// <reference path='listener.ts' />
/// <reference path='../core/utils.ts' />
/// <reference path='../typings/index.d.ts' />


class YoutubeAdapter implements Adapter {
    properties = {
        name: "YouTube",
        allowScrobbling: false,
    };

    private lastUpdate: number;
    private currentTime: number;

    constructor() {
        this.lastUpdate = Date.now();
        this.currentTime = 0;
    }

    getTitle() {
        return $("#eow-title").text();
    }

    getArtist() {
        return "";
    }

    getAlbum() {
        return "";
    }

    getPlaying() {
        // The button has the label for the action it will perform it clicked.
        return $(".ytp-play-button").attr("aria-label") === "Pause";
    }

    getPlaytime() {
        // If the player is currently playing, and the player bar is hidden,
        // then it doesn't update the currently playing time. Instead, we will
        // estimate the player time by updating it ourselves.
        if ($(".html5-video-player").hasClass("ytp-autohide")) {
            if (this.getPlaying) {
                this.currentTime += (Date.now() - this.lastUpdate) / 1000;
            }
        } else {
            this.currentTime = timeToSeconds($(".ytp-time-current").text());
        }
        this.lastUpdate = Date.now();
        return Math.floor(this.currentTime);
    }

    getDuration() {
        return $(".ytp-time-duration").text();
    }

    getArtUri() {
        return $("[itemprop=thumbnailUrl]").attr("href");
    }

    playPause() {
        $(".ytp-play-button").click();
    }

    nextSong() {}

    prevSong() {}
}

$(document).ready(function() {
    window.listener = new Listener(new YoutubeAdapter());
    window.listener.start();
});
