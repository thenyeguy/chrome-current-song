interface Adapter {
  name: string;

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
