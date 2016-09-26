enum ControlType {
    PlayPause, NextSong, PrevSong,
}

enum PlaybackState {
    Playing, Paused, Stopped,
}

enum ScrobbleState {
    Disabled, Waiting, Scrobbled,
}

class Track {
    title: string;
    artist: string;
    album: string;
}

class PlayerState {
    player: string;
    track: Track;
    playState: PlaybackState;
    playtime: number;
    duration: number;
    artUri: string;
}

class PlayerProperties {
    name: string;
    allowScrobbling: boolean;
}
