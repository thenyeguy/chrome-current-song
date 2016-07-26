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

function Listener(adapter, verbose) {
    this.adapter = adapter;
    this.port = null;
    this.verbose = verbose || false;
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

Listener.prototype.handleRequest = function(request) {
    if (request.type === "player_state") {
        var msg = this.getPlayerState();
        msg["type"] = "player_state";
        if (this.verbose) {
            console.log(msg);
        }
        this.port.postMessage(msg);
    } else if (request.type === "control") {
        if (this.verbose) {
            console.log(request);
        }
        if (request.control === "play_pause") {
            this.adapter.playPause();
        } else if (request.control === "next_song") {
            this.adapter.nextSong();
        } else if (request.control === "prev_song") {
            this.adapter.prevSong();
        }
    }
}

Listener.prototype.start = function() {
    this.port = chrome.runtime.connect({name: this.adapter.name});
    this.port.onMessage.addListener(this.handleRequest.bind(this));
}
