/// <reference path='../core/api.ts' />
/// <reference path='../typings/index.d.ts' />

function drawSettings() {
    let settings =
        chrome.extension.getBackgroundPage().api.getSettings();

    $("#enable-scrobbling input").prop("checked", settings.enableScrobbling);
    $("#enable-scrobbling input").change(function() {
        settings.enableScrobbling = this.checked;
    });

    if (settings.lastFmAuthUser) {
        $("#enable-scrobbling .authenticate").hide();
        $("#enable-scrobbling .logged-out").hide();
        $("#enable-scrobbling .logged-in").show();
        $("#enable-scrobbling .username").text(settings.lastFmAuthUser);
    } else {
        $("#enable-scrobbling .logged-out").show();
        $("#enable-scrobbling .logged-in").hide();
    }
}

$(document).ready(function() {
    let api = chrome.extension.getBackgroundPage().api;
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
        api.deauthorizeLastFm();
        drawSettings();
    });
    $("#lastfm-authenticate-btn").click(function(event) {
        event.preventDefault();
        $("#authenticate-modal").modal("show");
        $("#authenticate-modal .modal-footer").hide();
        $("#authenticate-modal-step-one").show();
        $("#authenticate-modal-step-two").hide();
        $("#authenticate-modal-step-three").hide();
        api.getLastFmAuthUrl(function (url) {
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
        api.getLastFmAuthSession(function (username) {
            drawSettings();
            $("#authenticate-modal").modal("hide");
        });
    });

    var hash = window.location.hash;
    $('#option-tabs a[href="' + hash + '"]').tab('show');
});
