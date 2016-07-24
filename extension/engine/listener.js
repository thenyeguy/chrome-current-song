"use strict";

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
        });
    }
}

Listener.prototype.start = function() {
    this.port = chrome.runtime.connect({name: this.adapter.name});
    this.port.onMessage.addListener(this.handleRequest.bind(this));
}
