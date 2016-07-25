"use strict";

var NATIVE_HOST = "com.michaelnye.chrome_current_song.write_song";

function NativeHostAdapater() {
    this.native_port = null;
}

NativeHostAdapater.prototype.handleDisconnect = function() {
    console.log("Native host disconnected.");
    this.native_port = null;
}

NativeHostAdapater.prototype.handleMessage = function(msg) {
    if(msg.type === "log") {
        console.log("[%s]: %s", NATIVE_HOST, msg.value);
    } else {
        console.log("Native host sent unknown message: %O", msg);
    }
}

NativeHostAdapater.prototype.sendMessage = function(msg) {
    if(this.native_port) {
        this.native_port.postMessage(msg);
    }
}

NativeHostAdapater.prototype.update = function(song) {
    if (song) {
        this.sendMessage({ "write": song })
    } else {
        this.sendMessage({ "clear": true });
    }
}

NativeHostAdapater.prototype.connect = function() {
    console.log("Connecting to native host...");
    this.native_port = chrome.runtime.connectNative(NATIVE_HOST);
    this.native_port.onDisconnect.addListener(this.handleDisconnect.bind(this));
    this.native_port.onMessage.addListener(this.handleMessage.bind(this));
}
