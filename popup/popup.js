"use strict";

$(document).ready(function() {
    console.log("ready!");
    var background = chrome.extension.getBackgroundPage();
    var msg = background.engine.getLastMessage();
    $("#source").text(msg.source);
    $("#song").text(msg.song.title);
    $("#artist").text(msg.song.artist);
    $("#album").text(msg.song.album);
});
