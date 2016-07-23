"use strict";

function Listener(adapter) {
    this.adapter = adapter;
    this.port = null;
}

Listener.prototype.handleRequest = function(request) {
    console.log("Got request: %O", request);
    if (request.type === "getCurrentSong") {
        this.port.postMessage({
            "type": "currentSong",
            "song": this.adapter.getCurrentSong(),
        });
    }
}

Listener.prototype.start = function() {
    this.port = chrome.runtime.connect({name: this.adapter.name});
    this.port.onMessage.addListener(this.handleRequest.bind(this));
}
