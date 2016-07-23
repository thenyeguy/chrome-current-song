"use strict";

chrome.runtime.onConnect.addListener(function(port) {
    console.log("got connection from port: " + port.name);

    port.postMessage("hello!");
    port.onMessage.addListener(function(msg) {
        console.log("Got response: " + msg);
    });
});

$(document).ready(function() {
    console.log("ready!");
});
