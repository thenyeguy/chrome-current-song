"use strict";

function Receiver() {
    this.ports = {};
    this.lastMessage = {};
}

Receiver.prototype.handleConnection = function(port) {
    console.log("Opened connection from port: " + port.name);
    this.ports[port.name] = port;
    port.onMessage.addListener(this.handleMessage.bind(this));
}

Receiver.prototype.handleMessage = function(msg, sender) {
    console.log("Got message from " + sender.name + ":\n%O", msg);
    this.lastMessage = msg;
}

Receiver.prototype.getLastMessage = function () {
    return this.lastMessage;
}

Receiver.prototype.start = function() {
    chrome.runtime.onConnect.addListener(this.handleConnection.bind(this));
}

var receiver = new Receiver();
$(document).ready(function() {
    console.log("Starting Receiver...");
    receiver.start();
});
