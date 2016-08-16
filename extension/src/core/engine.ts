/// <reference path='multiplexer.ts' />
/// <reference path='native.ts' />
/// <reference path='types.ts' />

enum ControlType {
    PlayPause, NextSong, PrevSong
}

class Engine {
    private playerMux: Multiplexer;
    private nativeHost: NativeHostAdapater;
    public verbose: boolean;

    constructor() {
        this.playerMux = new Multiplexer();
        this.nativeHost = new NativeHostAdapater();
        this.verbose = false;
    }

    private handleConnect(port: chrome.runtime.Port) {
        console.log("New connection: " + port.name);
        this.playerMux.addPlayer(port);
        port.onMessage.addListener(this.handleMessage.bind(this));
        port.onDisconnect.addListener(this.handleDisconnect.bind(this));
    }

    private handleDisconnect(port: chrome.runtime.Port) {
        var player = this.playerMux.deletePlayer(port.name);
        console.log("Closed connection: %s (%s)", player.id, player.name);
    }

    private handleMessage(msg: any, port: chrome.runtime.Port) {
        var id = port.name;
        var player = this.playerMux.getPlayer(id);
        if (this.verbose) {
            console.log("Got message: %s (%s): %o", player.id, player.name, msg);
        }
        if("name" in msg) {
            console.log("Identified connection as: " + msg["name"]);
            player.name = msg["name"];
        }
        if("track" in msg) {
            player.track = msg["track"];
        }
        if("state" in msg) {
            player.state = msg["state"];
            var activePlayer = this.playerMux.getActivePlayer();
            if (msg["state"].playing && activePlayer && id !== activePlayer.id) {
                // Attempt to take control
                this.handleControl("play_pause");
            }
        }
        this.update();
    }

    private handleControl(control: string) {
        console.log("Got control request: " + control);
        var player = this.playerMux.getActivePlayer();
        if (player) {
            player.port.postMessage({
                "type": "control",
                "control": control,
            });
        }
    }

    private update() {
        this.playerMux.update();
        var state = this.getPlayerState();
        chrome.extension.sendRequest({ "update": state });
        this.nativeHost.update(state);
    }

    public trigger(control: ControlType) {
        if (control == ControlType.PlayPause) {
            this.handleControl("play_pause");
        } else if (control == ControlType.NextSong) {
            this.handleControl("next_song");
        } else if (control == ControlType.PrevSong) {
            this.handleControl("prev_song");
        }
    }

    public getPlayerState() {
        var activePlayer = this.playerMux.getActivePlayer();
        return activePlayer && {
            "source": activePlayer.name,
            "track": activePlayer.track,
            "state": activePlayer.state,
        }
    }

    public start() {
        this.nativeHost.connect();
        chrome.commands.onCommand.addListener(this.handleControl.bind(this));
        chrome.runtime.onConnect.addListener(this.handleConnect.bind(this));
    }
}
