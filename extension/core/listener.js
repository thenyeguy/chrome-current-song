"use strict";

function toSeconds(playtime) {
    if (!playtime) {
        return null;
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
    this.port = null;
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
    };
}

Listener.prototype.handleRequest = function(request) {
    if (request.type === "player_state") {
        var msg = this.getPlayerState();
        msg["type"] = "player_state";
        this.port.postMessage(msg);
    } else if (request.type === "play_pause") {
        this.adapter.playPause();
    }
}

Listener.prototype.start = function() {
    this.port = chrome.runtime.connect({name: this.adapter.name});
    this.port.onMessage.addListener(this.handleRequest.bind(this));
}
