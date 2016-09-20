/// <reference path='lastfm.ts' />
/// <reference path='scrobbler.ts' />
/// <reference path='settings.ts' />
/// <reference path='types.ts' />
/// <reference path='../typings/index.d.ts' />

enum InternalPlayerState {
    Playing, Stopping, Stopped
}

class Player {
    id: string;
    name: string;
    properties: PlayerProperties;
    track: Track;
    state: TrackState;
    lastActive: number;  // timestamp

    private port: chrome.runtime.Port;
    private playerState: InternalPlayerState;
    private scrobbler: Scrobbler;

    constructor(port: chrome.runtime.Port, lastfm: LastFmApi,
                settings: SettingsManager) {
        this.id = port.name;
        this.name = this.id;
        this.track = new Track("", "", "", "");
        this.state = new TrackState(0, 0, false);
        this.lastActive = 0;

        this.port = port;
        this.playerState = InternalPlayerState.Stopped;
        this.scrobbler = new Scrobbler(lastfm, settings);
    }

    public getState(): PlayerState {
        return new PlayerState(this.name, this.track, this.state);
    }

    public getScrobbleState(): ScrobbleState {
        if (this.properties.allowScrobbling) {
            return this.scrobbler.getState();
        } else {
            return ScrobbleState.Disabled;
        }
    }

    public setProperties(properties: PlayerProperties) {
        this.name = properties.name;
        this.properties = properties;
    }

    public update(track: Track, state: TrackState) {
        if (track) {
            this.track = track;
        }
        if (state) {
            this.state = state;
            if (state.playing) {
                if (this.playerState == InternalPlayerState.Stopped) {
                    this.playerState = InternalPlayerState.Playing;
                }
            } else {
                this.playerState = InternalPlayerState.Stopped;
            }
        }
        if (this.properties.allowScrobbling) {
            this.scrobbler.update(this.getState());
        }
    }

    public stop() {
        if (this.playerState == InternalPlayerState.Playing) {
            this.playerState = InternalPlayerState.Stopping;
            this.handleControl(ControlType.PlayPause);
        }
    }

    public handleControl(control: ControlType) {
        this.port.postMessage({
            "type": "control",
            "control": control,
        });
    }
}
