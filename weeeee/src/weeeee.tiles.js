
(function(game){
	
	var us={}
	game.tiles=us;
	
	us.t=[];
	
	us.tile=null;
	us.block=null;
	
	us.get_next_tile=function()
	{
		if( (!us.block) || (b.idx>=b.wide) )
		{
			us.get_next_block();
		}
		
		var ts={
			flat_lft:{
				floor:100,
				side:50,
				url:gamecake.images.tlft.url
			},
			flat_mid:{
				floor:100,
				side:0,
				url:gamecake.images.tmid.url
			},
			flat_rgt:{
				floor:100,
				side:-50,
				url:gamecake.images.trgt.url
			},
			space:{
				url:null
			}
		};
		
		var b=us.block;
		var t={};
		
		switch(b.state)
		{
			case "flat":
				if(b.idx==0) // first
				{
				}
				else
				if(b.idx==b.wide-1) // last
				{
				}
				else // middle
				{
				}
			break;
		}
		b.idx++;
		us.tile=t;
		return t;
	}
	
	us.get_next_block=function()
	{
		var b={};
			
		if(us.block)
		{
		}
		else
		{
			b.idx=0;
			b.top=200;
			b.wide=10;
			b.state="flat";
		}
		us.block=b;
		return b;
	}
	
	us.setup=function(play,sheet)
	{
		us.play=play;
		us.sheet=sheet;
		
		for(i=0;i<8;i++)
		{
			us.t[i]=gamecake.gfx.sheet({parent:us.sheet,sx:100,sy:480,url:gamecake.images.tmid.url,px:i*100,py:200+(i*10)}).draw();
		}
	};

	us.clean=function()
	{
		for(i=0;i<8;i++)
		{
			us.t[i].clean();
		}
	};

	us.draw=function()
	{
		for(i=0;i<8;i++)
		{
			us.t[i].draw();
		}
	};

	us.update=function(speed)
	{
		for(i=0;i<8;i++)
		{
			us.t[i].px-=speed;
			if(us.t[i].px<-100)
			{
				us.t[i].px+=800;
			}
			us.t[i].update();
		}
	};
	

})(weeeee);
