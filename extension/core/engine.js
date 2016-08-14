"use strict";

function Engine() {
    this.playerMux = new Multiplexer();
    this.nativeHost = new NativeHostAdapater();
    this.verbose = false;
}

Engine.prototype.handleConnect = function(port) {
    console.log("New connection: " + port.name);
    this.playerMux.addPlayer(port);
    port.onMessage.addListener(this.handleMessage.bind(this));
    port.onDisconnect.addListener(this.handleDisconnect.bind(this));
}

Engine.prototype.handleDisconnect = function(port) {
    var player = this.playerMux.deletePlayer(port.name);
    console.log("Closed connection: %s (%s)", player.id, player.name);
}

Engine.prototype.handleMessage = function(msg, port) {
    var id = port.name;
    var player = this.playerMux.getPlayer(id);
    if (this.verbose) {
        console.log("Got message: %s (%s): %o", player.id, player.name, msg);
    }
    if("name" in msg) {
        console.log("Identified connection as: " + msg["name"]);
        player.name = msg["name"];
    }
    if("track" in msg) {
        player.track = msg["track"];
    }
    if("state" in msg) {
        player.state = msg["state"];
        var activePlayer = this.playerMux.getActivePlayer();
        if (msg["state"].playing && activePlayer && id !== activePlayer.id) {
            // Attempt to take control
            this.handleControl("play_pause");
        }
    }
    this.update();
}

Engine.prototype.handleControl = function(control) {
    console.log("Got control request: " + control);
    var player = this.playerMux.getActivePlayer();
    if (player) {
        player.port.postMessage({
            "type": "control",
            "control": control,
        });
    }
}

Engine.prototype.update = function() {
    this.playerMux.update();
    var state = this.getPlayerState();
    chrome.extension.sendMessage({ "update": state });
    this.nativeHost.update(state);
}

Engine.prototype.getPlayerState = function() {
    var activePlayer = this.playerMux.getActivePlayer();
    return activePlayer && {
        "source": activePlayer.name,
        "track": activePlayer.track,
        "state": activePlayer.state,
    }
}

Engine.prototype.start = function() {
    this.nativeHost.connect();
    chrome.commands.onCommand.addListener(this.handleControl.bind(this));
    chrome.runtime.onConnect.addListener(this.handleConnect.bind(this));
}
