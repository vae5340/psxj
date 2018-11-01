/**
* Styleswitch stylesheet switcher built on jQuery
* Under an Attribution, Share Alike License
* By Kelvin Luck ( http://www.kelvinluck.com/ )
**/

var SkinCookieName = "myskin";

$(document).ready(function() {
	setskin();
	$('.styleswitch').click(function()
	{
	    if(this.getAttribute("rel")!=""){
	         var expdate=new Date();
	         expdate.setTime(expdate.getTime()+(24*60*60*1000*30));//+(24*60*60*1000*30)
	        SetCookie(SkinCookieName,this.getAttribute("rel"),expdate,"/",null,false);
	         setskin();
	     }
		return false;
	});
});

function setskin(){
    var thisskin = "blue";
    var cookieSkin=GetCookie(SkinCookieName);
    if(cookieSkin!=""){
        thisskin = cookieSkin;
    }
    
    if(thisskin=="blue"){
    	 skina.href= "style/blue/css/augur.min.css?v=1.0";
    	 skinb.href= "style/blue/css/style.min862f.css?v=4.1.0";
    	 skinc.href= "style/blue/css/bootstrap.min14ed.css";
    	 $("#logo")[0].src="style/blue/img/banner.png";
    }else{
    	 skina.href = "style/grey/css/augur.min.css?v=1.0";
    	 skinb.href= "style/grey/css/style.min862f.css?v=4.1.0";
    	 skinc.href= "style/grey/css/bootstrap.min14ed.css";
    	 $("#logo")[0].src="style/grey/img/banner.jpg";
    }
        
//    var reg = /\/.*\//; 
//    skina.href = skina.href.replace(reg, "style/"+thisskin+"");
}

function changecss(url){
    if(url!=""){
        var expdate=new Date();
        expdate.setTime(expdate.getTime()+(24*60*60*1000*30));//+(24*60*60*1000*30)
       SetCookie(SkinCookieName,url,expdate,"/",null,false);
        setskin();
    }
}

function SetCookie(name,value){
    var argv=SetCookie.arguments;
    var argc=SetCookie.arguments.length;
    var expires=(2<argc)?argv[2]:null;
    var path=(3<argc)?argv[3]:null;
    var domain=(4<argc)?argv[4]:null;
    var secure=(5<argc)?argv[5]:false;
    document.cookie=name+"="+escape(value)+((expires==null)?"":("; expires="+expires.toGMTString()))+((path==null)?"":("; path="+path))+((domain==null)?"":("; domain="+domain))+((secure==true)?"; secure":"");
}

function GetCookie(Name) {
    var search = Name + "=";
    var returnvalue = "";
    if (document.cookie.length > 0)
    {
        offset = document.cookie.indexOf(search);
        if (offset != -1) 
        { 
            offset += search.length;
            end = document.cookie.indexOf(";", offset); 
            if (end == -1)
                end = document.cookie.length;
                
            returnvalue=unescape(document.cookie.substring(offset,end));
        }
    }
    return returnvalue;
}