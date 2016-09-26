enum ControlType {
    PlayPause, NextSong, PrevSong,
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
    playtime: number;
    length: number;
    playing: boolean;
    artUri: string;
}

class PlayerProperties {
    name: string;
    allowScrobbling: boolean;
}
