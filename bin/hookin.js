#!/usr/bin/env node

var path = require('path');
var fs = require("fs");
var _ = require('lodash');
var program = require('commander');
var hooksPath = process.env.HOOKSPATH || path.join(process.cwd(), '.git', 'hooks');
var postMergeFile = 'post-merge';
var postMergePath = path.join(hooksPath, postMergeFile);
var srcFilePath = path.join(__dirname, postMergeFile);
var checkCommand = '# <%=watchFileName%>\ncheck_run <%=watchFileName%> "<%=command%>"\n';
require('colors');

var package = require('../package.json');
program
  .version(package.version)
  .usage('[options] <watch file> <exec command>')
  .option('-i, --install')
  .option('-u, --uninstall')
  .parse(process.argv);

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

var clearExistsCommand = function(watchFileName) {
  if (existsKeyword(watchFileName)) {
    var file = "" + fs.readFileSync(postMergePath);
    var reg = new RegExp("# " + watchFileName + "\ncheck_run " + watchFileName + ".*\n");
    file = file.replace(reg, "");
    fs.writeFileSync(postMergePath, file);
  }
};

var writeCommand = function(watchFileName, command) {
  // clear exist command
  clearExistsCommand(watchFileName);
  var line = _.template(checkCommand, {
    watchFileName:watchFileName,
    command:command,
  });
  fs.appendFileSync(postMergePath, line);
  console.log(" checkfile :   ".green + watchFileName.green + " command : ".green + command.green);
};

var removeCommand = function(watchFileName) {
  clearExistsCommand(watchFileName);
  console.log(watchFileName.green + "'s hook is removed".green);
};

var writeChecker = function() {
  if (!existsKeyword("#changed_files checker")) {
    var checker = fs.readFileSync(srcFilePath);
    fs.appendFileSync(postMergePath, checker);
    fs.chmodSync(postMergePath, 0755);
    console.log(postMergePath.blue + " is created.".blue);
  }
};

if (!fs.existsSync(hooksPath)) {
  error(hooksPath.red + " not found. call git init, before hookin".red);
}

if (program.uninstall) {
  if (program.args.length === 1) {
    writeChecker();
    removeCommand(program.args[0]);
  }
  else {
    program.help();
  }
}
else {
  if (program.args.length === 2) {
    writeChecker();
    writeCommand(program.args[0], program.args[1]);
  }
  else {
    program.help();
  }
}

process.exit(0);
