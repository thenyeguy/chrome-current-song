"use strict";

function GpmListener() {
    this.port = chrome.runtime.connect({name: "gpm"});
}

GpmListener.prototype.sendMessage = function(msg) {
    this.port.postMessage(msg);
}

$(document).ready(function() {
    console.log("Starting GPM listener...");
    var listener = new GpmListener();
    listener.sendMessage("Hello");
});
