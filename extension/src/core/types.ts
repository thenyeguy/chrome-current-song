function toSeconds(playtime: any): number {
    if (playtime === null || playtime === undefined) {
        return null;
    }

    if (typeof playtime === "number") {
        return playtime;
    }

    let match = playtime.match(/(\d+):(\d+)/);
    if(match && match.length === 3) {
        let minutes = parseInt(match[1]);
        let seconds = parseInt(match[2]);
        return 60*minutes + seconds;
    }

    let intValue = parseInt(playtime);
    if (typeof intValue === "number" && intValue != NaN) {
        return intValue;
    }

    return null;
}

enum ControlType {
    PlayPause, NextSong, PrevSong
}

class Track {
    constructor(public title: string, public artist: string,
                public album: string, public artUri: string) {}


    public static fromJson(obj: any): Track {
        return new Track(obj.title || "",
                         obj.artist || "",
                         obj.album || "",
                         obj.artUri || "");
    }

    public equals(other: Track): boolean {
        return this.title === other.title &&
               this.artist === other.artist &&
               this.album === other.album;
    }
}

class TrackState {
    constructor(public playtime: number, public length: number,
                public playing: boolean) {}

    public static fromJson(obj: any): TrackState {
        return new TrackState(obj.playtime || 0,
                              obj.length || 0,
                              obj.playing || false);
    }

    public equals(other: TrackState): boolean {
        return this.playtime === other.playtime &&
               this.length === other.length &&
               this.playing === other.playing;
    }
}
