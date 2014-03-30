var fs = require("fs");
var child_process = require('child_process');
var assert = require('assert');

process.env.HOOKSPATH = __dirname;
child_process.spawn("bin/hookin.js")
  .on("close", function(code) {
    assert.equal(code, 0);
    var postmerge = "" + fs.readFileSync(process.env.HOOKSPATH + "/post-merge");
    assert.equal(postmerge.indexOf("#changed_files checker") > 0 , true);
    child_process.spawn("bin/hookin.js", ['test.js', 'npm test'])
    .on("close", function(code) {
      assert.equal(code, 0);
      var postmerge = "" + fs.readFileSync(process.env.HOOKSPATH + "/post-merge");
      assert.equal(postmerge.indexOf("# test.js") > 0 , true);
      assert.equal(postmerge.indexOf("npm test") > 0 , true);
    }).stdout.pipe(process.stdout);
  }).stdout.pipe(process.stdout);
