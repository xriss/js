// Copyright (c) 2014 International Aid Transparency Initiative (IATI)
// Licensed under the MIT license whose full text can be found at http://opensource.org/licenses/MIT

var util=require('util');
var csv=require('csv');
var util=require('util');
var wait=require('wait.for');
var fs = require('fs');

var jscoord = require('./jscoord');

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

wait.launchFiber(function(){

// global.argv
var argv=require('yargs').argv; global.argv=argv;

console.log("Parsing files");

	var j={};

	var x=fs.readFileSync("testdata/RefuseCollectionTonnageData.csv").toString('utf8');
	var lines=wait.for( function(cb){ csv().from.string(x).to.array( function(d){ cb(null,d); } ); } ); // so complex, much wow, very node

// merge all the dump dates/times down to routes and code

	j.dumps={};
	for(var i=1;i<lines.length;i++)
	{
		var v=lines[i];
		var o={};
		
//		console.log(v);

		o.route=v[0].trim().toUpperCase();
		o.weight=parseFloat(v[6].split(",").join(""));
		o.code=v[5].trim().toLowerCase();
		if(o.code=="residual") { o.code="black"; }
		if(o.code=="dry recycling") { o.code="green"; }
		
		j.dumps[o.code]=j.dumps[o.code] || {} ;
		var codes=j.dumps[o.code];

		codes[o.route]=( codes[o.route] || 0 ) + o.weight;

//		console.log(o.weight);	
//		break;
	}


	var x=fs.readFileSync("testdata/RoutePropertyData.csv").toString('utf8');
	var lines=wait.for( function(cb){ csv().from.string(x).to.array( function(d){ cb(null,d); } ); } ); // so complex, much wow, very node

	j.codes={};
	for(var i=1;i<lines.length;i++)
	{

		var v=lines[i];
		var o={};
		
//		console.log(v);

		var os = new jscoord.OSRef(v[2]*1,v[3]*1);
		var ll = os.toLatLng();

		o.lat=ll.lat;
		o.lng=ll.lng;
		o.code=v[0].trim().toLowerCase(); if(o.code=="food waste") { o.code="food"; }
		o.weight=(parseInt(v[1]) || 250 )*(parseInt(v[6]) || 1);
		o.route=v[8].trim().toUpperCase();

		j.codes[o.code]=j.codes[o.code] || {} ;
		var codes=j.codes[o.code];

		codes[o.route]=codes[o.route] || [] ;
		var t=codes[o.route];
		t[t.length]=o;
		
		
		o.code=undefined;
		o.route=undefined;
		
/*
		if(o.code != t[0].code)
		{
				console.log(o);	
				console.log(t[0]);
		}

		if(i>10)
		{
			console.log(j.routes)
			break;
		}
*/
	}



	fs.writeFileSync(__dirname+"/../lib/maprecy.json",JSON.stringify(j,null,'\t'));
	
	for(n in j.codes)
	{
		console.log(n);
		for(v in j.codes[n])
		{
			console.log("\t"+v+"\t"+j.codes[n][v].length);
		}
	}
});
