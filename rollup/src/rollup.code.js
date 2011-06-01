
//code
rollup={}; // a global place to keep our cake


(function(game){
	
	game.ds=[2,4,6,8,10,12,20];

	game.opts={};
	
	game.p={};
	
	game.preloadimgs={
//		back:"art/test/layout.png",
//		plots:"art/plots4.png",
//		blocks:"art/blocks.png"
	};
	
	for(var t in game.ds )
	{
		var d=game.ds[t];
		game.preloadimgs["d"+d]="art/die/d"+d+".png";
/*
 * 		for(var i=1; i<=d; i++)
		{
			game.preloadimgs["d"+d+"."+i]="art/die/d"+d+"."+i+".png";
		}
*/
	}


	game.opts.name="rollup";
	game.opts.width=480;
	game.opts.height=320;
	game.opts.backcolor="#ffffff";
	
	game.setup=function(cake,opts){
			
		cake.setup();
		game.dice.setup();
		game.menu.setup();

		return game;
	};
	
	game.clean=function(cake){
		game.dice.clean();
		game.menu.clean();
		cake.clean();		
	};
	
	game.draw=function(cake){
		cake.draw();
		game.menu.draw();
		game.dice.draw();
	};
	
	game.update=function(cake){

// magic scale
		var p=game.$this.parent();
		var pw=p.width();
		var ph=p.height();
		var z=(pw/game.opts.width);
		if( (z*game.opts.height) > ph ) { z=(ph/game.opts.height); }	
		if( game.lastzoom!=z )
		{
			game.lastzoom=z;
			game.$this.css("zoom",z);
		}

		cake.update();
		game.menu.update();
		game.dice.update();
	};
	
})(rollup);

/*
(function(game){
	
	game.div=null;
	

	game.setup=function(opts){
		
		game.div=opts.div;

		game.div_test=$("<div style=\"margin:auto;width:350px;\"></div>");
		
		for(var i in game.ds )
		{
			var v=game.ds[i];
			game.div_test.append( $("<img style=\"width:50px;\" src=\"art/die/d"+v+"."+v+".png\"></img>") );
		}
		
		game.div.append(game.div_test);

		return game;
	};


})(rollup);
*/
