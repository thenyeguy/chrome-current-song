/// <reference path='adapter.ts' />
/// <reference path='listener.ts' />
/// <reference path='../typings/index.d.ts' />


class SoundcloudAdapter implements Adapter {
    properties = {
        name: "SoundCloud",
        allowScrobbling: false,
    };

    getTitle() {
        return $(".playbackSoundBadge__title").attr("title");
    }

    getArtist() {
        return "";
    }

    getAlbum() {
        return "";
    }

    getPlayState() {
        return $("button.playControl").hasClass("playing") ?
            PlaybackState.Playing : PlaybackState.Paused;
    }

    getPlaytime() {
        let value = $(".playbackTimeline__progressWrapper").attr("aria-valuenow");
        return value && Math.floor(parseInt(value) / 1000);
    }

    getDuration() {
        let value = $(".playbackTimeline__progressWrapper").attr("aria-valuemax");
        return value && Math.floor(parseInt(value) / 1000);
    }

    getArtUri() {
        let container = $(".playControls .playbackSoundBadge .sc-artwork span");
        let css = container && container.css("background-image");
        let uri = css && css.replace(/.*\s?url\([\'\"]?/, '')
            .replace(/[\'\"]?\).*/, '');
        return uri;
    }

    playPause() {
        $("button.playControl").click();
    }

    nextSong() {
        $("button.skipControl__next").click();
    }

    prevSong() {
        $("button.skipControl__previous").click();
    }
}

$(document).ready(function() {
    window.listener = new Listener(new SoundcloudAdapter());
    window.listener.start();
});
