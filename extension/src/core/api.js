"use strict";

function EngineApi(engine) {
    this.engine = engine;
}

EngineApi.prototype.getPlayerState = function() {
    return this.engine.getPlayerState();
}

EngineApi.prototype.playPause = function() {
    this.engine.handleControl("play_pause");
}

EngineApi.prototype.nextSong = function() {
    this.engine.handleControl("next_song");
}

EngineApi.prototype.prevSong = function() {
    this.engine.handleControl("prev_song");
}
