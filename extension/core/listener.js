"use strict";

function toSeconds(playtime) {
    if (!playtime) {
        return null;
    } else if (typeof playtime === "number") {
        return playtime;
    }
    var match = playtime.match(/(\d+):(\d+)/);
    var intValue = parseInt(playtime);
    if(match && match.length === 3) {
        var minutes = parseInt(match[1]);
        var seconds = parseInt(match[2]);
        return 60*minutes + seconds;
    } else if (intValue) {
        return intValue;
    }
    return null;
}

function Listener(adapter) {
    this.adapter = adapter;
    this.port = chrome.runtime.connect({name: this.adapter.name});
}

Listener.prototype.getPlayerState = function() {
    return {
        "source": this.adapter.name,
        "title": this.adapter.getTitle() || null,
        "artist": this.adapter.getArtist() || null,
        "album": this.adapter.getAlbum() || null,
        "playing": this.adapter.getPlaying() || false,
        "playtime": toSeconds(this.adapter.getPlaytime()),
        "length": toSeconds(this.adapter.getLength()),
        "art_uri": this.adapter.getArtUri() || null,
    };
}

Listener.prototype.sendPlayerState = function() {
    var msg = this.getPlayerState();
    msg["type"] = "player_state";
    this.port.postMessage(msg);
}

Listener.prototype.handleRequest = function(request) {
    if (request.type === "player_state") {
        this.sendPlayerState();
    } else if (request.type === "control") {
        if (request.control === "play_pause") {
            this.adapter.playPause();
        } else if (request.control === "next_song") {
            this.adapter.nextSong();
        } else if (request.control === "prev_song") {
            this.adapter.prevSong();
        }
    }
}

Listener.prototype.doPoll = function(timeout_ms) {
    this.sendPlayerState();
    setTimeout(this.doPoll.bind(this, timeout_ms), timeout_ms);
}

Listener.prototype.start = function() {
    this.port.onMessage.addListener(this.handleRequest.bind(this));
    this.doPoll(1000);
}
