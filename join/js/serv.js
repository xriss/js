// Copyright (c) 2014 International Aid Transparency Initiative (IATI)
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var util=require('util');

var express = require('express');
var logger = require('morgan')
var compression = require('compression')
var bodyParser = require('body-parser')
var serveStatic = require('serve-static')

var app = express();

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

// global.argv
var argv=require('yargs').argv; global.argv=argv;

argv.port=argv.port||1337;

app.use(logger("dev"));
app.use(bodyParser.json());

app.use( function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(compression());

app.use(serveStatic(__dirname+"/../lib/"));

console.log("Starting server at http://localhost:"+argv.port+"/");

app.listen(argv.port);
