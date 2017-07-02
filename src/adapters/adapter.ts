/// <reference path='../core/types.ts' />

interface Adapter {
    properties: PlayerProperties;

    getTitle(): string;
    getArtist(): string;
    getAlbum(): string;
    getPlayState(): PlaybackState;
    getPlaytime(): number | string;
    getDuration(): number | string;
    getArtUri(): string;

    playPause(): void;
    nextSong(): void;
    prevSong(): void;
}
