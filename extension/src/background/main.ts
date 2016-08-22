/// <reference path='../core/api.ts' />
/// <reference path='../typings/index.d.ts' />

$(document).ready(function() {
    console.log("Starting dispatcher...");
    window.currentSongApi = new CurrentSongApi();
});
