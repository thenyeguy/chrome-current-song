/// <reference path='adapter.ts' />
/// <reference path='listener.ts' />
/// <reference path='../typings/index.d.ts' />

class GpmAdapter implements Adapter {
    properties = {
        name: "Google Play Music",
        allowScrobbling: true,
    };

    getTitle() {
        return $("#currently-playing-title").text();
    }

    getArtist() {
        return $("#player-artist").text();
    }

    getAlbum() {
        return $(".player-album").text();
    }

    getPlayState() {
        if (!$("#playerSongInfo").is(":visible")) {
            return PlaybackState.Stopped;
        } else if ($("[data-id=play-pause]").hasClass("playing")) {
            return PlaybackState.Playing;
        } else {
            return PlaybackState.Paused;
        }
    }

    getPlaytime() {
        return $("#time_container_current").text();
    }

    getDuration() {
        return $("#time_container_duration").text();
    }

    getArtUri() {
        return $("#playerBarArt").attr("src");
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
