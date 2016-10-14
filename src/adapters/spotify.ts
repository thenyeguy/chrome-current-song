/// <reference path='adapter.ts' />
/// <reference path='listener.ts' />
/// <reference path='../typings/index.d.ts' />

class SpotifyAdapter implements Adapter {
    properties = {
        name: "Spotify",
        allowScrobbling: true,
    };

    getTitle() {
        return $("#app-player").contents().find("#track-name").text();
    }

    getArtist() {
        return $("#app-player").contents().find("#track-artist").text();
    }

    getAlbum() {
        return "";
    }

    getPlayState() {
        if ($("#app-player").contents().find("#play-pause").hasClass("playing")) {
            return PlaybackState.Playing;
        } else {
            return PlaybackState.Paused;
        }
    }

    getPlaytime() {
        return $("#app-player").contents().find("#track-current").text();
    }

    getDuration() {
        return $("#app-player").contents().find("#track-length").text();
    }

    getArtUri() {
        let backgroundStyle = $("#app-player").contents()
            .find(".sp-image-img").css("background-image");
        let backgroundUrl = /^url\((['"]?)(.*)\1\)$/.exec(backgroundStyle);
        return backgroundUrl ? backgroundUrl[2] : "";
    }

    playPause() {
        $("#app-player").contents().find("#play-pause").click();
    }

    nextSong() {
        $("#app-player").contents().find("#next").click();
    }

    prevSong() {
        $("#app-player").contents().find("#previous").click();
    }
}

$(document).ready(function() {
    window.listener = new Listener(new SpotifyAdapter());
    window.listener.start();
});
