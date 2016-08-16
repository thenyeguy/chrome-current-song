/// <reference path='../core/api.ts' />
/// <reference path='../typings/index.d.ts' />

$(document).ready(function() {
    console.log("Starting Engine...");
    window.currentSongApi = new EngineApi();
    window.currentSongApi.start();
});
