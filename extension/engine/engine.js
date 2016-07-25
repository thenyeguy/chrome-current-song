"use strict";

function Engine() {
    this.native_host = new NativeHostAdapater();
    this.ports = {};
    this.lastMessage = {};
}

Engine.prototype.handleConnection = function(port) {
    console.log("Opened connection from port: " + port.name);
    this.ports[port.name] = port;
    port.onMessage.addListener(this.handleMessage.bind(this));
}

Engine.prototype.handleMessage = function(msg, sender) {
    this.lastMessage = msg;
    this.native_host.writeSong(msg)
}

Engine.prototype.getLastMessage = function() {
    return this.lastMessage;
}

Engine.prototype.update = function() {
    for(var key in this.ports) {
        this.ports[key].postMessage({ "type": "player_state" });
    }
    setTimeout(this.update.bind(this), 1000);
}

Engine.prototype.start = function() {
    this.native_host.connect();
    chrome.runtime.onConnect.addListener(this.handleConnection.bind(this));
    this.update();
}
