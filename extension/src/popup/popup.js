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
        $("#controls").removeClass("visible");
        $("#play-pause").removeClass("glyphicon-play");
        $("#play-pause").addClass("glyphicon-pause");
    } else {
        $("#controls").addClass("visible");
        $("#play-pause").addClass("glyphicon-play");
        $("#play-pause").removeClass("glyphicon-pause");
    }
}

function update(playerState) {
    if (!playerState) {
        $("#nothing").show();
        $("#nowplaying").hide();
        return;
    }
    $("#nothing").hide();
    $("#nowplaying").show();

    if (playerState.track) {
        $("#nothing").hide();
        $("#nowplaying").show();

        $("#state-title").text(playerState.track.title);
        $("#state-artist").text(playerState.track.artist);
        $("#state-album").text(playerState.track.album);
        $("#state-source").text(playerState.source);
        drawArt(playerState.track.artUri);
    }

    if (playerState.state) {
        $("#state-playtime").text(formatTime(playerState.state.playtime));
        $("#state-length").text(formatTime(playerState.state.length));
        drawPlaybar(playerState.state.playtime, playerState.state.length);
        updateControls(playerState.state.playing);
    }
}

function handleMessage(msg, sender, sendResponse) {
    if ("update" in msg) {
        update(msg["update"]);
    } else {
        console.log("Unknown message: %O", msg);
    }
}

function setUpControls() {
    $("#prev-song").click(function (event) {
        window.currentSongApi.prevSong();
    });
    $("#play-pause").click(function (event) {
        window.currentSongApi.playPause();
    });
    $("#next-song").click(function (event) {
        window.currentSongApi.nextSong();
    });
}

$(document).ready(function() {
    window.currentSongApi = chrome.extension.getBackgroundPage().currentSongApi;
    chrome.extension.onMessage.addListener(handleMessage);
    update(window.currentSongApi.getPlayerState());
    setUpControls();
});
