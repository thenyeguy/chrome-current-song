"use strict";

function EngineApi(engine) {
    this.engine = engine;
}

EngineApi.prototype.getPlayerState = function() {
    return this.engine.getPlayerState();
}

EngineApi.prototype.playPause = function() {
    this.engine.sendControl("play_pause");
}

EngineApi.prototype.nextSong = function() {
    this.engine.sendControl("next_song");
}

EngineApi.prototype.prevSong = function() {
    this.engine.sendControl("prev_song");
}

$(document).ready(function() {
    console.log("Starting Engine...");
    var engine = new Engine();
    window.engineApi = new EngineApi(engine);
    engine.start();
});
