"use strict";

function EngineApi(engine) {
    this.engine = engine;
}

EngineApi.prototype.getLastMessage = function() {
    return this.engine.getLastMessage();
}

$(document).ready(function() {
    console.log("Starting Engine...");
    var engine = new Engine();
    window.engineApi = new EngineApi(engine);
    engine.start();
});
