/// <reference path='adapter.ts' />
/// <reference path='listener.ts' />
/// <reference path='../typings/index.d.ts' />

class GpmAdapter implements Adapter {
    name = "Google Play Music";
    enableScrobbling = true;

    constructor() {}

    private enable() {
        return $("#playerSongInfo").is(":visible") || null;
    }

    getTitle() {
        return this.enable() && $("#currently-playing-title").text();
    }

    getArtist() {
        return this.enable() && $("#player-artist").text();
    }

    getAlbum() {
        return this.enable() && $(".player-album").text();
    }

    getPlaying() {
        return this.enable() && $("[data-id=play-pause]").hasClass("playing");
    }

    getPlaytime() {
        return this.enable() && toSeconds($("#time_container_current").text());
    }

    getLength() {
        return this.enable() && toSeconds($("#time_container_duration").text());
    }

    getArtUri() {
        return this.enable() && $("#playerBarArt").attr("src");
    }

    playPause() {
        $("[data-id=play-pause]").click();
    }

    nextSong() {
        $("[data-id=forward]").click();
    }

    prevSong() {
        $("[data-id=rewind]").click();
    }
}

$(document).ready(function() {
    window.listener = new Listener(new GpmAdapter());
    window.listener.start();
});
