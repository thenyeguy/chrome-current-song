/// <reference path='lastfm.ts' />
/// <reference path='types.ts' />

let SCROBBLE_PERCENT: number = 0.5;
let MINIMUM_DURATION: number = 30;  // 30 seconds
let MAXIMUM_WAIT_TIME: number = 4*60;  // 4 minutes

class Scrobbler {
    private lastfm: LastFmApi;
    private scrobbleState: ScrobbleState;
    private playerState: PlayerState;
    private startTime: number;
    private listenTime: number;
    private lastUpdate: number;

    constructor(lastfm: LastFmApi) {
        this.lastfm = lastfm;
        this.scrobbleState = ScrobbleState.Waiting;
        this.playerState = null;
        this.startTime = 0;
        this.listenTime = 0;
        this.lastUpdate = Date.now();
    }

    public getState(): ScrobbleState {
        return this.scrobbleState;
    }

    public update(newState: PlayerState) {
        if (newState == null) {
            // Do nothing.
        } else if (trackEquals(newState.track,
                               this.playerState && this.playerState.track)) {
            this.maybeScrobble(newState);
        } else {
            this.reset(newState);
        }
        this.playerState = newState;
        this.lastUpdate = Date.now();

    }

    private reset(newState: PlayerState) {
        this.scrobbleState = ScrobbleState.Waiting;
        this.startTime = Math.floor(Date.now() / 1000);
        this.listenTime = 0;
        this.lastfm.updateNowPlaying(newState);

        chrome.browserAction.setBadgeText({ text: "" });
    }

    private maybeScrobble(newState: PlayerState): boolean {
        let timeElapsed = Date.now() - this.lastUpdate;
        let playtimeDiff =
            newState.playtime - this.playerState.playtime;
        this.listenTime += Math.min(timeElapsed, playtimeDiff);

        if (this.scrobbleState == ScrobbleState.Scrobbled ||
            this.playerState.duration < MINIMUM_DURATION) {
            return false;
        }

        let played = this.listenTime / this.playerState.duration;
        if (played > SCROBBLE_PERCENT || this.listenTime > MAXIMUM_WAIT_TIME) {
            this.scrobble();
            return true;
        }

        return false;
    }

    private scrobble() {
        this.lastfm.scrobble(this.playerState.track, this.startTime);
        this.scrobbleState = ScrobbleState.Scrobbled;

        chrome.browserAction.setBadgeText({ text: "✓" });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#689655" });
    }
}
