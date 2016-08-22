/// <reference path='../typings/index.d.ts' />

enum PlayerState {
    Playing, Stopping, Stopped
}

class Player {
    id: string;
    name: string;
    track: Track;
    state: TrackState;
    lastActive: number;  // timestamp

    private port: chrome.runtime.Port;
    private playerState: PlayerState;

    constructor(port: chrome.runtime.Port) {
        this.id = port.name;
        this.name = this.id;
        this.track = new Track("", "", "", "");
        this.state = new TrackState(0, 0, false);
        this.lastActive = 0;

        this.port = port;
        this.playerState = PlayerState.Stopped;
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
            if (this.playerState == PlayerState.Stopped) {
                this.playerState = PlayerState.Playing;
            }
        } else {
            this.playerState = PlayerState.Stopped;
        }
    }

    public stop() {
        if (this.playerState == PlayerState.Playing) {
            this.playerState = PlayerState.Stopping;
            this.handleControl("play_pause");
        }
    }

    public handleControl(control: string) {
        this.port.postMessage({
            "type": "control",
            "control": control,
        });
    }
}
