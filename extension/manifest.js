var glob = require("glob");
var jeditor = require("gulp-json-editor");
var path = require("path");

function cleanFilename(file, options) {
    options = options || {};
    if (options.base) {
        base = new RegExp("^" + options.base);
        file = file.replace(base, "");
    }
    if (options.tsToJs) {
        file = file.replace(/\.ts$/, ".js");
    }
    return file;
}

function expandGlobs(globs, options) {
    if (typeof globs === "string") {
        globs = [globs];
    }

    var allFiles = []
    for (var i = 0; i < globs.length; ++i) {
        try {
            var files = glob.sync(globs[i], options);
            for (var j = 0; j < files.length; ++j) {
                allFiles.push(cleanFilename(files[j], options));
            }
        } catch (err) {}
    }
    return allFiles;
}

function background(globs, options) {
    var scripts = expandGlobs(globs, options);
    return jeditor({
        background: {
            scripts: scripts
        }
    });
}

function content(adapterJson, deps, options) {
    var adapters = require("./" + adapterJson);
    var adapterBase = path.dirname(adapterJson);
    var deps = expandGlobs(deps, options);
    var contentScripts = [];
    for (var i = 0; i < adapters.length; ++i) {
        var adapter = adapters[i];
        var script = path.join(adapterBase, adapter.script);
        contentScripts.push({
            matches: [adapter.matches],
            js: deps.concat(cleanFilename(script, options)),
        });
    }
    return jeditor({
        content_scripts: contentScripts
    });
}

function popup(popup_src) {
    return jeditor({
        browser_action: {
            default_popup: popup_src
        }
    });
}

module.exports = {
    background: background,
    content: content,
    popup: popup,
};
