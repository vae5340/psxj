$(function(){
    if(parent.personListHtml){
       $("#personList").append(parent.personListHtml);
       if(personName){
           $("#personList").val(personName);
           var mobile=$("#personList").find("option:selected").data("mobile");
		   $("#phoneNumber").val(mobile);
		   if($("#personList").find("option:selected").data("isUser"))
		      $("#phoneNumber")[0].disabled = true;
		   else
		      $("#phoneNumber")[0].disabled = false;
		   $("#deleteBtn").show();    
       }
    }else{
        $("body").css("cursor","wait");
        $("personList").css("cursor","wait");
   		$.ajax({
			method : 'GET',
			url : '/agsupport/duty-management!getPersonList.action',
			async : true,
			dataType : 'json',
			success : function(data){
		         var personList=data;
		         for(var i in personList){
		            if(personList[i].phone_number)
		              $("#personList").append("<option data-is-user="+personList[i].is_user+" data-mobile="+personList[i].phone_number+">"+personList[i].person_name+"</option>");
		            else
		              $("#personList").append("<option data-is-user="+personList[i].is_user+" data-mobile=''>"+personList[i].person_name+"</option>");   
		         }
		         if(personName){
		               $("#personList").val(personName);
		               var mobile=$("#personList").find("option:selected").data("mobile");
					   $("#phoneNumber").val(mobile);
					   if($("#personList").find("option:selected").data("isUser"))
					      $("#phoneNumber")[0].disabled = true;
					   else
					      $("#phoneNumber")[0].disabled = false;
					   $("#deleteBtn").show();    
		         }
		         $("body").css("cursor","default");
		         $("personList").css("cursor","default");
			},
			error : function() {
				alert('error');
			}
		});
	}
	
	$("#personList").change(function(){
	   var mobile=$("#personList").find("option:selected").data("mobile")
	   $("#phoneNumber").val(mobile);
	   if($("#personList").find("option:selected").data("isUser"))
	      $("#phoneNumber")[0].disabled = true;
	   else
	      $("#phoneNumber")[0].disabled = false;    
	});
	
	$("#addDutyPerson").click(function(){
	    if($("#addDutyPerson").text()=="添加人员"){
	 	    $("#personList").hide();
			$("#personName").show();
			$("#addDutyPerson").text("返回列表");
			if($("#phoneNumber")[0].disabled)
			    $("#phoneNumber")[0].disabled = false; 
		}else{
		    $("#personList").show();
			$("#personName").hide();
			$("#addDutyPerson").text("添加人员");
			if($("#personList").find("option:selected").data("isUser"))
		      $("#phoneNumber")[0].disabled = true;
		    else
		      $("#phoneNumber")[0].disabled = false; 
		}
	});
});

var personListHtml;

function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}
var personName=getQueryStr("name");	
var phone=getQueryStr("phone");	

function save(){
   var name,newUser;
   if($("#personName").is(':hidden')){
      if($("#personList").val()==""){
        layer.msg("值班人员姓名不能为空");
        return;
      }
      name=$("#personList").val();
      newUser=0;
   }else{
      if($("#personName").val()==""){
        layer.msg("值班人员姓名不能为空");
        return;
      }
      name=$("#personName").val();
      //新增值班人员需检测是否同名
      if(parent.personListHtml.indexOf(">"+name+"</option>")>0){
         layer.msg("已存在同名用户，请更改");
         return;
      }
      parent.personListHtml+="<option data-is-user=0 data-mobile="+$("#phoneNumber").val()+">"+name+"</option>";
      newUser=1;      
   }
   var phone=$("#phoneNumber").val();
   parent.savePerson(name,phone,newUser,window.name);
}

function cancel(){
  parent.layer.close(parent.layer.getFrameIndex(window.name));
}

function deletePerson(){
   parent.deletePerson(window.name);
}