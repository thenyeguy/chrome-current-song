/// <reference path='dispatcher.ts' />
/// <reference path='lastfm.ts' />
/// <reference path='settings.ts' />

interface Window { api: ExtensionApi; }

class ExtensionApi {
    private dispatcher: Dispatcher;
    private lastfm: LastFmApi;
    private settings: SettingsManager;

    constructor() {
        this.settings = new SettingsManager();
        this.lastfm = new LastFmApi(this.settings);
        this.dispatcher = new Dispatcher(this.lastfm, this.settings);
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

    public getScrobbleHistory(): Track[] {
        return this.dispatcher.getScrobbleHistory();
    }


    public getLastFmAuthUrl(callback: (string) => void) {
        this.lastfm.getAuthUrl(callback);
    }

    public getLastFmAuthSession(callback: (string) => void) {
        this.lastfm.getAuthSession(callback);
    }

    public deauthorizeLastFm() {
        this.lastfm.deauthorize();
    }
}
