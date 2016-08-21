module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      target: ["target/"],
      typescript: [".tscache", "**/.*.ts"],
    },
    copy: {
      popup: {
        expand: true,
        cwd: "src/",
        src: ["popup/*.html", "popup/*.css"],
        dest: "target/",
      },
      thirdParty: {
        expand: true,
        cwd: "src/",
        src: ["third_party/**"],
        dest: "target/"
      },
    },
    manifest: {
      base: "manifest.json",
      output: "target/manifest.json",
      adapters: {
        deps: [
          "third_party/jquery-3.1.0.slim.js",
          "adapters/adapter.js",
          "adapters/listener.js",
          "core/types.js",
        ],
        list: "src/adapters/adapters.json",
      },
      background: {
        js: [
          "third_party/jquery-3.1.0.slim.js",
          "core/api.js",
          "core/engine.js",
          "core/multiplexer.js",
          "core/native.js",
          "core/player.js",
          "core/types.js",
          "background/main.js",
        ],
      },
      popup: "popup/popup.html",
    },
    ts: {
      main: {
        src: "src/**/*.ts",
        outDir: "target",
        options: {
          aluowJs: true,
          rootDir: "src",
        },
      },
    },
    watch: {
      files: ["Gruntfile.js", "src/**"],
      tasks: ["build"],
    },
  });

  grunt.registerTask("build", ["ts", "manifest", "copy"]);
  grunt.registerTask("default", ["build"]);

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");

  grunt.registerTask("manifest", "Generate chrome manifest file.", function() {
    var config = grunt.config.get("manifest");

    var manifest = grunt.file.readJSON(config.base);
    grunt.log.writeln("Loaded base manifest:", config.base);

    // Build background script
    manifest.background = {
      scripts: config.background.js,
    };

    // Generate popup page
    manifest.browser_action = {
        default_popup: config.popup,
    };

    // Build content scripts
    var adapters = grunt.file.readJSON(config.adapters.list);
    manifest.content_scripts = [];
    for (var i = 0; i < adapters.length; i++) {
      var script = adapters[i].script.replace(/.ts$/, ".js");
      manifest.content_scripts.push({
        matches: [adapters[i].matches],
        js: config.adapters.deps.concat("adapters/" + script),
      });
    }
    grunt.log.writeln("Generated %d content scripts.", adapters.length);

    // Generate final manifest file, pretty-printed
    var manifestJson = JSON.stringify(manifest, null, 2);
    grunt.log.debug("Final manifest:", manifestJson);
    grunt.file.write(config.output, manifestJson);
  });
};
