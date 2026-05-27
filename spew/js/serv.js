
var util=require('util');
var express = require('express');
var app = express();

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

// global.argv
var argv=require('yargs').argv; global.argv=argv;

argv.port=argv.port||1337;

//app.use(express.logger());
//app.use(express.json());

var fs = require('fs');
var https = require('https');


app.use( function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.static(__dirname+"/../lib/"));

console.log("Starting server at https://localhost:"+argv.port+"/spew.html");

var privateKey  = fs.readFileSync('certs/localhost+3-key.pem', 'utf8');
var certificate = fs.readFileSync('certs/localhost+3.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpshit = https.createServer(credentials, app);

httpshit.listen(argv.port);
