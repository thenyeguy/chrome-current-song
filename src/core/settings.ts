/// <reference path='../typings/index.d.ts' />

class SettingsManager {
    private _lastFmAuthToken = "";
    private _lastFmAuthUser = "";

    constructor() {
        chrome.storage.onChanged.addListener(this.handleChange.bind(this));
        this.loadSettings();
    }

    private handleChange(changes: any, area: string) {
        for (let key in changes) {
            let change = changes[key];
            let value = change.newValue;
            if (key == "settings.last_fm.auth_token") {
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
