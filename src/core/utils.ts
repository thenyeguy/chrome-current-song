/// <reference path='types.ts' />

function timeToSeconds(time: string): number {
    if (time === null || time === undefined) {
        return null;
    }

    let match = time.match(/(\d+):(\d+)/);
    if(match && match.length === 3) {
        let minutes = parseInt(match[1]);
        let seconds = parseInt(match[2]);
        return 60*minutes + seconds;
    }

    let intValue = parseInt(time);
    if (typeof intValue === "number" && intValue != NaN) {
        return intValue;
    }

    return null;
}

function trackEquals(left: Track, right: Track) {
    if (!left && !right) {
        return true;
    }
    if (!left || !right) {
        return false;
    }
    return left.title == right.title &&
           left.artist == right.artist &&
           left.album == right.album;
}
