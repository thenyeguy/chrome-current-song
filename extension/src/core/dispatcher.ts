/// <reference path='lastfm.ts' />
/// <reference path='multiplexer.ts' />
/// <reference path='native.ts' />
/// <reference path='scrobbler.ts' />
/// <reference path='types.ts' />
/// <reference path='../typings/index.d.ts' />

class Dispatcher {
    private playerMux: Multiplexer;
    private nativeHost: NativeHostAdapater;
    private scrobbler: Scrobbler;
    public verbose: boolean;

    constructor(lastfm: LastFmApi, settings: SettingsManager) {
        this.playerMux = new Multiplexer();
        this.nativeHost = new NativeHostAdapater();
        this.scrobbler = new Scrobbler(lastfm, settings);
        this.verbose = false;

        this.nativeHost.connect();
        chrome.commands.onCommand.addListener(this.handleControl.bind(this));
        chrome.runtime.onConnect.addListener(this.handleConnect.bind(this));
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
            if (activePlayer && player != activePlayer && player.state.playing) {
                // Try to take control.
                activePlayer.stop();
            }
        }
        this.update();
    }

    private handleControl(control: string) {
        console.log("Got control request: " + control);

        let control_type;
        if (control == "play_pause") {
            control_type = ControlType.PlayPause;
        } else if (control == "next_song") {
            control_type = ControlType.NextSong;
        } else if (control == "prev_song") {
            control_type = ControlType.PrevSong;
        } else {
            return;
        }

        let player = this.playerMux.getActivePlayer();
        if (player) {
            player.handleControl(control_type);
        }
    }

    private update() {
        this.playerMux.update();
        let state = this.getPlayerState();
        this.nativeHost.update(state);
        this.scrobbler.update(state);
        chrome.runtime.sendMessage({ "update": true });
    }

    public trigger(control: ControlType) {
        let player = this.playerMux.getActivePlayer();
        if (player) {
            player.handleControl(control);
        }
    }

    public getPlayerState(): PlayerState {
        let activePlayer = this.playerMux.getActivePlayer();
        return activePlayer && activePlayer.getState();
    }

    public getScrobbleState(): ScrobbleState {
        return this.scrobbler.getState();
    }
}
