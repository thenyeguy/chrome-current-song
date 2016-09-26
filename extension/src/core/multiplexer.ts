/// <reference path='lastfm.ts' />
/// <reference path='player.ts' />
/// <reference path='settings.ts' />
/// <reference path='../typings/index.d.ts' />

class Multiplexer {
    private activePlayer: Player;
    private players: {[key: string]: Player};

    private lastfm: LastFmApi;
    private settings: SettingsManager;

    constructor(lastfm: LastFmApi, settings: SettingsManager) {
        this.activePlayer = null;
        this.players = {};

        this.lastfm = lastfm;
        this.settings = settings;
    }

    public addPlayer(port: chrome.runtime.Port) {
        let player = new Player(port, this.lastfm, this.settings);
        this.players[player.id] = player;
    }

    public getPlayer(id: string): Player {
        return this.players[id];
    }

    public deletePlayer(id: string): Player {
        let player = this.players[id];
        if (this.activePlayer && id === this.activePlayer.id) {
            this.activePlayer = null;
        }
        delete this.players[id];
        return player;
    }

    public getActivePlayer(): Player {
        if (this.activePlayer) {
            return this.activePlayer;
        }

        let lastActive = 0;
        let player = null;
        for (let id in this.players) {
            if (this.players[id].lastActive > lastActive) {
                player = this.players[id];
                lastActive = player.lastActive;
            }
        }
        return player;
    }

    public update() {
        // Update the active player.
        let activeState = this.activePlayer && this.activePlayer.state;
        if (activeState && !activeState.track.title) {
            console.log("Active player stopped: " + this.activePlayer.name);
            this.activePlayer = null;
            activeState = null;
        }

        if (!(this.activePlayer && this.activePlayer.isActive())) {
            for (let id in this.players) {
                let player = this.players[id];
                if (player.state &&
                    player.state.playState == PlaybackState.Playing) {
                    console.log("Active player is now: " + player.name);
                    this.activePlayer = player;
                    player.lastActive = Date.now();
                    break;
                }
            }
        }
    }
}
