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

    private signRequest(params: any) {
        let keys = Object.keys(params).sort();
        let signature = "";
        for (let key of keys) {
            if (key == "format") {
                continue;
            }
            signature += key;
            signature += params[key];
        }
        signature += LastFmApi.API_SECRET;
        params["api_sig"] = md5(signature);
    }

    private issueRequest(method: string, params: any, callback: (any) => void) {
        let request_params = params || {};
        request_params["method"] = method;
        request_params["api_key"] = LastFmApi.API_KEY;
        request_params["format"] = "json";

        if (this.settings.lastFmAuthToken) {
            request_params["sk"] = this.settings.lastFmAuthToken;
        } else if (this.session_token) {
            request_params["token"] = this.session_token;
        }
        this.signRequest(request_params);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", LastFmApi.API_ENDPOINT + "?" + $.param(request_params));
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    callback(JSON.parse(xhr.responseText));
                } else {
                    console.log("Request failure:", xhr.responseText);
                    callback({});
                }
            }
        };
        xhr.send();
    }

    private getAuthToken(callback: (string) => void) {
        this.issueRequest("auth.getToken", {}, (result:any) => {
            let token = result.token || null;
            this.session_token = token;
            callback(token);
        });
    }

    public getAuthUrl(callback: (string) => void) {
        this.getAuthToken((token: string) => {
            callback("http://www.last.fm/api/auth/?" + $.param({
                "api_key": LastFmApi.API_KEY,
                "token": token,
            }));
        });
    }

    public getAuthSession(callback: (string) => void) {
        this.issueRequest("auth.getSession", {}, (result: any) => {
            this.settings.lastFmAuthToken = result.session["key"] || null;
            this.settings.lastFmAuthUser = result.session["name"] || null;
            this.session_token = null;
            callback(this.settings.lastFmAuthUser);
        });
    }

    public deauthorize() {
        this.settings.lastFmAuthToken = null;
        this.settings.lastFmAuthUser = null;
    }
}
