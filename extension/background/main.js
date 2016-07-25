"use strict";

function EngineApi(engine) {
    this.engine = engine;
}

EngineApi.prototype.getPlayerState = function() {
    return this.engine.getPlayerState();
}

$(document).ready(function() {
    console.log("Starting Engine...");
    var engine = new Engine();
    window.engineApi = new EngineApi(engine);
    engine.start();
});
