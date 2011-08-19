//code
gamecake={}; // a global place to keep our cake

gamecake.code={};

gamecake.setup=function(){};
gamecake.clean=function(){};
gamecake.update=function(){};
gamecake.draw=function(){};

gamecake.opts={};
gamecake.images={};
gamecake.audios={};

gamecake.ticks=0;

gamecake.sniff={};

if( navigator.appVersion.search(/webkit/i) >= 0 )
{
	gamecake.sniff.webkit=true;
}

if( navigator.userAgent.search(/iphone/i) >= 0 )
{
	gamecake.sniff.idiot_phone=true;
}
if( navigator.userAgent.search(/ipad/i) >= 0 )
{
	gamecake.sniff.idiot_pad=true;
}
if( navigator.userAgent.search(/ipod/i) >= 0 )
{
	gamecake.sniff.idiot_pod=true;
}
if( gamecake.sniff.idiot_phone || gamecake.sniff.idiot_pad || gamecake.sniff.idiot_pod )
{
	gamecake.sniff.idiot_device=true;
}

(function($) {
	$.fn.gamecake = function(opts) {
		
		gamecake.opts=opts;
		gamecake.game=opts.game;
		
		return this.each(function() {
			var game=opts.game;
			var $this = $(this);
			game.$this=$this;
			game.zoom=1;
			
			$this.css("width",game.opts.width+"px");
			$this.css("height",game.opts.height+"px");
			$this.css("background",game.opts.backcolor);
			$this.css("position","relative");
			$this.css("overflow","hidden");
			

// this forces the browser to scroll to this area which is a tad annoying.
			$this.attr("tabindex","0").focus(); //grab initial display focus so that keys work
			
			
			$this.keydown(gamecake.code.input.keydown);
			$this.keyup(gamecake.code.input.keyup);
//			$this.mousedown(gamecake.code.input.keydown);
//			$this.mouseup(gamecake.code.input.keyup);
			$("html").mousemove(function(e){return gamecake.code.input.mousemove(e,game)});
			$("html").mousedown(function(e){return gamecake.code.input.mousedown(e,game)});
			$("html").mouseup(function(e){return gamecake.code.input.mouseup(e,game)});			

			$("body").bind("touchstart",function(e){return gamecake.code.input.touchdown(e,game);});
			$("body").bind("touchmove", function(e){return gamecake.code.input.touchmove(e,game);});
			$("body").bind("touchend",  function(e){return gamecake.code.input.touchup(e,game);});
			$("body").bind("touchcancel",  function(e){return gamecake.code.input.touchup(e,game);});

			var requestAnimationFrame = (function(){
// it may be nice to use these, but they seem to degrade performance...
/*			  return  window.requestAnimationFrame       || 
					  window.webkitRequestAnimationFrame || 
					  window.mozRequestAnimationFrame    || 
					  window.oRequestAnimationFrame      || 
					  window.msRequestAnimationFrame     || */
					  return function(callback,element){
						  window.setTimeout(callback, 1000 / 50);
					  };
			})();
    
			var update;

			window.soundManager = new SoundManager("art/"); // Flash expects window.soundManager.
			window.soundManager.useHighPerformance = true;
			window.soundManager.flashVersion = 9;

//setup sound			
			window.soundManager.onready(function() {
				gamecake.sfx.sound_ready=true;
			});

			window.soundManager.beginDelayedInit(); // start SM2 init.
    
    
			update=function() {
	   			requestAnimationFrame(update); // we need to always ask to be called again
				
				gamecake.ticks++;
								
//				game.opts.width=160;
//				game.opts.height=120;

// magic scale, this seems to cause slowdown sometimes?
				var p=game.$this.parent();
				var pw=p.width();
				var ph=p.height();
				var z=(pw/game.opts.width);
				if( (z*game.opts.height) > ph ) { z=(ph/game.opts.height); }
//				if(gamecake.sniff.idiot_device) { z=1; }
//z=1;
				var dx=Math.floor(game.opts.width*z);
				var dy=Math.floor(game.opts.height*z);

				var ox=Math.floor((pw-(dx))/(2));
				var oy=Math.floor((ph-(dy))/(2));
				game.$this.css("position","absolute");
				
				switch(gamecake.opts.render)
				{
					case "canvas":
						if(gamecake.$canvas)
						{
//							gamecake.$canvas.attr("width",game.opts.width);
//							gamecake.$canvas.attr("height",game.opts.height); // the render size
							
							gamecake.$canvas.css("width",dx+"px");
							gamecake.$canvas.css("height",dy+"px");
							
							game.$this.css("left",ox+"px"); // just try and position it
							game.$this.css("top",oy+"px");
							game.$this.css("width",dx+"px");
							game.$this.css("height",dy+"px");
							
							game.zoom=z;
						}
					break
				}

				if( ! gamecake.code.preload.check(game) ) {
					if(game.preload) { game.preload(gamecake,opts); } // optional preload update
					else { $this.html("<h1>Loading "+gamecake.code.preload.progress_percent+"%</h1>"); }
					return;
				} // wait to preload
				if( gamecake.state!=game ) {
					if(game.preload) { game.preload(gamecake,opts); } // optional preload update
					else { $this.html(""); }
					
					game.sheet=gamecake.gfx.sheet({sx:game.opts.width,sy:game.opts.height}).draw(); // create master sheet
					
					$this.empty(); // clean out anything the preload may have added
						
					switch(gamecake.opts.render)
					{
						case "canvas":
							gamecake.$canvas=$("<canvas></canvas>");
							gamecake.$canvas.attr("width",game.opts.width);
							gamecake.$canvas.attr("height",game.opts.height);
							gamecake.$canvas.css("width",game.opts.width+"px");
							gamecake.$canvas.css("height",game.opts.height+"px");
							$this.append( gamecake.$canvas ); // create canvas
							
							gamecake.ctx=gamecake.$canvas.get(0).getContext("2d"); // this is what we draw on

						break;
						default:
						case "dhtml":
						
							$this.append( game.sheet.div ); // and display it
							
						break;
					}

					gamecake.state=game.setup(gamecake,opts);
				} // setup after preload
								
				gamecake.code.input.update();
				game.update(gamecake,opts);
				game.draw(gamecake,opts);
				
			};
   			update(); // and must start the upadates
		});
	};
	
})(jQuery);
