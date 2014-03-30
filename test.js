var fs = require("fs");
var child_process = require('child_process');
var assert = require('assert');

process.env.HOOKSPATH = "/tmp";
var hookin = child_process.spawn("bin/hookin.js");
hookin.on("close", function(code) {
  assert.equal(code, 0);
  var postmerge = "" + fs.readFileSync(process.env.HOOKSPATH + "/post-merge");
  assert.equal(postmerge.indexOf("#changed_files checker") > 0 , true);
  var hookin = child_process.spawn("bin/hookin.js", ['test.js', 'npm test'])
  hookin.on("close", function(code) {
    assert.equal(code, 0);
    var postmerge = "" + fs.readFileSync(process.env.HOOKSPATH + "/post-merge");
    assert.equal(postmerge.indexOf("# test.js") > 0 , true);
    assert.equal(postmerge.indexOf("npm test") > 0 , true);
  });
  hookin.stdout.pipe(process.stdout);
  hookin.stderr.pipe(process.stderr);
});
hookin.stdout.pipe(process.stdout);
hookin.stderr.pipe(process.stderr);
