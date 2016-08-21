/// <reference path='../typings/index.d.ts' />

class Player {
    id: string;
    name: string;
    port: chrome.runtime.Port;
    track: Track;
    state: TrackState;
    lastActive: number;  // timestamp
}
