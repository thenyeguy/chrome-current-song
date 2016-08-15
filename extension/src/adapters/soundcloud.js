"use strict";

function SoundCloudAdapter() {}

SoundCloudAdapter.prototype = new Adapter("SoundCloud");

SoundCloudAdapter.prototype.getTitle = function() {
    return $(".playbackSoundBadge__title").attr("title");
}

SoundCloudAdapter.prototype.getPlaying = function() {
    return $("button.playControl").hasClass("playing");
}

SoundCloudAdapter.prototype.getPlaytime = function() {
    var wrapper = $(".playbackTimeline__progressWrapper");
    return wrapper && Math.floor(wrapper.attr("aria-valuenow") / 1000);
}

SoundCloudAdapter.prototype.getLength = function() {
    var wrapper = $(".playbackTimeline__progressWrapper");
    return wrapper && Math.floor(wrapper.attr("aria-valuemax") / 1000);
}

SoundCloudAdapter.prototype.getArtUri = function() {
    var container = $(".playControls .playbackSoundBadge .sc-artwork span");
    var css = container && container.css("background-image");
    var uri = css && css.replace(/.*\s?url\([\'\"]?/, '')
                        .replace(/[\'\"]?\).*/, '');
    return uri;
}

SoundCloudAdapter.prototype.playPause = function() {
    $("button.playControl").click();
}

SoundCloudAdapter.prototype.nextSong = function() {
    $("button.skipControl__next").click();
}

SoundCloudAdapter.prototype.prevSong = function() {
    $("button.skipControl__previous").click();
}

var listener = null;
$(document).ready(function() {
    listener = new Listener(new SoundCloudAdapter());
    listener.start();
});
