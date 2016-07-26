"use strict";

function EngineApi(engine) {
    this.engine = engine;
}

EngineApi.prototype.getPlayerState = function() {
    return this.engine.getPlayerState();
}

EngineApi.prototype.playPause = function() {
    this.engine.playPause();
}

$(document).ready(function() {
    console.log("Starting Engine...");
    var engine = new Engine();
    window.engineApi = new EngineApi(engine);
    engine.start();
});
