#!/usr/bin/env python

import argparse
import collections
import json
import os
import struct
import sys

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
    help="The output file to write song data to.")

Track = collections.namedtuple("Track", ["title", "artist", "state"])


def json_to_track(message):
    """Unpacks a JSON message into a Track tuple."""
    title = (message.get("title", None) or "").encode("utf8")
    artist = (message.get("artist", None) or "").encode("utf8")
    playing = message.get("playing", True)
    state = "playing" if playing else "paused"
    return Track(title.strip(), artist.strip(), state)


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
        self._send_message(dict(type="log", value=s))

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


class SongServer(object):
    """Serves song data to a file."""

    def __init__(self, output, io):
        """Creates a new server writing to output.

        Args:
            output: A filename to write output to.
            io: An IO object for logging errors.
        """
        self._output = output
        self._io = io

    def update(self, track):
        """Updates the current track information.

        Args:
            track: A parsed Track object.
        """
        if track.title:
            try:
                with open(self._output, "w") as f:
                    f.write("{}\n{}\n{}\n".format(track.title, track.artist,
                                                  track.state))
            except Exception as e:
                self._io.log("Write song failed: " + str(e))
        else:
            self.clear()

    def clear(self):
        """Clears the current track information."""
        try:
            os.remove(self._output)
        except Exception:
            pass


def main(args):
    if args.mode == "chrome":
        io = ChromeIo()
    else:
        io = ConsoleIo()
    server = SongServer(args.output, io)

    io.log("Starting native host for {}...".format(args.mode))
    io.log("Writing to: {}".format(args.output))
    try:
        for message in io.read():
            if "echo" in message:
                io.log(message["echo"])
            elif "write" in message:
                server.update(json_to_track(message["write"]))
            elif "clear" in message:
                if message["clear"]:
                    server.clear()
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
