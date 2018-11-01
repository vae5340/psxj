define(['jquery','layer'],function($,layer){
var personListHtml,layerIndex,personName,personPhone,dateEle,date


  function save() {
    var name, newUser;
    if ($("#personName").is(':hidden')) {
      if ($("#personList").val() == "") {
        layer.msg("值班人员姓名不能为空", {icon: 2,time: 1000});
        return;
      }
      name = $("#personList").val();
      newUser = 0;
    } else {
      if ($("#personName").val() == "") {
        layer.msg("值班人员姓名不能为空", {icon: 2,time: 1000});
        return;
      }
      name = $("#personName").val();
      //新增值班人员需检测是否同名
      if (personListHtml.indexOf(">" + name + "</option>") > 0) {
        layer.msg("已存在同名用户，请更改", {icon: 2,time: 1000});
        return;
      }
      personListHtml += "<option data-is-user=0 data-mobile=" + $("#phoneNumber").val() + ">" + name + "</option>";
      newUser = 1;
    }
    var phone = $("#phoneNumber").val();
    savePerson(name, phone, newUser);
  }

  function cancel() {
    layer.close(layerIndex);
  }


  function deletePerson(){
    debugger;
     dateEle.find("#dutyDiv").remove();
     $.ajax({
      method : 'post',
      url : '/psemgy/dutyManagement/deleteJson',
      data :{dateStr:date.getTime()},
      async : true,
      dataType : 'json',
      success : function(data) {
        layer.close(layerIndex);
      },
      error : function(e) {
        layer.msg("发生错误！", {icon: 2});
        console.log('deletePerson error!'+e);
      }
    });
  }

  function savePerson(name, phone, newUser) {
    if (dateEle.find("#dutyDiv").length > 0) dateEle.find("#dutyDiv").remove();
    var html = dateEle.html();
    html = html + "<div id='dutyDiv'><span class='name' style='font-size:14px;color:black;'>姓名: " + name + "</span>";
    if (phone) html = html + "<br><span class='phone' style='font-size:14px;color:black;'>电话: " + phone + "</span>";
    html = html + "</div>";
    dateEle.html(html);
    layer.close(layerIndex);
    $.ajax({
      method :  'get',
      url :  '/psemgy/dutyManagement/saveJson',
      data: {
        personName: name,
        phoneNumber: phone,
        newUser: newUser,
        dateStr: date.getTime()
      },
      async :  true,
      dataType :  'json',
      success :function(data)  {
        if (data.reload) {
          var timeText = $("#parentTime").text();
          var year = timeText.substr(0, 4);
          var month = timeText.substr(0, timeText.length - 1).substr(5);
          showMonthView(year, month);
          displayMonthManagement(year + "," + month);
          var str = "data-mobile=" + mPhone + ">" + name + "</option>";
          var h = personListHtml.substring(0, personListHtml.indexOf(str)) + "data-mobile=" + phone + ">" + name + "</option>" + personListHtml.substring(personListHtml.indexOf(str) + str.length);
          personListHtml = h;
        }
      },
      error : function(e)  {
        layer.msg("发生错误！", {icon: 2});
        console.log('savePerson  error!'+e);
      }
    });
  }


  function initBtn(){
    $("#dutyPersonSaveBtn").click(save);
    $("#dutyPersonCancelBtn").click(cancel);
    $("#dutyPersonDeleteBtn").click(deletePerson);

    $("#personList").change(function() {
      var mobile = $("#personList").find("option:selected").data("mobile");
      $("#phoneNumber").val(mobile);
      if ($("#personList").find("option:selected").data("isUser")) $("#phoneNumber")[0].disabled = true;
      else $("#phoneNumber")[0].disabled = false;
    });

    $("#addDutyPerson").click(function() {
      if ($("#addDutyPerson").text() == "添加人员") {
        $("#personList").hide();
        $("#personName").show();
        $("#addDutyPerson").text("返回列表");
        if ($("#phoneNumber")[0].disabled) $("#phoneNumber")[0].disabled = false;
      } else {
        $("#personList").show();
        $("#personName").hide();
        $("#addDutyPerson").text("添加人员");
        if ($("#personList").find("option:selected").data("isUser")) $("#phoneNumber")[0].disabled = true;
        else $("#phoneNumber")[0].disabled = false;
      }
    });

  }
  function init(_personName,_personPhone,_layerIndex,_dateEle,_date) {
    layerIndex=_layerIndex;
    personName=_personName;
    personPhone=_personPhone;
    dateEle=_dateEle;
    date=_date;
    initBtn();
    $("#dutyPerson").css("cursor", "wait");
    $("#personList").css("cursor", "wait");
    $.ajax({
      method :  'GET',
      url :  '/psemgy/dutyManagement/getPersonList',
      async :  true,
      dataType :  'json',
      success :  
      function(data) {
        personListHtml="";
        var personList=data;
        for(var i=0 ; i < personList.length; i++){//var i in personList
          if(personList[i].phone_number)
            personListHtml+="<option data-is-user="+personList[i].is_user+" data-mobile="+personList[i].phone_number+">"+personList[i].person_name+"</option>";
          else
            personListHtml+="<option data-is-user="+personList[i].is_user+" data-mobile=''>"+personList[i].person_name+"</option>";   
        }
        $("#personList").append(personListHtml);
        if (personName) {
          $("#personList").val(personName);
          var mobile = $("#personList").find("option:selected").data("mobile");
          $("#phoneNumber").val(mobile);
          if ($("#personList").find("option:selected").data("isUser")) $("#phoneNumber")[0].disabled = true;
          else $("#phoneNumber")[0].disabled = false;
          $("#dutyPersonDeleteBtn").show();
        }
        $("#dutyPerson").css("cursor", "default");
        $("#personList").css("cursor", "default");
      },
      error : function(e)  {
        layer.msg("初始化数据发生错误！", {icon: 2,time: 1000});
        console.log('初始化数据发生错误！'+e);
      }
    });
  


  };
  return{
    init:init
  }
})

