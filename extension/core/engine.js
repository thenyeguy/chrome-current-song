"use strict";

function Engine() {
    this.activePlayer = null;
    this.players = {};
    this.nativeHost = new NativeHostAdapater();
    this.verbose = false;
}

Engine.prototype.handleConnect = function(port) {
    console.log("Opened connection to: " + port.name);
    var id = port.sender.id;
    this.players[id] = {
        connected: true,
        id: id,
        name: port.name,
        port: port,
        track: new Track(),
        state: new TrackState(),
    }
    port.onMessage.addListener(this.handleMessage.bind(this));
    port.onDisconnect.addListener(this.handleDisconnect.bind(this));
}

Engine.prototype.handleDisconnect = function(port) {
    console.log("Closed connection to: " + port.name);
    var id = port.sender.id;
    this.players[id].connected = false;
    this.update();
}


Engine.prototype.handleMessage = function(msg, port) {
    if (this.verbose) {
        console.log("Got message from port %s: %o", port.name, msg);
    }
    var id = port.sender.id;
    if(msg["track"]) {
        this.players[id].track = msg["track"];
    }
    if(msg["state"]) {
        this.players[id].state = msg["state"];
    }
    this.update();
}

Engine.prototype.handleControl = function(control) {
    console.log("Got control request: " + control);
    if (this.activePlayer) {
        this.activePlayer.port.postMessage({
            "type": "control",
            "control": control,
        });
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
                break;
            }
        }
    }

    // Update our hosts.
    var state = this.getPlayerState();
    chrome.extension.sendMessage({ "update": state });
    this.nativeHost.update(state);
}

Engine.prototype.getPlayerState = function() {
    return this.activePlayer && {
        "source": this.activePlayer.name,
        "track": this.activePlayer.track,
        "state": this.activePlayer.state,
    }
}

Engine.prototype.start = function() {
    this.nativeHost.connect();
    chrome.commands.onCommand.addListener(this.handleControl.bind(this));
    chrome.runtime.onConnect.addListener(this.handleConnect.bind(this));
}
