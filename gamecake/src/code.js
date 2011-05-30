//code
gamecake={}; // a global place to keep our cake

gamecake.code={};

gamecake.setup=function(){};
gamecake.clean=function(){};
gamecake.update=function(){};
gamecake.draw=function(){};

gamecake.opts={};
gamecake.images={};

gamecake.ticks=0;


(function($) {
	$.fn.gamecake = function(opts) {
		
		gamecake.opts=opts;
		
		return this.each(function() {
			var game=opts.game;
			var $this = $(this);
			game.$this=$this;
			
			$this.css("width",game.opts.width+"px");
			$this.css("height",game.opts.height+"px");
			$this.css("background",game.opts.backcolor);
			$this.css("position","relative");
			$this.css("overflow","hidden");
			
			game.sheet=gamecake.gfx.sheet({sx:game.opts.width,sy:game.opts.height}).draw(); // create master sheet
			$this.append( game.sheet.div ); // and display it

//			game.dbg=gamecake.gfx.sheet({sx:game.opts.width,sy:game.opts.height}).draw(); // create master sheet
//			$this.append( game.dbg.div ); // and display it

// this forces the browser to scroll to this area which is a tad annoying.
//			$this.attr("tabindex","0").focus(); //grab initial display focus so that keys work
			
			
			$this.keydown(gamecake.code.input.keydown);
			$this.keyup(gamecake.code.input.keyup);
			$this.mousedown(gamecake.code.input.keydown);
			$this.mouseup(gamecake.code.input.keyup);
			$("body").mousemove(function(e){return gamecake.code.input.mousemove(e,$this)});

			$("body").bind("touchstart",function(e){return gamecake.code.input.touchdown(e,$this)});
			$("body").bind("touchmove", function(e){return gamecake.code.input.touchmove(e,$this)});
			$("body").bind("touchend",  function(e){return gamecake.code.input.touchup(e,$this)});
			
			var requestAnimationFrame = (function(){
			  return  window.requestAnimationFrame       || 
					  window.webkitRequestAnimationFrame || 
					  window.mozRequestAnimationFrame    || 
					  window.oRequestAnimationFrame      || 
					  window.msRequestAnimationFrame     || 
					  function(callback,element){
						  window.setTimeout(callback, 1000 / 60);
					  };
			})();
    
			var update;
			
			update=function() {
	   			requestAnimationFrame(update); // we need to always ask to be called again
				
				gamecake.ticks++;
				
				if( ! gamecake.code.preload.check(game) ) { return; } // wait to preload
				if( gamecake.state!=game ) { gamecake.state=game.setup(gamecake,opts); } // setup after preload
				
				gamecake.code.input.update();
				game.update(gamecake,opts);
				game.draw(gamecake,opts);				
			};
			
   			update(); // and must start the upadates
		});
	};
})(jQuery);
