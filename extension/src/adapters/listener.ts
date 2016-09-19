/// <reference path='adapter.ts' />
/// <reference path='../core/types.ts' />
/// <reference path='../typings/index.d.ts' />

interface Window { listener: Listener }

class Listener {
  private adapter: Adapter;
  private port: chrome.runtime.Port;
  private lastTrack: Track;
  private lastState: TrackState;

  public verbose: boolean;

  constructor(adapter: Adapter) {
      this.adapter = adapter;
      this.port = chrome.runtime.connect(null, {
          name: Math.random().toString(36).substr(2),
      });

      let properties = new PlayerProperties(this.adapter.name,
                                            this.adapter.enableScrobbling);
      this.port.postMessage({ "properties": properties });

      this.lastTrack = new Track("", "", "", "");
      this.lastState = new TrackState(0, 0, false);
      this.verbose = false;
  }

  private handleRequest(request: any) {
      if (this.verbose) { console.log("Got request: %O", request); }

      if (request.type == "control") {
          if (request.control == ControlType.PlayPause) {
              this.adapter.playPause();
          } else if (request.control == ControlType.NextSong) {
              this.adapter.nextSong();
          } else if (request.control == ControlType.PrevSong) {
              this.adapter.prevSong();
          }
      }
  }

  private update() {
      let msg = {}

      let track = new Track(this.adapter.getTitle(), this.adapter.getArtist(),
                            this.adapter.getAlbum(), this.adapter.getArtUri());
      if (!this.lastTrack.equals(track)) {
          msg["track"] = track;
          this.lastTrack = track;
      }

      let state = new TrackState(toSeconds(this.adapter.getPlaytime()),
                                 toSeconds(this.adapter.getLength()),
                                 this.adapter.getPlaying());
      if (!this.lastState.equals(state)) {
          msg["state"] = state;
          this.lastState = state;
      }

      if (!$.isEmptyObject(msg)) {
          msg["source"] = this.adapter.name;
          if (this.verbose) { console.log("Sending message: %O", msg); }
          this.port.postMessage(msg);
      }
  }

  private poll(timeout_ms: number) {
      this.update();
      setTimeout(this.poll.bind(this, timeout_ms), timeout_ms);
  }

  public start(verbose?: boolean) {
      console.log("Starting %s listener...", this.adapter.name);
      this.verbose = !!verbose;
      this.port.onMessage.addListener(this.handleRequest.bind(this));
      this.poll(500 /* ms */);
  }
}
