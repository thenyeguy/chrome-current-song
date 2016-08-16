/// <reference path='../typings/index.d.ts' />
//
class Player {
    id: string;
    name: string;
    port: chrome.runtime.Port;
    track: Track;
    state: TrackState;
    lastActive: number;  // timestamp
}

class Multiplexer {
    private activePlayer: Player;
    private players: {[key: string]: Player};

    constructor() {
        this.activePlayer = null;
        this.players = {};
    }

    public addPlayer(port) {
        let id = port.name;
        this.players[id] = {
            id: id,
            name: id,
            port: port,
            track: new Track("", "", "", ""),
            state: new TrackState(0, 0, false),
            lastActive: 0,
        };
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
        if (this.activePlayer && !this.activePlayer.track.title) {
            console.log("Active player stopped: " + this.activePlayer.name);
            this.activePlayer = null;
        }
        if (!(this.activePlayer && this.activePlayer.state.playing)) {
            for (let id in this.players) {
                let player = this.players[id];
                if (player.state.playing) {
                    console.log("Active player is now: " + player.name);
                    this.activePlayer = player;
                    player.lastActive = Date.now();
                    break;
                }
            }
        }
    }
}