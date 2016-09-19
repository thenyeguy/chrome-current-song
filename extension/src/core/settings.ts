/// <reference path='../typings/index.d.ts' />

class SettingsManager {
    private _enableScrobbling = false;

    constructor() {
        chrome.storage.onChanged.addListener(this.handleChange);
    }

    private handleChange(changes: any, area: string) {
        for (let key in changes) {
            if (key == "settings.enable_scrobbling") {
                this._enableScrobbling = changes[key];
            }
        }
    }

    private write(field: string, value: any) {
        let update = {};
        update[field] = value;
        chrome.storage.sync.set(update);
    }

    get enableScrobbling(): boolean {
        return this._enableScrobbling;
    }

    set enableScrobbling(value: boolean) {
        this._enableScrobbling = value;
        this.write("settings.enable_scrobbling", value);
    }
}