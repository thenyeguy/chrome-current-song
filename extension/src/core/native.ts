/// <reference path='types.ts' />
/// <reference path='../typings/index.d.ts' />

class NativeHostAdapater {
    private static NATIVE_HOST = "com.michaelnye.chrome_current_song.write_song";
    private native_port: chrome.runtime.Port;

    constructor() {
        this.native_port = null;
    }

    public handleDisconnect() {
        console.log("Native host disconnected.");
        this.native_port = null;
    }

    public handleMessage(msg: any) {
        if(msg.type === "log") {
            console.log("[%s]: %s", NativeHostAdapater.NATIVE_HOST, msg.value);
        } else {
            console.log("Native host sent unknown message: %O", msg);
        }
    }

    public sendMessage(msg: any) {
        if (this.native_port) {
            this.native_port.postMessage(msg);
        }
    }

    public update(playerState: PlayerState) {
        if (!playerState || playerState.playState == PlaybackState.Stopped) {
            this.sendMessage({ clear: true });
        } else {
            this.sendMessage({ write: {
                title: playerState.track.title,
                album: playerState.track.album,
                artist: playerState.track.artist,
                playing: playerState.playState == PlaybackState.Playing,
            }});
        }
    }

    public connect() {
        console.log("Connecting to native host...");
        this.native_port = chrome.runtime.connectNative(
            NativeHostAdapater.NATIVE_HOST);
        this.native_port.onDisconnect.addListener(
            this.handleDisconnect.bind(this));
        this.native_port.onMessage.addListener(this.handleMessage.bind(this));
    }
}
