"use strict";

function toSeconds(playtime) {
    var match = playtime.match(/(\d+):(\d+)/);
    var intValue = parseInt(playtime);
    if(match.length === 3) {
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

Listener.prototype.handleRequest = function(request) {
    if (request.type === "player_state") {
        this.port.postMessage({
            "type": "player_state",
            "source": this.adapter.name,
            "title": this.adapter.title() || null,
            "artist": this.adapter.artist() || null,
            "album": this.adapter.album() || null,
            "playing": this.adapter.playing() || false,
            "playtime": toSeconds(this.adapter.playtime()),
            "length": toSeconds(this.adapter.length()),
        });
    }
}

Listener.prototype.start = function() {
    this.port = chrome.runtime.connect({name: this.adapter.name});
    this.port.onMessage.addListener(this.handleRequest.bind(this));
}
