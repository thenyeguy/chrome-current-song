"use strict";

$(document).ready(function() {
    console.log("ready!");
    var background = chrome.extension.getBackgroundPage();
    var msg = background.engine.getLastMessage();
    console.log(msg);
    $("#source").text(msg.source);
    $("#song").text(msg.title);
    $("#artist").text(msg.artist);
    $("#album").text(msg.album);
    $("#state").text(msg.playing ? "playing" : "paused");
});
