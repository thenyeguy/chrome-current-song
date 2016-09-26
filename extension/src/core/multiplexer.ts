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
        return this.activePlayer;
    }

    public update() {
        if (this.activePlayer && this.activePlayer.isActive()) {
            return;
        }

        let lastActive = 0;
        let newPlayer = null;
        for (let id in this.players) {
            let player = this.players[id];
            if (player.isActive()) {
                newPlayer = player;
                break;
            } else if (player.lastActive > lastActive && player.getState()) {
                lastActive = player.lastActive;
                newPlayer = player;
            }
        }
        if (newPlayer && newPlayer != this.activePlayer) {
            console.log("Active player is now:", newPlayer.name);
            this.activePlayer = newPlayer;
            newPlayer.lastActive = Date.now();
        }
    }
}
