/// <reference path='multiplexer.ts' />
/// <reference path='native.ts' />
/// <reference path='types.ts' />
/// <reference path='../typings/index.d.ts' />

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
        let player = this.playerMux.deletePlayer(port.name);
        console.log("Closed connection: %s (%s)", player.id, player.name);
    }

    private handleMessage(msg: any, port: chrome.runtime.Port) {
        let id = port.name;
        let player = this.playerMux.getPlayer(id);
        if (this.verbose) {
            console.log("Got message: %s (%s): %o", player.id, player.name, msg);
        }
        if(msg.name) {
            console.log("Identified connection as: " + msg.name);
            player.setName(msg.name);
        }
        if(msg.track) {
            player.updateTrack(msg.track);
        }
        if(msg.state) {
            player.updateState(msg.state);
            let activePlayer = this.playerMux.getActivePlayer();
            if (activePlayer && player != activePlayer) {
                // Try to take control.
                activePlayer.stop();
            }
        }
        this.update();
    }

    private handleControl(control: string) {
        console.log("Got control request: " + control);
        let player = this.playerMux.getActivePlayer();
        if (player) {
            player.handleControl(control);
        }
    }

    private update() {
        this.playerMux.update();
        let state = this.getPlayerState();
        chrome.runtime.sendMessage({ "update": state });
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
        let activePlayer = this.playerMux.getActivePlayer();
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
