/// <reference path='types.ts' />
/// <reference path='../typings/index.d.ts' />

enum InternalPlayerState {
    Playing, Stopping, Stopped
}

class Player {
    id: string;
    name: string;
    track: Track;
    state: TrackState;
    lastActive: number;  // timestamp

    private port: chrome.runtime.Port;
    private playerState: InternalPlayerState;

    constructor(port: chrome.runtime.Port) {
        this.id = port.name;
        this.name = this.id;
        this.track = new Track("", "", "", "");
        this.state = new TrackState(0, 0, false);
        this.lastActive = 0;

        this.port = port;
        this.playerState = InternalPlayerState.Stopped;
    }

    public getState(): PlayerState {
        return new PlayerState(this.name, this.track, this.state);
    }

    public setName(name: string) {
        this.name = name;
    }

    public updateTrack(track: Track) {
        this.track = track;
    }

    public updateState(state: TrackState) {
        this.state = state;
        if (state.playing) {
            if (this.playerState == InternalPlayerState.Stopped) {
                this.playerState = InternalPlayerState.Playing;
            }
        } else {
            this.playerState = InternalPlayerState.Stopped;
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
