
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var $=require("./jquery.js"); require("./jquery.csv.js");

	var maprecy={opts:opts};
	
	maprecy.template=$("<div></div>");
		
	maprecy.fill=function(){
		$(opts.div).empty().append( maprecy.template.find(".maprecy_main").clone() );
//		$(".maprecy .tab").append( l );

	window.display_maprecy_map=function(){
		
				var mapOptions = {
				  center: new google.maps.LatLng(53.7997,-1.5492),
				  zoom: 16,
				  scrollwheel: true
				};
				var map = new google.maps.Map(document.getElementById("map"),
					mapOptions);
				

				var heatmap_data;
				var heatmap;
				var pinsmap_data;
				var pinsmap;
				var markers=[];
				var markerCluster;


				heatmap_data = [];
				
				for(var lat in maprecy.heatmap)
				{
					for(var lng in maprecy.heatmap[lat])
					{
						heatmap_data.push({
							location : new google.maps.LatLng(lat/10000,lng/10000) ,	weight : maprecy.heatmap[lat][lng] || 1
						});
					}
				}
/*
				for(var i=0;i<ctrack.map.heat.length;i++)
				{
					var v=ctrack.map.heat[i];
					heatmap_data.push({
						location : new google.maps.LatLng(v.lat,v.lng) ,	weight : v.wgt || 1
					});
				}
*/
				heatmap = new google.maps.visualization.HeatmapLayer({
				  data: heatmap_data
				});
				heatmap.setMap(map);

				var fixradius=function()
				{
						var s=Math.pow(2,map.getZoom())*1/256;
						if(s<4){s=4;}
						if(s>256){s=0;}

						if(pinsmap)
						{
						}
						else
						if(heatmap)
						{
							heatmap.setOptions({radius:s});
						}						
				}
				google.maps.event.addListener(map, 'zoom_changed', fixradius);
				fixradius();
	};
	head.js("https://maps.googleapis.com/maps/api/js?key=AIzaSyDPrMTYfR7XcA3PencDS4dhovlILuumB_w&libraries=visualization&sensor=false&callback=display_maprecy_map");


	};

// load huge json data chunk of all the data we need
	$(function() {
		$.ajax({
			type: "GET",
			url: "maprecy.json",
			dataType: "json",
			success: function(data) {
				console.log(data);
				
				var latlnglump=function(n)
				{
					return Math.floor(n*10000);
				};
				maprecy.heatmap={};
				
				var m1=maprecy.heatmap;
				var cc=data.codes.green;
				for(var n in cc)
				{
					for(var i=0;i<cc[n].length;i++)
					{
						var v=cc[n][i];
						var l=latlnglump(v.lat);
						m1[l]=m1[l] || {};
						var m2=m1[l];
						var l=latlnglump(v.lng);
						m2[l]=(m2[l] || 0) + v.weight/1000;
					}
				}
				
				console.log(maprecy.heatmap);
				
				
				maprecy.template.load("maprecy.template.html",maprecy.fill);
			}
		 });
	});
	
	return maprecy;

};
