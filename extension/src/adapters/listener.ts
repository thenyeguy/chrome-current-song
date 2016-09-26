/// <reference path='adapter.ts' />
/// <reference path='../core/types.ts' />
/// <reference path='../core/utils.ts' />
/// <reference path='../typings/index.d.ts' />

interface Window { listener: Listener }

function asSeconds(playtime: string | number): number {
    if (playtime === null || playtime === undefined) {
        return null;
    }

    if (typeof playtime === "number") {
        return playtime;
    } else {
        return timeToSeconds(playtime);
    }
}


class Listener {
  private adapter: Adapter;
  private port: chrome.runtime.Port;
  private lastState: PlayerState;

  public verbose: boolean;

  constructor(adapter: Adapter) {
      this.adapter = adapter;
      this.port = chrome.runtime.connect(null, {
          name: Math.random().toString(36).substr(2),
      });
      this.port.postMessage({ "properties": adapter.properties });
      this.lastState = null;
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
      let state: PlayerState = {
          player: this.adapter.properties.name,
          track: {
              title: this.adapter.getTitle(),
              artist: this.adapter.getArtist(),
              album: this.adapter.getAlbum(),
          },
          playing: this.adapter.getPlaying(),
          playtime: asSeconds(this.adapter.getPlaytime()),
          length: asSeconds(this.adapter.getLength()),
          artUri: this.adapter.getArtUri(),
      };
      if (state != this.lastState) {
          this.lastState = state;
          msg["state"] = state;
          if (this.verbose) { console.log("Sending message: %O", msg); }
          this.port.postMessage(msg);
      }
  }

  private poll(timeout_ms: number) {
      this.update();
      setTimeout(this.poll.bind(this, timeout_ms), timeout_ms);
  }

  public start(verbose?: boolean) {
      console.log("Starting %s listener...", this.adapter.properties.name);
      this.verbose = !!verbose;
      this.port.onMessage.addListener(this.handleRequest.bind(this));
      this.poll(500 /* ms */);
  }
}
