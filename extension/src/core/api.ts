/// <reference path='dispatcher.ts' />
/// <reference path='lastfm.ts' />

interface Window { currentSongApi: CurrentSongApi; }

class CurrentSongApi {
    private dispatcher: Dispatcher;
    private lastfm: LastFmApi;

    constructor() {
        this.lastfm = new LastFmApi();
        this.dispatcher = new Dispatcher();
    }

    get verbose(): boolean {
        return this.dispatcher.verbose;
    }

    set verbose(value: boolean) {
        this.dispatcher.verbose = value;
    }

    public getPlayerState(): PlayerState {
        return this.dispatcher.getPlayerState();
    }

    public getScrobbleState(): ScrobbleState {
        return this.dispatcher.getScrobbleState();
    }

    public playPause() {
        this.dispatcher.trigger(ControlType.PlayPause);
    }

    public nextSong() {
        this.dispatcher.trigger(ControlType.NextSong);
    }

    public prevSong() {
        this.dispatcher.trigger(ControlType.PrevSong);
    }

    public getCurrentLastFmUser(): string {
        return this.lastfm.getCurrentUser();
    }

    public getLastFmAuthUrl(callback: (string) => void) {
        this.lastfm.getAuthUrl(callback);
    }

    public getLastFmAuthSession(callback: (string) => void) {
        this.lastfm.getAuthSession(callback);
    }
}
