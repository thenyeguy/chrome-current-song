/// <reference path='lastfm.ts' />
/// <reference path='settings.ts' />
/// <reference path='types.ts' />
/// <reference path='../typings/index.d.ts' />

class Player {
    id: string;
    name: string;
    properties: PlayerProperties;
    state: PlayerState;
    lastActive: number;  // timestamp

    private port: chrome.runtime.Port;
    private stopping: boolean;

    constructor(port: chrome.runtime.Port, lastfm: LastFmApi,
        settings: SettingsManager) {
        this.id = port.name;
        this.name = this.id;
        this.state = null;
        this.lastActive = 0;

        this.port = port;
        this.stopping = true;
    }

    public isActive(): boolean {
        return this.state && this.state.playState == PlaybackState.Playing;
    }

    public getState(): PlayerState {
        return this.state;
    }

    public setProperties(properties: PlayerProperties) {
        this.name = properties.name;
        this.properties = properties;
    }

    public update(state: PlayerState) {
        if (state.track.title == "" || state.playState == PlaybackState.Stopped) {
            this.state = null;
        } else {
            this.state = state;
            if (this.stopping && this.state.playState != PlaybackState.Playing) {
                this.stopping = false;
            }
        }
    }

    public stop() {
        if (this.isActive() && !this.stopping) {
            this.stopping = true;
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
