"use strict";

var engineApi = chrome.extension.getBackgroundPage().engineApi;

function update() {
    var msg = engineApi.getLastMessage();
    $("#source").text(msg.source);
    $("#song").text(msg.title);
    $("#artist").text(msg.artist);
    $("#album").text(msg.album);
    $("#playtime").text(msg.playtime + "/" + msg.length);
    $("#state").text(msg.playing ? "playing" : "paused");
    setTimeout(update, 1000);
}

$(document).ready(function() {
    update();
});
