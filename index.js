#!/usr/bin/env node

var path = require('path');
var pkg = require( path.join(__dirname, 'package.json') );
var program = require('commander');
program
    .version(pkg.version)
    .option('-d, --dest <dest>', 'Destination where to output the compiled HTML file')
    .option('-s, --source <source>', 'Path of the tshirt source file')
    .parse(process.argv);

var dest = program.dest;
require('./lib/parser')(program);
