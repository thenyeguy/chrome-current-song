/// <reference path='adapter.ts' />
/// <reference path='listener.ts' />
/// <reference path='../typings/index.d.ts' />

class SpotifyAdapter implements Adapter {
    properties = {
        name: "Spotify",
        allowScrobbling: true,
    };

    getTitle() {
        return $(".track-info__name").text();
    }

    getArtist() {
        return $(".track-info__artists").text();
    }

    getAlbum() {
        return "";
    }

    getPlayState() {
        if ($('.spoticon-pause-16')) {
            return PlaybackState.Playing;
        } else {
            return PlaybackState.Paused;
        }
    }

    getPlaytime() {
        return $(".playback-bar__progress-time:first-child").text();
    }

    getDuration() {
        return $(".playback-bar__progress-time:last-child").text();
    }

    getArtUri() {
        let backgroundStyle = $(".now-playing-bar .cover-art-image")
            .css("background-image");
        let backgroundUrl = /^url\((['"]?)(.*)\1\)$/.exec(backgroundStyle);
        return backgroundUrl ? backgroundUrl[2] : "";
    }

    playPause() {
        $('.spoticon-pause-16, .spoticon-play-16').click()
    }

    nextSong() {
        $(".spoticon-skip-forward-16").click();
    }

    prevSong() {
        $(".spoticon-skip-back-16").click();
    }
}

$(document).ready(function() {
    window.listener = new Listener(new SpotifyAdapter());
    window.listener.start();
});
