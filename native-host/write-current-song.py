#!/usr/bin/env python

import argparse
import collections
import json
import os
import socket
import struct
import sys
import threading

arg_parser = argparse.ArgumentParser()
arg_parser.add_argument(
    "--mode",
    choices=["chrome", "console"],
    default="chrome",
    help="The IO mode to use.")
arg_parser.add_argument(
    "--output",
    type=str,
    default=os.path.join(os.environ["HOME"], ".currentsong"),
    help="The output file to serve song data on.")

Track = collections.namedtuple("Track", ["title", "artist", "state"])


def json_to_track(message):
    """Unpacks a JSON message into a Track tuple."""
    if message:
        title = (message.get("title", None) or "").encode("utf8")
        artist = (message.get("artist", None) or "").encode("utf8")
        playing = message.get("playing", True)
        state = "playing" if playing else "paused"
        return Track(title.strip(), artist.strip(), state)
    return None


class ChromeIo(object):
    """A container for communication between Chrome and the native host."""

    def _send_message(self, message):
        """Sends a message back to the Chrome extension.

        Args:
          message: a JSON dictionary of our message.
        """
        message = json.dumps(message)
        sys.stdout.write(struct.pack('I', len(message)))
        sys.stdout.write(message)
        sys.stdout.flush()

    def log(self, s):
        """Sends the provided string |s| to the chrome extension."""
        self._send_message(dict(log=s))

    def read(self):
        """Reads JSON messages from the Chrome extension."""
        while True:
            text_length_bytes = sys.stdin.read(4)
            if len(text_length_bytes) == 0:
                break
            text_length = struct.unpack('i', text_length_bytes)[0]
            yield json.loads(sys.stdin.read(text_length).decode('utf-8'))


class ConsoleIo(object):
    """A container for IO via the console, for testing."""

    def log(self, s):
        """Logs the provided string to stdout."""
        print s

    def read(self):
        """Reads JSON input from stdin."""
        while True:
            try:
                text = raw_input()
                yield json.loads(text)
            except EOFError:
                break
            except ValueError as e:
                print >> sys.stderr, "Invalid JSON:", e


class TrackServer(object):
    """Serves track data via unix socket."""

    def __init__(self, output, io):
        """Creates a new server writing to output.

        Args:
            output: A filename to serve output on.
            io: An IO object for logging errors.
        """
        self._output = output
        self._io = io
        self._track = None

        self._thread = None
        self._sock = None
        self._serving = False

    def __enter__(self):
        self.open()
        return self

    def __exit__(self, *args):
        self.close()

    def open(self):
        """Opens a new socket connection and begins listening."""
        self._cleanup()
        self._sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self._sock.bind(self._output)
        self._sock.listen(1)
        self._sock.settimeout(0.5)
        self._thread = threading.Thread(target=self.listen)
        self._thread.start()

    def close(self):
        """Closes down our socket connection."""
        self._serving = False
        if self._thread:
            self._thread.join()
            self._thread = None
        self._cleanup()

    def listen(self):
        """Listens for incoming connections, serving track data."""
        self._serving = True
        while self._serving:
            try:
                conn, _ = self._sock.accept()
                track = self._track  # Save to local to avoid race conditions
                if track:
                    result = "{}\t{}\t{}".format(track.title, track.artist,
                                                 track.state)
                    conn.send(result)
                conn.close()
            except Exception:
                pass

    def update(self, track):
        """Updates the current track information.

        Args:
            track: A parsed Track object.
        """
        self._track = track

    def _cleanup(self):
        """Clears our output socket file."""
        try:
            os.remove(self._output)
        except OSError:
            pass


def main(args):
    if args.mode == "chrome":
        io = ChromeIo()
    else:
        io = ConsoleIo()

    io.log("Starting native host for {}...".format(args.mode))
    io.log("Writing to: {}".format(args.output))
    try:
        with TrackServer(args.output, io) as server:
            for message in io.read():
                if "track" in message:
                    server.update(json_to_track(message["track"]))
                else:
                    io.log("Unsupported message: {}".format(message))
    except Exception as e:
        io.log("Fatal exception: {}".format(e))
        return 1
    except KeyboardInterrupt:
        pass
    io.log("Exiting native host...")
    return 0


if __name__ == "__main__":
    args, unknown = arg_parser.parse_known_args()
    sys.exit(main(args))
