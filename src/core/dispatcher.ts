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

    constructor(lastfm: LastFmApi, settings: SettingsManager) {
        this.playerMux = new Multiplexer(lastfm, settings);
        this.nativeHost = new NativeHostAdapater();
        this.scrobbler = new Scrobbler(lastfm);

        this.nativeHost.connect();
        chrome.commands.onCommand.addListener(this.handleControl.bind(this));
        chrome.runtime.onConnect.addListener(this.handleConnect.bind(this));
    }

    private handleConnect(port: chrome.runtime.Port) {
        console.log("New connection: " + port.name);
        this.playerMux.addPlayer(port);
        port.onMessage.addListener(this.handleMessage.bind(this));
        port.onDisconnect.addListener(this.handleDisconnect.bind(this));
        this.update();
    }

    private handleDisconnect(port: chrome.runtime.Port) {
        let player = this.playerMux.deletePlayer(port.name);
        console.log("Closed connection: %s (%s)", player.id, player.name);
        this.update();
    }

    private handleMessage(msg: any, port: chrome.runtime.Port) {
        let id = port.name;
        let player = this.playerMux.getPlayer(id);
        console.debug("Got message: %s (%s): %o", player.id, player.name, msg);

        if(msg.properties) {
            console.log("Identified connection as: " + msg.properties.name);
            player.setProperties(msg.properties);
        }
        if(msg.state) {
            player.update(msg.state);
            let activePlayer = this.playerMux.getActivePlayer();
            if (activePlayer && player != activePlayer && player.isActive()) {
                // Try to take control.
                activePlayer.stop();
            }
        }
        this.update();
    }

    private handleControl(control: string) {
        console.log("Got control request: " + control);
        if (control == "play_pause") {
            this.trigger(ControlType.PlayPause);
        } else if (control == "next_song") {
            this.trigger(ControlType.NextSong);
        } else if (control == "prev_song") {
            this.trigger(ControlType.PrevSong);
        } else {
            console.error("Unknown control:", control);
        }
    }

    private update() {
        this.playerMux.update();
        this.nativeHost.update(this.getPlayerState());
        this.scrobbler.update(this.getPlayerState());
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
        let activePlayer = this.playerMux.getActivePlayer();
        if (activePlayer && !activePlayer.properties.allowScrobbling) {
            return ScrobbleState.Disabled;
        } else {
            return this.scrobbler.getState();
        }
    }

}
