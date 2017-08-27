/// <reference path='../typings/index.d.ts' />

class SettingsManager {
    private _lastFmAuthToken = "";
    private _lastFmAuthUser = "";

    constructor() {
        this.loadSettings();
        chrome.storage.onChanged.addListener(this.handleChange.bind(this));
    }

    private handleChange(changes: any, area: string) {
        for (let key in changes) {
            let change = changes[key];
            let value = change.newValue;
            this.read(key, change.newValue);
        }
    }

    private loadSettings() {
        chrome.storage.sync.get(null, (items) => {
            for (let key in items) {
                this.read(key, items[key]);
            }
            console.debug("Loaded settings.");
        });
    }

    private read(key: string, value: any) {
        if (key == "settings.last_fm.auth_token") {
            this._lastFmAuthToken = value;
        } else if (key == "settings.last_fm.auth_user") {
            this._lastFmAuthUser = value;
        }
    }

    private write(field: string, value: any) {
        if (value) {
            let update = {};
            update[field] = value;
            chrome.storage.sync.set(update);
        } else {
            chrome.storage.sync.remove(field);
        }
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
