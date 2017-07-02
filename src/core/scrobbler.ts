/// <reference path='lastfm.ts' />
/// <reference path='types.ts' />
/// <reference path='utils.ts' />

let SCROBBLE_PERCENT: number = 0.5;
let MINIMUM_DURATION: number = 30;  // 30 seconds
let MAXIMUM_WAIT_TIME: number = 4 * 60;  // 4 minutes

class Scrobbler {
    private lastfm: LastFmApi;
    private scrobbleState: ScrobbleState;
    private playerState: PlayerState;
    private startTime: number;
    private listenTime: number;
    private lastUpdate: number;

    static SCROBBLE_HISTORY_SIZE = 10;
    private scrobbleHistory: Ringbuffer<Track>;

    constructor(lastfm: LastFmApi) {
        this.lastfm = lastfm;
        this.scrobbleState = ScrobbleState.Waiting;
        this.playerState = null;
        this.startTime = 0;
        this.listenTime = 0;
        this.lastUpdate = Date.now();

        this.scrobbleHistory =
            new Ringbuffer<Track>(Scrobbler.SCROBBLE_HISTORY_SIZE);
    }

    public getState(): ScrobbleState {
        return this.scrobbleState;
    }

    public getScrobbleHistory(): Track[] {
        return [...this.scrobbleHistory];
    }

    public update(newState: PlayerState) {
        if (newState == null) {
            this.reset();
        } else if (trackEquals(newState.track,
            this.playerState && this.playerState.track)) {
            this.maybeScrobble(newState);
        } else {
            this.lastfm.updateNowPlaying(newState);
            this.reset();
        }
        this.playerState = newState;
        this.lastUpdate = Date.now();
    }

    private reset() {
        this.scrobbleState = ScrobbleState.Waiting;
        this.startTime = Math.floor(Date.now() / 1000);
        this.listenTime = 0;

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
        let track = this.playerState.track;
        this.lastfm.scrobble(track, this.startTime);
        this.scrobbleState = ScrobbleState.Scrobbled;

        this.scrobbleHistory.push(track);
        chrome.browserAction.setBadgeText({ text: "✓" });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#689655" });
    }
}
