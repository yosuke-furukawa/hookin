var fs = require("fs");
var child_process = require('child_process');
var assert = require('assert');
var async = require('async');

process.env.HOOKSPATH = "/tmp";
async.waterfall([
  function(next){
    var hookin = child_process.spawn("bin/hookin.js", ["test.js", "npm test"]);
    hookin.on("close", function(code) {
      assert.equal(code, 0);
      var postmerge = "" + fs.readFileSync(process.env.HOOKSPATH + "/post-merge");
      assert.equal(postmerge.indexOf("#changed_files checker") > 0 , true);
      assert.equal(postmerge.indexOf("# test.js") > 0 , true);
      assert.equal(postmerge.indexOf("npm test") > 0 , true);

      next();
    });
    hookin.stdout.pipe(process.stdout);
    hookin.stderr.pipe(process.stderr);
  },
  function(next){
    var hookin = child_process.spawn("bin/hookin.js", ['test.js', 'npm install && npm test'])
    hookin.on("close", function(code) {
      assert.equal(code, 0);
      var postmerge = "" + fs.readFileSync(process.env.HOOKSPATH + "/post-merge");
      assert.equal(postmerge.indexOf("# test.js") > 0 , true);
      assert.equal(postmerge.indexOf("npm install && npm test") > 0 , true);

      next();
    });
    hookin.stdout.pipe(process.stdout);
    hookin.stderr.pipe(process.stderr);
  },
  function(next){
    var hookin = child_process.spawn("bin/hookin.js", ['-u','test.js'])
    hookin.on("close", function(code) {
      assert.equal(code, 0);
      var postmerge = "" + fs.readFileSync(process.env.HOOKSPATH + "/post-merge");
      assert.equal(postmerge.indexOf("# test.js") > 0 , false);
      assert.equal(postmerge.indexOf("npm install && npm test") > 0 , false);

      next();
    });
    hookin.stdout.pipe(process.stdout);
    hookin.stderr.pipe(process.stderr);
  }
]);
