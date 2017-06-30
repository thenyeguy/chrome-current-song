/// <reference path='../core/api.ts' />
/// <reference path='../typings/index.d.ts' />

function drawSettings() {
    let settings = window.api.getSettings();

    if (settings.lastFmAuthUser) {
        $("#lastfm .logged-out").hide();
        $("#lastfm .logged-in").show();
        $("#lastfm .username").text(settings.lastFmAuthUser);
    } else {
        $("#lastfm .logged-out").show();
        $("#lastfm .logged-in").hide();
    }

    for (let track of window.api.getLastFmScrobbleHistory().reverse()) {
        let text = track.artist + " - " + track.title;
        $("#scrobble-history").append($("<li>").text(text));
    }
}

$(document).ready(function() {
    window.api = chrome.extension.getBackgroundPage().api;
    drawSettings();

    // Set up tab selection
    $("#option-tabs a").click(function (event) {
        event.preventDefault();
        $(this).tab("show");

        // Store the currently selected tab in the hash value
        var id = $(event.target).attr("href").substr(1);
        window.location.hash = id;
    });

    $("#lastfm-logout-btn").click(function(event) {
        event.preventDefault();
        window.api.deauthorizeLastFm();
        drawSettings();
    });
    $("#lastfm-authenticate-btn").click(function(event) {
        event.preventDefault();
        $("#authenticate-modal").modal("show");
        $("#authenticate-modal .modal-footer").hide();
        $("#authenticate-modal-step-one").show();
        $("#authenticate-modal-step-two").hide();
        $("#authenticate-modal-step-three").hide();
        window.api.getLastFmAuthUrl(function (url) {
            chrome.tabs.create({ url: url });
            $("#authenticate-modal-step-one").hide();
            $("#authenticate-modal-step-two").show();
            $("#authenticate-modal .modal-footer").show();
        });
    });
    $("#authenticate-modal-finish-btn").click(function(event) {
        event.preventDefault();
        $("#authenticate-modal .modal-footer").hide();
        $("#authenticate-modal-step-one").hide();
        $("#authenticate-modal-step-two").hide();
        $("#authenticate-modal-step-three").show();
        window.api.getLastFmAuthSession(function (username) {
            drawSettings();
            $("#authenticate-modal").modal("hide");
        });
    });

    var hash = window.location.hash;
    $('#option-tabs a[href="' + hash + '"]').tab('show');
});
