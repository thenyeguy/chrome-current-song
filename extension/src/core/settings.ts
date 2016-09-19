/// <reference path='../typings/index.d.ts' />

class SettingsManager {
    private _enableScrobbling = false;

    private _lastFmAuthToken = "";
    private _lastFmAuthUser = "";

    constructor() {
        chrome.storage.onChanged.addListener(this.handleChange);
        this.loadSettings();
    }

    private handleChange(changes: any, area: string) {
        for (let key in changes) {
            let value = changes[key];
            if (key == "settings.enable_scrobbling") {
                this._enableScrobbling = value;
            } else if (key == "settings.last_fm.auth_token") {
                this._lastFmAuthToken = value;
            } else if (key == "settings.last_fm.auth_user") {
                this._lastFmAuthUser = value;
            }
        }
    }

    private loadSettings() {
        chrome.storage.sync.get(null, (items) => {
            this.handleChange(items, "");
            console.log("Loaded settings.");
        });
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

    get lastFmAuthToken(): string {
        return this._lastFmAuthToken;
    }
    set lastFmAuthToken(token: string) {
        this._lastFmAuthToken = token;
        this.write("settings.last_fm.auth_token", token);
    }

    get lastFmAuthUser(): string {
        return this._lastFmAuthUser;
    }
    set lastFmAuthUser(user: string) {
        this._lastFmAuthUser = user;
        this.write("settings.last_fm.auth_user", user);
    }
}
