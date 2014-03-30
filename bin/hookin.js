#!/usr/bin/env node

var path = require('path');
var fs = require("fs");
var _ = require('lodash');
var hooksPath = process.env.HOOKSPATH || path.join(process.cwd(), '.git', 'hooks');
var postMergeFile = 'post-merge';
var postMergePath = path.join(hooksPath, postMergeFile);
var srcFilePath = path.join(__dirname, postMergeFile);
var checkCommand = '# <%=watchFileName%>\ncheck_run <%=watchFileName%> "<%=command%>"\n';
require('colors');

var error = function(message) {
  console.error(message);
  process.exit(1);
};

var existsKeyword = function(keyword) {
  var exists = fs.existsSync(postMergePath);
  if (!exists) return false;
  var file = "" + fs.readFileSync(postMergePath);
  return file.indexOf(keyword) > 0;
};

var writeCommand = function(watchFileName, command) {
  // clear exist command
  if (existsKeyword(watchFileName)) {
    var file = "" + fs.readFileSync(postMergePath);
    var reg = new RegExp("# " + watchFileName + "\ncheck_run " + watchFileName + ".*\n");
    file = file.replace(reg, "");
    fs.writeFileSync(postMergePath, file);
  }
  var line = _.template(checkCommand, {
    watchFileName:watchFileName,
    command:command,
  });
  fs.appendFileSync(postMergePath, line);
};

var writeChecker = function() {
  if (!existsKeyword("#changed_files checker")) {
    var checker = fs.readFileSync(srcFilePath);
    fs.appendFileSync(postMergePath, checker);
    fs.chmodSync(postMergePath, 0755);
  }
};

if (!fs.existsSync(hooksPath)) {
  error(hooksPath.red + " not found. call git init, before hookin".red);
}

if (process.argv.length < 3) {
  writeChecker();
  writeCommand("package.json", "npm install && npm prune");
  writeCommand("bower.json", "bower install && bower prune");
  process.exit(0);
}

var hookfile = process.argv[2];
var hookCommand = process.argv[3];

writeChecker();
writeCommand(hookfile, hookCommand);
process.exit(0);
