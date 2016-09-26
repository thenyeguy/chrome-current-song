/// <reference path='../core/types.ts' />

interface Adapter {
  properties: PlayerProperties;

  getTitle(): string;
  getArtist(): string;
  getAlbum(): string;
  getArtUri(): string;
  getPlaytime(): number | string;
  getDuration(): number | string;
  getPlaying(): boolean;

  playPause(): void;
  nextSong(): void;
  prevSong(): void;
}
