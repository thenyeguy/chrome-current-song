"use strict";

function Engine() {
    this.activePlayer = null;
    this.players = {};
    this.nativeHost = new NativeHostAdapater();
    this.verbose = false;
}

Engine.prototype.handleConnect = function(port) {
    var id = port.name;
    console.log("New connection: " + id);
    this.players[id] = {
        id: id,
        name: id,
        port: port,
        track: new Track(),
        state: new TrackState(),
    }
    port.onMessage.addListener(this.handleMessage.bind(this));
    port.onDisconnect.addListener(this.handleDisconnect.bind(this));
}

Engine.prototype.handleDisconnect = function(port) {
    var id = port.name;
    console.log("Closed connection: %s (%s)", this.players[id].id,
                this.players[id].name);
    if (this.activePlayer && id === this.activePlayer.id) {
        this.activePlayer = null;
    }
    delete this.players[id];
    this.update();
}


Engine.prototype.handleMessage = function(msg, port) {
    var id = port.name;
    if (this.verbose) {
        console.log("Got message: %s (%s): %o", this.players[id].id,
                    this.players[id].name, msg);
    }
    if("name" in msg) {
        console.log("Identified connection as: " + msg["name"]);
        this.players[id].name = msg["name"];
    }
    if("track" in msg) {
        this.players[id].track = msg["track"];
    }
    if("state" in msg) {
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
