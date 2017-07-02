/// <reference path='ringbuffer.ts' />
/// <reference path='settings.ts' />
/// <reference path='types.ts' />
/// <reference path='../typings/index.d.ts' />

class LastFmApi {
    static API_KEY = "2934060c6d5d74b410ff6f5d5a50045d";
    static API_SECRET = "4597d1a51d2c3657fad9fc0e1c9c5b39";
    static API_ENDPOINT = "https://ws.audioscrobbler.com/2.0/";

    private settings: SettingsManager;
    private session_token: string;

    constructor(settings: SettingsManager) {
        this.settings = settings;
        this.session_token = null;
    }

    private signRequest(request: any) {
        let keys = Object.keys(request).sort();
        let signature = "";
        for (let key of keys) {
            if (key == "format") {
                continue;
            }
            signature += key;
            signature += request[key];
        }
        signature += LastFmApi.API_SECRET;
        request["api_sig"] = md5(signature);
    }

    private buildRequest(method: string, params: any): any {
        let request = params || {};
        request["method"] = method;
        request["api_key"] = LastFmApi.API_KEY;
        request["format"] = "json";

        if (this.settings.lastFmAuthToken) {
            request["sk"] = this.settings.lastFmAuthToken;
        } else if (this.session_token) {
            request["token"] = this.session_token;
        }
        this.signRequest(request);
        return request;
    }

    private issueRequest(http_method: string, method: string, params: any,
        callback: (any) => void) {
        let request = this.buildRequest(method, params);
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    callback && callback(JSON.parse(xhr.responseText));
                } else {
                    console.error("Request failure:", xhr.responseText);
                    callback && callback({});
                }
            }
        };
        if (http_method == "POST") {
            xhr.open("POST", LastFmApi.API_ENDPOINT);
            xhr.send($.param(request));
        } else { // GET
            xhr.open("GET", LastFmApi.API_ENDPOINT + "?" + $.param(request));
            xhr.send();
        }
    }

    private getAuthToken(callback: (string) => void) {
        this.issueRequest("GET", "auth.getToken", {}, (result: any) => {
            let token = result.token || null;
            this.session_token = token;
            callback && callback(token);
        });
    }

    public getAuthUrl(callback: (string) => void) {
        this.getAuthToken((token: string) => {
            callback && callback("http://www.last.fm/api/auth/?" + $.param({
                "api_key": LastFmApi.API_KEY,
                "token": token,
            }));
        });
    }

    public getAuthSession(callback: (string) => void) {
        this.issueRequest("GET", "auth.getSession", {}, (result: any) => {
            this.settings.lastFmAuthToken = result.session["key"] || null;
            this.settings.lastFmAuthUser = result.session["name"] || null;
            this.session_token = null;
            callback && callback(this.settings.lastFmAuthUser);
        });
    }

    public deauthorize() {
        this.settings.lastFmAuthToken = null;
        this.settings.lastFmAuthUser = null;
    }

    public updateNowPlaying(state: PlayerState) {
        if (state.track.title) {
            this.issueRequest("POST", "track.updateNowPlaying", {
                artist: state.track.artist,
                track: state.track.title,
                album: state.track.album,
                duration: state.duration,
            }, null);
        }
    }

    public scrobble(track: Track, timestamp: number) {
        this.issueRequest("POST", "track.scrobble", {
            artist: track.artist,
            track: track.title,
            album: track.album,
            timestamp: timestamp,
        }, null);
    }
}
