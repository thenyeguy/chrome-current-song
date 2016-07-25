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

function Listener(scraper) {
    this.scraper = scraper;
    this.port = null;
}

Listener.prototype.sendPlayerState = function() {
    this.port.postMessage({
        "type": "player_state",
        "source": this.scraper.name,
        "title": this.scraper.title() || null,
        "artist": this.scraper.artist() || null,
        "album": this.scraper.album() || null,
        "playing": this.scraper.playing() || false,
        "playtime": toSeconds(this.scraper.playtime()),
        "length": toSeconds(this.scraper.length()),
    });
}

Listener.prototype.handleRequest = function(request) {
    if (request.type === "player_state") {
        this.sendPlayerState();
    }
}

Listener.prototype.start = function() {
    this.port = chrome.runtime.connect({name: this.scraper.name});
    this.port.onMessage.addListener(this.handleRequest.bind(this));
}
