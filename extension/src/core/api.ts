/// <reference path='dispatcher.ts' />
/// <reference path='lastfm.ts' />
/// <reference path='settings.ts' />

interface Window { currentSongApi: CurrentSongApi; }

class CurrentSongApi {
    private dispatcher: Dispatcher;
    private lastfm: LastFmApi;
    private settings: SettingsManager;

    constructor() {
        this.settings = new SettingsManager();

        this.dispatcher = new Dispatcher(this.settings);
        this.lastfm = new LastFmApi(this.settings);
    }

    get verbose(): boolean {
        return this.dispatcher.verbose;
    }

    set verbose(value: boolean) {
        this.dispatcher.verbose = value;
    }

    public getSettings(): SettingsManager {
        return this.settings;
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

    public getLastFmAuthUrl(callback: (string) => void) {
        this.lastfm.getAuthUrl(callback);
    }

    public getLastFmAuthSession(callback: (string) => void) {
        this.lastfm.getAuthSession(callback);
    }
}
