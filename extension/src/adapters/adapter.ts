interface Adapter {
  name: string;
  enableScrobbling: boolean;

  getTitle(): string;
  getArtist(): string;
  getAlbum(): string;
  getArtUri(): string;
  getPlaytime(): number;
  getLength(): number;
  getPlaying(): boolean;

  playPause(): void;
  nextSong(): void;
  prevSong(): void;
}
