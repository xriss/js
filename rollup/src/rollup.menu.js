
(function(game){
	
	var us={}
	game.menu=us;
	
	us.setup=function()
	{
		us.data=[];
		us.state="none";
		
		us.sheet=gamecake.gfx.sheet({parent:game.sheet,px:0,py:0,sx:40,sy:game.opts.height});
		
	for(var t in game.ds )
	{
		var d=game.ds[t];
		var it=gamecake.gfx.sheet({auto:true,parent:us.sheet,px:0,py:t*40,sx:100,sy:100,sz:0.40,url:gamecake.images["d"+d+"."+d].url});
		it.div.data("dice",d);
		it.div.click(function(e){
			game.dice.add_die($(this).data("dice"));
		});
		us["sheet_but"+d]=it;
	}
		
		var it=gamecake.gfx.sheet({auto:true,parent:us.sheet,px:0,py:7*40,sx:100,sy:100,sz:0.40,url:gamecake.images["d"+2+"."+1].url});
		it.div.data("dice",0);
		it.div.click(function(e){
			game.dice.remove_dice();
		});
		us["sheet_but"+0]=it;
		
	};

	us.clean=function()
	{
		us.sheet.clean();
	};

	us.draw=function()
	{
		us.sheet.draw();
//		us.sheet_but.draw();
	};

	var idx=1;
	us.update=function()
	{
		idx=idx+1;
		if(idx>65536) { idx=1; }
//		us.sheet_but.url=gamecake.images["d10."+(1+(idx%10))].url;
		
		us.sheet.update();
//		us.sheet_but.update();
	};
	

})(rollup);
