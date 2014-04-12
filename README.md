hookin [![Build Status](https://travis-ci.org/yosuke-furukawa/hookin.svg?branch=master)](https://travis-ci.org/yosuke-furukawa/hookin)
================

Would you like to call "npm install" when package.json is changed?

`hookin` could solve the problem.

`npm install` runs if package.json is changed when git-pull.

`hookin` is a cli tool for github pull hook.

HOW TO USE
================

INSTALL:
```shell
$ npm install hookin -g
```

USAGE:
```shell
$ hookin package.json "npm install && npm prune"
$ hookin bower.json "bower install && bower prune"
$ hookin .scss "compasss compile"

# Remove hook
$ hookin --uninstall package.json
```

CREDITS
===================

this tool is inspired by [sindresorhus's git pull hook](https://gist.github.com/sindresorhus/7996717).

thanks sindresorhus.
