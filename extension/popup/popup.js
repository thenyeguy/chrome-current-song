"use strict";

function formatTime(time) {
    var minutes = Math.floor(time / 60);
    var seconds = time % 60;
    if (seconds < 10) {
        seconds = "0"+seconds;
    }
    return minutes + ":" + seconds;
}

function drawArt(artUri) {
    if (artUri) {
        $("#art-icon").hide();
        $("#art-image").show();
        $("#art-image").attr("src", artUri);
    } else {
        $("#art-icon").show();
        $("#art-image").hide();
    }
}

function drawPlaybar(playtime, length) {
    var width = 100 * playtime / length;
    $("#playbar .progress-bar").attr("aria-valuenow", playtime);
    $("#playbar .progress-bar").attr("aria-valuemax", length);
    $("#playbar .progress-bar").css("width", width+"%");
}

function updateControls(playing) {
    if (playing) {
        $("#play-pause").removeClass("glyphicon-play");
        $("#play-pause").addClass("glyphicon-pause");
    } else {
        $("#play-pause").addClass("glyphicon-play");
        $("#play-pause").removeClass("glyphicon-pause");
    }
}

function update() {
    var state = window.engineApi.getPlayerState();
    if (state) {
        $("#nothing").hide();
        $("#nowplaying").show();

        $("#state-title").text(state.title);
        $("#state-artist").text(state.artist);
        $("#state-album").text(state.album);
        $("#state-source").text(state.source);

        $("#state-playtime").text(formatTime(state.playtime));
        $("#state-length").text(formatTime(state.length));

        drawArt(state.art_uri);
        drawPlaybar(state.playtime, state.length);
        updateControls(state.playing);
    } else {
        $("#nothing").show();
        $("#nowplaying").hide();
    }
    setTimeout(update, 1000);
}

function setUpControls() {
    $("#prev-song").click(function (event) {
        window.engineApi.prevSong();
    });
    $("#play-pause").click(function (event) {
        window.engineApi.playPause();
    });
    $("#next-song").click(function (event) {
        window.engineApi.nextSong();
    });
}

$(document).ready(function() {
    window.engineApi = chrome.extension.getBackgroundPage().engineApi;
    setUpControls();
    update();
});
