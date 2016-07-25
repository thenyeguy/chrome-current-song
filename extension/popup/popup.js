"use strict";

var engineApi = chrome.extension.getBackgroundPage().engineApi;

function update() {
    var state = engineApi.getPlayerState();
    if(state) {
        $("#source").text(state.source);
        $("#song").text(state.title);
        $("#artist").text(state.artist);
        $("#album").text(state.album);
        $("#playtime").text(state.playtime + "/" + state.length);
        $("#state").text(state.playing ? "playing" : "paused");
    }
    setTimeout(update, 1000);
}

$(document).ready(function() {
    update();
});
