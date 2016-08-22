/// <reference path='dispatcher.ts' />

interface Window { currentSongApi: CurrentSongApi; }

class CurrentSongApi {
    private dispatcher: Dispatcher;

    constructor() {
        this.dispatcher = new Dispatcher();
    }

    get verbose(): boolean {
        return this.dispatcher.verbose;
    }

    set verbose(value: boolean) {
        this.dispatcher.verbose = value;
    }

    public getPlayerState() {
        return this.dispatcher.getPlayerState();
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
}
