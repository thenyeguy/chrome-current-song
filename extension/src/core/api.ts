/// <reference path='engine.ts' />

interface Window { currentSongApi: EngineApi; }

class EngineApi {
    private engine: Engine;

    constructor() {
        this.engine = new Engine();
    }

    get verbose(): boolean {
        return this.engine.verbose;
    }

    set verbose(value: boolean) {
        this.engine.verbose = value;
    }

    public start() {
        this.engine.start();
    }

    public getPlayerState() {
        return this.engine.getPlayerState();
    }

    public playPause() {
        this.engine.trigger(ControlType.PlayPause);
    }

    public nextSong() {
        this.engine.trigger(ControlType.NextSong);
    }

    public prevSong() {
        this.engine.trigger(ControlType.PrevSong);
    }
}
