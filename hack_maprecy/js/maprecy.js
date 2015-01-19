
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var $=require("./jquery.js"); require("./jquery.csv.js");

	var maprecy={opts:opts};
	
	maprecy.template=$("<div></div>");
		
	maprecy.fill=function(){
//		$(opts.div).empty().append( maprecy.template.find(".maprecy_main").clone() );
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


				var display_heatmap=function()
				{
					if(heatmap)
					{
						heatmap.setMap(null);
					}

					var data=maprecy.data;
					
					var latlnglump=function(n)
					{
						return Math.floor(n*10000);
					};
					maprecy.heatmap={};
					
					var m1=maprecy.heatmap;
					var cc=data.codes[maprecy.mode];
					var ww=data.dumps[maprecy.mode];
					var t=0;
					for(var n in cc)
					{
						for(var i=0;i<cc[n].length;i++)
						{
							var v=cc[n][i];
							var l=latlnglump(v.lat);
							m1[l]=m1[l] || {};
							var m2=m1[l];
							var l=latlnglump(v.lng);
							var w=v.weight*(ww[n] || 0); // weight * total to get relative values
							m2[l]=(m2[l] || 0) + w;
							t+=w;
						}
					}
					
					console.log(maprecy.heatmap);


					heatmap_data = [];
					
					for(var lat in maprecy.heatmap)
					{
						for(var lng in maprecy.heatmap[lat])
						{
							heatmap_data.push({
								location : new google.maps.LatLng(lat/10000,lng/10000) ,	weight : maprecy.heatmap[lat][lng] || 0
							});
						}
					}
					heatmap = new google.maps.visualization.HeatmapLayer({
					  data: heatmap_data
					});
					heatmap.setMap(map);
				}
				window.display_heatmap=display_heatmap;
				maprecy.mode="black";
				display_heatmap();

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
				maprecy.data=data;
				console.log(data);
				
				maprecy.template.load("maprecy.template.html",maprecy.fill);
			}
		 });
	});
	
	return maprecy;

};
