"use strict";

$(document).ready(function() {
    console.log("Starting Engine...");
    var engine = new Engine();
    window.engineApi = new EngineApi(engine);
    engine.start();
});
