"use strict";


function toSeconds(playtime) {
    if (playtime === null || playtime === undefined) {
        return null;
    }

    if (typeof playtime === "number") {
        return playtime;
    }

    var match = playtime.match(/(\d+):(\d+)/);
    if(match && match.length === 3) {
        var minutes = parseInt(match[1]);
        var seconds = parseInt(match[2]);
        return 60*minutes + seconds;
    }

    var intValue = parseInt(playtime);
    if (typeof intValue === "number" && intValue != NaN) {
        return intValue;
    }

    return null;
}


function Track(title, artist, album, artUri) {
    this.title = title || null;
    this.artist = artist || null;
    this.album = album || null;
    this.artUri = artUri || null;
}

Track.prototype.equals = function(other) {
    return this.title === other.title &&
           this.artist === other.artist &&
           this.album === other.album;
}


function TrackState(playtime, length, playing) {
    this.playtime = toSeconds(playtime);
    this.length = toSeconds(length);
    this.playing = playing || false;
}

TrackState.prototype.equals = function(other) {
    return this.playtime === other.playtime &&
           this.length === other.length &&
           this.playing === other.playing;
}
