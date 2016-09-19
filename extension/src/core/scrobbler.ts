/// <reference path='types.ts' />

let SCROBBLE_PERCENT: number = 0.5;
let MINIMUM_DURATION: number = 30;  // 30 seconds
let MAXIMUM_WAIT_TIME: number = 4*60;  // 4 minutes

class Scrobbler {
    private settings: SettingsManager;
    private scrobbleState: ScrobbleState;
    private playerState: PlayerState;
    private listenTime: number;
    private lastUpdate: number;

    constructor(settings: SettingsManager) {
        this.settings = settings;
        this.scrobbleState = ScrobbleState.Waiting;
        this.playerState = null;
        this.listenTime = 0;
        this.lastUpdate = Date.now();
    }

    public getState(): ScrobbleState {
        return this.scrobbleState;
    }

    public update(newState: PlayerState) {
        if (newState == null) {
            // Do nothing.
        } else if (!this.playerState || newState.track != this.playerState.track) {
            this.scrobbleState = ScrobbleState.Waiting;
            this.playerState = newState;
            this.listenTime = 0;
        } else {
            let timeElapsed = Date.now() - this.lastUpdate;
            let playtimeDiff =
                newState.state.playtime - this.playerState.state.playtime;
            this.listenTime += Math.min(timeElapsed, playtimeDiff);
            this.maybeScrobble();
        }
        this.playerState = newState;
        this.lastUpdate = Date.now();

    }

    private maybeScrobble(): boolean {
        if (this.scrobbleState == ScrobbleState.Scrobbled ||
            this.playerState.state.length < MINIMUM_DURATION) {
            return false;
        }
        let played = this.listenTime / this.playerState.state.length;
        if (played > SCROBBLE_PERCENT || this.listenTime > MAXIMUM_WAIT_TIME) {
            this.scrobble();
            return true;
        }
        return false;
    }

    private scrobble() {
        if (!this.settings.enableScrobbling) {
            return;
        }
        console.log("Scrobbled:", this.playerState.track);
        this.scrobbleState = ScrobbleState.Scrobbled;
    }
}
