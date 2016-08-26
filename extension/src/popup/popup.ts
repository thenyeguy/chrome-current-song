/// <reference path='../core/api.ts' />
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

function drawPlaybar(playtime: number, length: number) {
    let width = 100 * playtime / length;
    $("#playbar .progress-bar").attr("aria-valuenow", playtime);
    $("#playbar .progress-bar").attr("aria-valuemax", length);
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
    let scrobbleState = window.currentSongApi.getScrobbleState();
    if (scrobbleState == 1) {
        $("#state-scrobbled").addClass("glyphicon-ok");
    } else {
        $("#state-scrobbled").removeClass("glyphicon-ok");
    }
}

function update(playerState: any) {
    if (!playerState) {
        $("#nothing").show();
        $("#nowplaying").hide();
        return;
    } else {
      $("#nothing").hide();
      $("#nowplaying").show();
    }

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

    updateScrobble();
}

function handleMessage(msg: any) {
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
    chrome.runtime.onMessage.addListener(handleMessage);
    update(window.currentSongApi.getPlayerState());
    setUpControls();
});
