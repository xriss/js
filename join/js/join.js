
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var join={opts:opts};
	
	var $=require("./jquery.js"); require("./jquery.cookie.js");

// parse query string
	join.qs={};
	var qs=window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < qs.length; i++)
	{
		var q=qs[i].split("=");
		join.qs[ q[0] ]=decodeURIComponent(q[1]);
	}
	
	join.vars={};
	join.vars.session=q.session || $.cookie("fud_session");
	join.vars.token=q.token;

//	require('./join.html.js').setup(join);

/*

handle a dumid login to an external site
first we get the user to login (possibly already logged in)
then we ask the user if they want the external site to know their info
then we redirect back to the external site

*/
	join.userapi="http://api.wetgenes.com:1408/genes/user/";
//	join.userapi="http://host.local:9999/genes/user/";

	join.template=$("<div></div>");
		
	join.fill=function(){
		$(opts.div).empty().append( join.template.find(".wetjoin_main").clone() );

//		console.log(join.qs);
		if(join.qs.token)
		{
			join.vars.token=join.qs.token;
			join.page("token");
			$(".wetjoin_main .wetjoin_submit").click();
		}
		else
//		if(join.qs.dumid)
		{
			join.page("session");
			$(".wetjoin_main .wetjoin_submit").click();
//			join.page("dumid");
		}
//		else
//		{
//			join.page("login");
//		}

	};

	join.page=function(pagename){
		
		$(".wetjoin").removeClass().addClass("wetjoin wetjoin_page_"+pagename);
		
		join.vars.token=  $(".wetjoin_main .wetjoin_token").val()   || join.vars.token;
		join.vars.name=   $(".wetjoin_main .wetjoin_name" ).val()   || join.vars.name;
		join.vars.email=  $(".wetjoin_main .wetjoin_email").val()   || join.vars.email;
		join.vars.pass=   $(".wetjoin_main .wetjoin_pass" ).val()   || join.vars.pass;
		join.vars.session=$(".wetjoin_main .wetjoin_session").val() || join.vars.session;

		$(".wetjoin_main .wetjoin_page").empty().append( join.template.find(".wetjoin_page_"+pagename).clone() );

		$(".wetjoin_main .wetjoin_token"   ).val(join.vars.token);
		$(".wetjoin_main .wetjoin_name"    ).val(join.vars.name);
		$(".wetjoin_main .wetjoin_email"   ).val(join.vars.email);
		$(".wetjoin_main .wetjoin_pass"    ).val(join.vars.pass);
		$(".wetjoin_main .wetjoin_session" ).val(join.vars.session);
		
		$(".wetjoin_main .span_token").text(join.vars.token);
		$(".wetjoin_main .span_name" ).text(join.vars.name);
		$(".wetjoin_main .span_email").text(join.vars.email);

		if(join.qs.dumid)
		{
			$(".wetjoin_main .span_website").text(join.qs.dumid.split("/")[2] || join.qs.dumid);
		}

		join.bind();
		return false;
	};

	join.callback=function(cmd,dat){
//		console.log(cmd,dat);
		
		if(dat.error)
		{
			$(".wetjoin_main .wetjoin_error").text( dat.error );

			if(cmd=="session"){
				join.page("login");
			}

			return;
		}
		
		var cont=function(vars){
			
			var q=""
			
			for(n in vars)
			{
				q=q+"&"+n+"="+vars[n];
			}
			
			if(join.qs["dumid"])
			{
				join.page("dumid");
			}
			else
			if(join.qs["continue"])
			{
				if(join.qs["continue"].indexOf('?') === -1) { q="?"+q; }
				window.location.href=join.qs["continue"]+q;
			}
//			else
//			{
//				window.location.href="http://forum.wetgenes.com/?"+q;
//			}
		}
			

		if(cmd=="join"){
			join.page("join2");
		}
		else
		if(cmd=="login"){
			join.vars.session=dat.session;
			join.page("login2");
			$.cookie("fud_session",join.vars.session,{ expires: 7*7, path: '/' });
			cont({S:join.vars.session});
		}
		else
		if(cmd=="avatar"){
			join.page("avatar2");
		}
		else
		if(cmd=="forgot"){
			join.page("forgot2");
		}
		else
		if(cmd=="session"){
			join.vars.name=dat.name; // remember name
			join.page("login2");
			cont({S:join.vars.session});
		}
		else
		if(cmd=="token"){
			if(dat.command=="update")
			{
				join.vars.name=dat.name || join.vars.name; // remember name
				join.vars.email=dat.email || join.vars.email; // remember name
				join.page("login");
			}
			else
			if(dat.command=="create")
			{
				join.vars.name=dat.name || join.vars.name; // remember name
				join.vars.email=dat.email || join.vars.email; // remember name
				join.page("login");
			}
		}
	};

	join.submit=function(cmd){
//		console.log(cmd);

		$(".wetjoin_main .wetjoin_error").text("");

		var token= $(".wetjoin_main .wetjoin_token" ).val();
		var name=  $(".wetjoin_main .wetjoin_name"  ).val();
		var email= $(".wetjoin_main .wetjoin_email" ).val();
		var pass=  $(".wetjoin_main .wetjoin_pass"  ).val();
		
		var avatar=$(".wetjoin_main .wetjoin_avatar_preview").attr("src")

		if(cmd=="join"){
			$.post( join.userapi+"create",{
				"name":name,"email":email,"pass":pass
			},function(a,b,c){return join.callback("join",a,b,c);},"json");
			return false;
		}
		else
		if(cmd=="avatar"){
			$.post( join.userapi+"avatar",{
				"name":name,"pass":pass,"avatar":avatar,
			},function(a,b,c){return join.callback("avatar",a,b,c);},"json");
			return false;
		}
		else
		if(cmd=="login"){
			$('#form').submit();
			$.post( join.userapi+"login",{
				"name":name,"pass":pass
			},function(a,b,c){return join.callback("login",a,b,c);},"json");
			return true;
		}
		else
		if(cmd=="forgot"){
			$.post( join.userapi+"update",{
				"email":email,"pass":pass
			},function(a,b,c){return join.callback("forgot",a,b,c);},"json");
			return false;
		}
		else
		if(cmd=="token"){
			$.post( join.userapi+"token",{
				"token":token
			},function(a,b,c){return join.callback("token",a,b,c);},"json");
			return false;
		}
		else
		if(cmd=="session"){
			$.post( join.userapi+"session",{
				"session":(join.vars.session || "")
			},function(a,b,c){return join.callback("session",a,b,c);},"json");
			return false;
		}
	};
	
	join.dumid_confirm=function(confirm)
	{
		if(join.qs["dumid"])
		{
			if(confirm)
			{
				if(join.qs["dumid"].indexOf('?') === -1)
				{
					window.location.href=join.qs["dumid"]+"?confirm="+join.vars.session;
				}
				else
				{
					window.location.href=join.qs["dumid"]+"&confirm="+join.vars.session;
				}
			}
			else
			{
				window.location.href=join.qs["dumid"]+"&deny=1";
			}
		}
		else
		{
			join.page("login2");
		}
		return false;
	};

	join.process_avatar=function()
	{

		var preview=$(".wetjoin_main .wetjoin_avatar_preview")
		var file=$(".wetjoin_main .wetjoin_avatar")[0].files[0]

		preview.attr("src","");

		if(file)
		{
			var reader=new FileReader()
			reader.onloadend=function()
			{
				var img=new Image();
				img.src=reader.result;
				img.onload=function()
				{
					var canvas=document.createElement('canvas');			
					var ctx=canvas.getContext('2d');
					canvas.width=100;
					canvas.height=100;
					ctx.drawImage(img,0,0,100,100);	
					preview.attr("src",canvas.toDataURL());
				}
			}
			reader.readAsDataURL(file)
		}

	}


	join.bind=function(){
		$(".wetjoin_main .wetjoin_header_join"   ).off("click").on("click",function(){return join.page("join");});
		$(".wetjoin_main .wetjoin_header_login"  ).off("click").on("click",function(){return join.page("login");});
		$(".wetjoin_main .wetjoin_header_forgot" ).off("click").on("click",function(){return join.page("forgot");});
		$(".wetjoin_main .wetjoin_header_avatar" ).off("click").on("click",function(){return join.page("avatar");});

		$(".wetjoin_main .wetjoin_submit_avatar" ).off("click").on("click",function(){return join.submit("avatar");});
		$(".wetjoin_main .wetjoin_submit_login"  ).off("click").on("click",function(){return join.submit("login");});
		$(".wetjoin_main .wetjoin_submit_join"   ).off("click").on("click",function(){return join.submit("join");});
		$(".wetjoin_main .wetjoin_submit_forgot" ).off("click").on("click",function(){return join.submit("forgot");});
		$(".wetjoin_main .wetjoin_submit_token"  ).off("click").on("click",function(){return join.submit("token");});
		$(".wetjoin_main .wetjoin_submit_session").off("click").on("click",function(){return join.submit("session");});

		$(".wetjoin_main .wetjoin_confirm").off("click").on("click",function(){return join.dumid_confirm(true);});
		$(".wetjoin_main .wetjoin_deny"   ).off("click").on("click",function(){return join.dumid_confirm(false);});

		$(".wetjoin_main .wetjoin_avatar"   ).on("change",function(){ return join.process_avatar() });

		// enter in inputs will auto force a submit
		$(".wetjoin_main input").off("keypress").on("keypress",function(e){
			if(e.which == 13)
			{
				$(this).blur();
				$(".wetjoin_main .wetjoin_submit").click();
				return false;
			}
		});
	};
	

	join.template.load("join.template.html",join.fill);
	
	return join;

};
