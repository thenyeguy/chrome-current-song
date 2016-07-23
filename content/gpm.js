"use strict";

$(document).ready(function() {
    console.log("Starting GPM listener...");

    var port = chrome.runtime.connect({name: "gpm"});
    port.postMessage();
    port.onMessage.addListener(function(msg) {
        console.log("Got message!");
        port.postMessage(msg);
    });
});
