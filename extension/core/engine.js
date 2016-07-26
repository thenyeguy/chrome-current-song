"use strict";

function Engine() {
    this.activePlayer = null;
    this.players = {};
    this.nativeHost = new NativeHostAdapater();
}

Engine.prototype.handleConnect = function(port) {
    console.log("Opened connection to: " + port.name);
    var id = port.sender.id;
    this.players[id] = {
        connected: true,
        id: id,
        name: port.name,
        port: port,
        state: {}
    }
    port.onMessage.addListener(this.handleMessage.bind(this));
    port.onDisconnect.addListener(this.handleDisconnect.bind(this));
}

Engine.prototype.handleDisconnect = function(port) {
    console.log("Closed connection to: " + port.name);
    var id = port.sender.id;
    this.players[id].connected = false;
}


Engine.prototype.handleMessage = function(msg, port) {
    var id = port.sender.id;
    if(msg.type === "player_state") {
        delete msg["type"];
        this.players[id].state = msg;
    }
}

Engine.prototype.getPlayerState = function() {
    return this.activePlayer && this.activePlayer.state;
}

Engine.prototype.playPause = function() {
    if (this.activePlayer) {
        this.activePlayer.port.postMessage({ "type": "play_pause" });
    }
}

Engine.prototype.update = function() {
    // Prune any disconnected players.
    for (var id in this.players) {
        if (!this.players[id].connected) {
            if (this.activePlayer && this.activePlayer.id === id) {
                this.activePlayer = null;
            }
            delete this.players[id];
        }
    }

    // Update the active player.
    if (this.activePlayer && !this.activePlayer.state.title) {
        console.log("Active player stopped: " + this.activePlayer.name);
        this.activePlayer = null;
    }
    if (!this.activePlayer || !this.activePlayer.state.playing) {
        for (var id in this.players) {
            var player = this.players[id];
            if (player.state.playing) {
                console.log("Active player is now: " + player.name);
                this.activePlayer = player;
                break;
            }
        }
    }

    // Update the native host
    if (this.activePlayer) {
        this.nativeHost.update(this.activePlayer.state);
    } else {
        this.nativeHost.update(null);
    }

    // Trigger another round of state updates.
    for(var id in this.players) {
        this.players[id].port.postMessage({ "type": "player_state" });
    }
    setTimeout(this.update.bind(this), 1000);
}

Engine.prototype.start = function() {
    this.nativeHost.connect();
    chrome.runtime.onConnect.addListener(this.handleConnect.bind(this));
    this.update();
}
