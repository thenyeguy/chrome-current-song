/// <reference path='../core/api.ts' />
/// <reference path='../typings/index.d.ts' />

$(document).ready(function() {
    let api = chrome.extension.getBackgroundPage().currentSongApi;

    $("#option-tabs a").click(function (event) {
        event.preventDefault();
        $(this).tab("show");

        // Store the currently selected tab in the hash value
        var id = $(event.target).attr("href").substr(1);
        window.location.hash = id;
    });

    $("#scrobbling-enable .username").text(api.getCurrentLastFmUser());

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
            $("#authenticate-modal").modal("hide");
            $("#scrobbling-enable .username").text(username);
        });
    });

    var hash = window.location.hash;
    $('#option-tabs a[href="' + hash + '"]').tab('show');
});