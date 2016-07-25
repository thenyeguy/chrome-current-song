#!/usr/bin/env python

import json
import os
import struct
import sys

SONG_FILE = os.path.join(os.environ["HOME"], ".currentsong")

def send_message(message):
    """Sends a message back to the Chrome extension.

    Args:
      message: a JSON dictionary of our message.
    """
    message = json.dumps(message)
    sys.stdout.write(struct.pack('I', len(message)))
    sys.stdout.write(message)
    sys.stdout.flush()

def log(s):
    """Logs the provided string |s| to the chrome extension."""
    send_message(dict(type="log", value=s))

def read_input():
    """Reads json messages from the Chrome extension."""
    while True:
        text_length_bytes = sys.stdin.read(4)
        if len(text_length_bytes) == 0:
            sys.exit(0)

        text_length = struct.unpack('i', text_length_bytes)[0]
        yield json.loads(sys.stdin.read(text_length).decode('utf-8'))

def write_song(song):
    title = song.get("title", "")
    artist = song.get("artist", "<Unknown>")
    playing = song.get("playing", True)
    state = "playing" if playing else "paused"
    try:
        with open(SONG_FILE, "w") as f:
            f.write("{}\t{}\t{}\n".format(title, artist, state))
    except Exception as e:
        log("Write song failed: " + str(e))

def clear_song():
    try:
        os.remove(SONG_FILE)
    except Exception:
        pass

def main():
    log("Starting native host...")
    log("Writing to: " + SONG_FILE)
    for message in read_input():
        if "echo" in message:
            log(message["echo"])
        elif "write" in message:
            write_song(message["write"])
        elif "clear" in message:
            if message["clear"]:
                clear_song()
    log("Exiting native host...")
    return 0

if __name__ == "__main__":
    sys.exit(main())
