"use strict";

function Multiplexer() {
    this.activePlayer = null;
    this.players = {};
}

Multiplexer.prototype.addPlayer = function(port) {
    var id = port.name;
    this.players[id] = {
        id: id,
        name: id,
        port: port,
        track: new Track(),
        state: new TrackState(),
        lastActive: 0,
    }
}

Multiplexer.prototype.getPlayer = function(id) {
    return this.players[id];
}

Multiplexer.prototype.deletePlayer = function(id) {
    var player = this.players[id];
    if (this.activePlayer && id === this.activePlayer.id) {
        this.activePlayer = null;
    }
    delete this.players[id];
    return player;
}

Multiplexer.prototype.getActivePlayer = function() {
    if (this.activePlayer) {
        return this.activePlayer;
    }

    var lastActive = 0;
    var player = null;
    for (var id in this.players) {
        if (this.players[id].lastActive > lastActive) {
            player = this.players[id];
            lastActive = player.lastActive;
        }
    }
    return player;
}

Multiplexer.prototype.update = function() {
    // Update the active player.
    if (this.activePlayer && !this.activePlayer.track.title) {
        console.log("Active player stopped: " + this.activePlayer.name);
        this.activePlayer = null;
    }
    if (!(this.activePlayer && this.activePlayer.state.playing)) {
        for (var id in this.players) {
            var player = this.players[id];
            if (player.state.playing) {
                console.log("Active player is now: " + player.name);
                this.activePlayer = player;
                player.lastActive = Date.now();
                break;
            }
        }
    }
}
