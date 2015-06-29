
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var $=require("./jquery.js"); require("./jquery.csv.js");
	jQuery=$; require("chosen.jquery.js");

	var fafoiq={opts:opts};
	


	fafoiq.template=$("<div></div>");
		
	fafoiq.fill=function(){
		$(opts.div).empty().append( fafoiq.template.find(".fafoiq_main").clone() );
		
		var sa=[];
		sa.push("<select id='year' data-placeholder='What year?'>");
		sa.push("<option value=''></option>");
		for(year=1990;year<2014;year++)
		{
			sa.push("<option value='"+year+"'>"+year+"</option>");
		}
		sa.push("<select/>")
		$(".fafoiq .selyear").empty().append($(sa.join()));

		var sa=[];
		sa.push("<select id='school' data-placeholder='Type to search a school'>");
		sa.push("<option value=''></option>");
		for(var name in fafoiq.schools)
		{
			var v=fafoiq.schools[name];
			sa.push("<option value='"+v.name+"'>"+v.name+"</option>");
		}
		sa.push("<select/>")
		$(".fafoiq .selschool").empty().append($(sa.join()));

		
		$(".fafoiq .results").empty();
		
		$('.selschool select').chosen();
		$('.selyear select').chosen();
	};


// load and parse raw CSV
	$(function() {
		$.ajax({
			type: "GET",
			url: "fafoiq.csv",
			dataType: "text",
			success: function(data) {
				fafoiq.csv=$.csv.toArrays(data);
				fafoiq.ParseCSV()
				fafoiq.template.load("fafoiq.template.html",fafoiq.fill);
//				console.log(fafoiq.csv);
			}
		 });
	});

	fafoiq.ParseCSV=function()
	{
		fafoiq.objs=[];
		fafoiq.schools={}
		for(var j=1;j<fafoiq.csv.length;j++) // first line is header
		{
			var t={};
			for(var i=0;i<fafoiq.csv[0].length;i++)
			{
				t[ fafoiq.csv[0][i] ]=fafoiq.csv[j][i];
			}
			fafoiq.objs.push(t);
		}
		
//		console.log(fafoiq.objs);
		
		var getint=function(s){
			var n=parseInt(s,10);
			if(!n){n=0};
			return n;
		};

		for(var i=0;i<fafoiq.objs.length;i++)
		{
			var t={};
			var v=fafoiq.objs[i];
			t.name=v["School"];
			
			t.avail=getint("NumberOfPlacesAvailable");
			
			t.priority_1a=getint(v["Priority 1A"]);
			t.priority_1b=getint(v["Priority 1B"]);
			t.priority_2 =getint(v["Priority 2"]);
			t.priority_3 =getint(v["Priority 3"]);
			t.priority_4 =getint(v["Priority 4"]);
			t.priority_5 =getint(v["Priority 5"]);

			t.intake =t.priority_1a + t.priority_1b + t.priority_2 + t.priority_3 + t.priority_4 + t.priority_5 ;
			
			if(t.intake==0)
			{
				t.intake_unknown=true;
			}
			
			fafoiq.schools[t.name]=t;
		}

		console.log(fafoiq.schools);


/*
		fafoiq.places={};
		fafoiq.slots=[];
		for(var i=0;i<fafoiq.objs.length;i++)
		{
			var t={};
			t.name=fafoiq.objs[i]["LeisureCentreName"];
			t.address=fafoiq.objs[i]["Address"];
			t.phone=fafoiq.objs[i]["Telephone"];
			t.comments=fafoiq.objs[i]["Comments"];
			fafoiq.places[t.name]=t;
			
			for(var n in fafoiq.objs[i])
			{
				var dur=fafoiq.objs[i][n];
				if( dur != "" )
				{
					var ns=n.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
					var na=ns.split(" ");
					if( (na[1]=="monday") || (na[1]=="tuesday") || (na[1]=="wednesday") || (na[1]=="thursday") || (na[1]=="friday") || (na[1]=="saturday") || (na[1]=="sunday"))
					{
						var p={};
						p.day=na[1];
						p.act=na[0];
						p.place=t.name;
						p.time=dur.split(" ");p.time=p.time[p.time.length-1]; // last bit
						fafoiq.slots[fafoiq.slots.length]=p;
					}
				}
			}
		}
//		console.log(fafoiq.places);
//		console.log(fafoiq.slots);
*/

	};
	
	return fafoiq;

};
