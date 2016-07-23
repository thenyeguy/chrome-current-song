"use strict";

$(document).ready(function() {
    console.log("ready!");
    var background = chrome.extension.getBackgroundPage();
    $("#source").text(background.receiver.getLastMessage());
});
