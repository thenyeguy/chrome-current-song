/// <reference path='adapter.ts' />
/// <reference path='listener.ts' />
/// <reference path='../typings/index.d.ts' />

class BandcampAdapter implements Adapter {
    properties = {
        name: "Bandcamp",
        allowScrobbling: true,
    };

    getTitle() {
        return $(".track_info .title").text();
    }

    getArtist() {
        return $("[itemprop=byArtist]").text();
    }

    getAlbum() {
        return $(".trackTitle[itemprop=name]").text();
    }

    getPlayState() {
        if ($(".inline_player").length == 0) {
            return PlaybackState.Stopped;
        } else if ($(".playbutton").hasClass("playing")) {
            return PlaybackState.Playing;
        } else {
            return PlaybackState.Paused;
        }
    }

    getPlaytime() {
        return $(".time_elapsed").text();
    }

    getDuration() {
        return $(".time_total").text();
    }

    getArtUri() {
        return $("#tralbumArt img").attr("src");
    }

    playPause() {
        $(".playbutton").click();
    }

    nextSong() {
        $(".nextbutton").click();
    }

    prevSong() {
        $(".prevbutton").click();
    }
}

$(document).ready(function() {
    window.listener = new Listener(new BandcampAdapter());
    window.listener.start();
});
