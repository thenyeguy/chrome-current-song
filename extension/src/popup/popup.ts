/// <reference path='../core/api.ts' />
/// <reference path='../core/types.ts' />
/// <reference path='../typings/index.d.ts' />

function formatTime(time: number): string {
    let minutes = String(Math.floor(time / 60));
    let seconds = String(time % 60);
    if (seconds.length == 1) {
        seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
}

function drawArt(artUri: string) {
    if (artUri) {
        $("#art-icon").hide();
        $("#art-image").show();
        $("#art-image").attr("src", artUri);
    } else {
        $("#art-icon").show();
        $("#art-image").hide();
    }
}

function drawPlaybar(playtime: number, duration: number) {
    let width = 100 * playtime / duration;
    $("#playbar .progress-bar").attr("aria-valuenow", playtime);
    $("#playbar .progress-bar").attr("aria-valuemax", duration);
    $("#playbar .progress-bar").css("width", String(width)+"%");
}

function updateControls(playing: boolean) {
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

function updateScrobble() {
    let enabled = window.api.getSettings().enableScrobbling;
    let scrobbleState = window.api.getScrobbleState();
    if (enabled && scrobbleState == 2) {
        $("#state-scrobbled").addClass("glyphicon-ok");
    } else {
        $("#state-scrobbled").removeClass("glyphicon-ok");
    }
}

function update() {
    let playerState = window.api.getPlayerState();
    if (!playerState || !playerState.track.title) {
        $("#nothing").show();
        $("#nowplaying").hide();
        return;
    } else {
        $("#nothing").hide();
        $("#nowplaying").show();

        $("#state-title").text(playerState.track.title);
        $("#state-artist").text(playerState.track.artist);
        $("#state-album").text(playerState.track.album);
        $("#state-source").text(playerState.player);
        drawArt(playerState.artUri);

        $("#state-playtime").text(formatTime(playerState.playtime));
        $("#state-duration").text(formatTime(playerState.duration));
        drawPlaybar(playerState.playtime, playerState.duration);
        updateControls(playerState.playing);
    }

    updateScrobble();
}

function handleMessage(msg: any) {
    if (msg.update) {
        update();
    } else {
        console.log("Unknown message: %O", msg);
    }
}

function setUpControls() {
    $("#prev-song").click(function (event) {
        window.api.prevSong();
    });
    $("#play-pause").click(function (event) {
        window.api.playPause();
    });
    $("#next-song").click(function (event) {
        window.api.nextSong();
    });
}

$(document).ready(function() {
    window.api = chrome.extension.getBackgroundPage().api;
    chrome.runtime.onMessage.addListener(handleMessage);
    setUpControls();
    update();
});
