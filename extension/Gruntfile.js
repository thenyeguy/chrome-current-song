module.exports = function(grunt) {
  grunt.initConfig({
    clean: ["target/"],
    copy: {
      manifest: {
        src: "manifest.json",
        dest: "target/",
      },
      src: {
        expand: true,
        cwd: "src/",
        src: "**",
        dest: "target/",
      },
    },
    watch: {
      files: ["Gruntfile.js", "src/**"],
      tasks: ["build"],
    },
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("build", ["copy"]);
  grunt.registerTask("default", ["build"]);
};
