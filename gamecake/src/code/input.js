//code


(function() {
	var self={};
	gamecake.code.input=self;

	gamecake.input={};
	var input=gamecake.input;

	input.x=0;
	input.y=0;
	
	input.set_down=[]; // internal state changes
	input.set_up=[];
	input.set_ascii=[];
	
	input.down=[];
	input.up=[];
	input.state=[];
	
	input.ascii=[]; // simple "ascii", array of typed chars for more inputs

	input.events=[]; // last frames events, currently always empty

	function getkey(code){
		if (code == '37') { return "left"; }
		if (code == '38') { return "up"; }
		if (code == '39') { return "right"; }
		if (code == '40') { return "down"; }
		if (code == '32') { return "fire"; }
		if (code == '0')  { return "button"; } // mouse
	}
	
	self.keydown=function(event)
	{
		var key="button"; // we also pull in mouse clicks here
		if(event.type!="mousedown")
		{
			key=getkey(event.keyCode);
			input.set_ascii.push(event.keyCode);
		}
		if (key) { 
			input.set_down[key]=true;
		}
		return false;
	};
	self.keyup=function(event)
	{
		var key="button"; // we also pull in mouse clicks here
		if(event.type!="mouseup") { key=getkey(event.keyCode); }
		if (key) { 
			input.set_up[key]=true;
		}
		return false;
	};

	self.touchdown=function(event,$this)
	{
		var tevent =  event.originalEvent.touches.item(0);  
		input.x=tevent.clientX;
		input.y=tevent.clientY;
		input.set_down["button"]=true;
//		return false;
	};
	self.touchup=function(event,$this)
	{
		var tevent =  event.originalEvent.touches.item(0);  
		input.x=tevent.clientX;
		input.y=tevent.clientY;
		input.set_up["button"]=true;
//		return false;
	};
	self.touchmove=function(event,$this)
	{
		var tevent =  event.originalEvent.touches.item(0);  
		input.x=tevent.clientX;
		input.y=tevent.clientY;
		event.preventDefault();  
		return false;  
	};
	
	self.mousemove=function(event,$this)
	{
  		var pos=$this.offset();
		input.x=event.pageX-pos.left;
		input.y=event.pageY-pos.top;
//		rollup.dbg.div.html(input.x + " : " + input.y );
//		console.log( input.x + " : " + input.y );
		return false;
	};

	self.update=function()
	{
		input.ascii=input.set_ascii;
		input.set_ascii=[];
		
		input.down=[];
		input.up=[];
		for(i in input.set_down) {
			if(!input.state[i])
			{
				input.down[i]=true;
				input.state[i]=true;
			}
		}
		for(i in input.set_up) {
			if(input.state[i])
			{
				input.up[i]=true;
				input.state[i]=false;
			}
		}
		input.set_down=[];
		input.set_up=[];
	};
	
	
	return self;
})();
