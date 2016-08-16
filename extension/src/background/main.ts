/// <reference path='../core/api.ts' />
/// <reference path='../typings/index.d.ts' />

interface Window { currentSongApi: any; }

$(document).ready(function() {
    console.log("Starting Engine...");
    window.currentSongApi = new EngineApi();
    window.currentSongApi.start();
});
