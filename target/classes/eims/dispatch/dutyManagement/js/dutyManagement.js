define(['jquery','layer','awaterui'],function($,layer,awaterui){



var mYear,mMonth,mDate,mPhone,dateEle,startLiIndex,layerIndex;
function showMonthView(year,month){
  var dayViewHtml='<ul class="monthUl"><li style="text-align:center"><div style="float:left"><img id="last" src="/awater/img/leftArrow.png" style="padding-left:5px;"></img></div>'+
    '<span id="parentTime" style="font-size:18px;line-height:30px;">'+year+"年"+month+"月"+'</span><div style="float:right"><img id="next" src="/awater/img/rightArrow.png" style="padding-right:10px;"></div></li></ul>'+
    '<ul class="dayUl"><li style="background-color:orange;">星期一</li><li style="background-color:orange;">星期二</li><li style="background-color:orange;">星期三</li><li style="background-color:orange;">星期四</li><li style="background-color:orange;">星期五</li><li style="background-color:#00d900;">星期六</li><li style="background-color:#00d900;">星期日</li></ul>'+
    '<ul><li id="l1"></li><li id="l2"></li><li id="l3"></li><li id="l4"></li><li id="l5"></li><li id="l6"></li><li id="l7"></li></ul>'+
    '<ul><li id="l8"></li><li id="l9"></li><li id="l10"></li><li id="l11"></li><li id="l12"></li><li id="l13"></li><li id="l14"></li></ul>'+
    '<ul><li id="l15"></li><li id="l16"></li><li id="l17"></li><li id="l18"></li><li id="l19"></li><li id="l20"></li><li id="l21"></li></ul>'+
    '<ul><li id="l22"></li><li id="l23"></li><li id="l24"></li><li id="l25"></li><li id="l26"></li><li id="l27"></li><li id="l28"></li></ul>'+
    '<ul class="lastUl"><li id="l29"></li><li id="l30"></li><li id="l31"></li><li id="l32"></li><li id="l33"></li><li id="l34"></li><li id="l35"></li></ul>'+
    '<ul class="lastUl"><li id="l36"></li><li id="l37"></li><li id="l38"></li><li id="l39"></li><li id="l40"></li><li id="l41"></li><li id="l42"></li></ul>';
  $("#view").html(dayViewHtml); 
  var monthDayCount=(new Date(year,month,0)).getDate();
  var firstDay=(new Date(year,month-1,1)).getDay();
  if(firstDay==0)
     startLiIndex=7;
  else 
     startLiIndex=firstDay;
  for(var i=0;i<monthDayCount;i++){
      $("#l"+(i+startLiIndex)).html("<span style='margin-left:60px'>"+(i+1)+"</span>");
  }
  if($("#l36").text()=="")
     $("#l36").parent().remove();
  else
     $("#l29").parent().removeClass("lastUl");       
  if((new Date()).getFullYear()==year&&(new Date()).getMonth()==month-1){   
     var today=(new Date()).getDate();
     $("#l"+(today+startLiIndex-1)).css("background-color","#bbe9e7");
     $("#l"+(today+startLiIndex-1)).css("opacity","#0.8");
     //$("#l"+(today+startLiIndex-1)).css("color","red");
  } 
  $("#dAll").show();       
    $("#parentTime").mouseover(function(){
    $(this).css("cursor","default");
  });
  $("#parentTime").mouseover(function(){
    $("#parentTime").css("color","blue");
  });
  $("#parentTime").mouseout(function(){
    $("#parentTime").css("color","black");
  });
  
  $("#last").click(function(){ 
    if(month==1){
      year=year-1;
      showMonthView(year,12);
      displayMonthManagement(year+",12");
    }
    else{
      showMonthView(year,month-1);
      displayMonthManagement(year+","+(month-1));
    }  
  });
  $("#next").click(function(){
    month = parseInt(month);
    if(month==12){
      year=year+1;
      showMonthView(year,1);
      displayMonthManagement(year+",1");
    }else{
      showMonthView(year,month+1);
      displayMonthManagement(year+","+(month+1));
    }   
  });
  
  $("li").click(function(){
    //点击具体日期管理值班人员
    dateEle=$(this);
    mYear=year;
    mMonth=month-1;
    mDate=parseInt(this.innerText);
    var date = new Date(mYear, mMonth, mDate);    
    if(!isNaN(mDate)){
      var phone="",name=""
      if($(this).children("ul #dutyDiv").length>0){
        name=$(this).find(".name").html().substr(4);
        if($(this).find(".phone").length>0){
          phone=$(this).find(".phone").html().substr(4);
          mPhone=phone;
        }
      }
      $.get("/psemgy/eims/dispatch/dutyManagement/dutyPerson.html",function(h){
          layerIndex=layer.open({
            type: 1, 
            content: h,
            title:'值班人员安排',
            shadeClose: true,
            shade: 0.5,
            area: ['480px', '265px']
          });
          // layer.full(index);
          require(['psemgy/eims/dispatch/dutyManagement/js/dutyPerson'],function(dutyPerson){
            dutyPerson.init(name,phone,layerIndex,dateEle,date);
          });
      }); 
    }
  });
}


  function showYearView(year) {
    var monthViewHtml = '<ul class="yearUl"><li style="text-align:center"><div style="float:left"><img id="last" src="/awater/img/leftArrow.png" style="padding-left:5px;padding-right:43%"></img></div>' + 
    '<span style="font-size:18px;color:black;">' + year + '年</span><div style="float:right"><img id="next" src="/awater/img/rightArrow.png" style="float:right;padding-right:10px;"></img></div></li></ul>' + 
    '<ul class="monthListUl"><li id="m1">一月</li><li id="m2">二月</li><li id="m3">三月</li><li id="m4">四月</li></ul>' + 
    '<ul class="monthListUl"><li id="m5">五月</li><li id="m6">六月</li><li id="m7">七月</li><li id="m8">八月</li></ul>' + 
    '<ul class="monthListUl lastMounthUl"><li id="m9">九月</li><li id="m10">十月</li><li id="m11">十一月</li><li id="m12">十二月</li></ul>';
    $("#view").html(monthViewHtml);

    $(".monthListUl li").click(function() {
      switch (this.id) {
      case "m1":
        showMonthView(year, 1);
        displayMonthManagement(year + ",1");
        break;
      case "m2":
        showMonthView(year, 2);
        displayMonthManagement(year + ",2");
        break;
      case "m3":
        showMonthView(year, 3);
        displayMonthManagement(year + ",3");
        break;
      case "m4":
        showMonthView(year, 4);
        displayMonthManagement(year + ",4");
        break;
      case "m5":
        showMonthView(year, 5);
        displayMonthManagement(year + ",5");
        break;
      case "m6":
        showMonthView(year, 6);
        displayMonthManagement(year + ",6");
        break;
      case "m7":
        showMonthView(year, 7);
        displayMonthManagement(year + ",7");
        break;
      case "m8":
        showMonthView(year, 8);
        displayMonthManagement(year + ",8");
        break;
      case "m9":
        showMonthView(year, 9);
        displayMonthManagement(year + ",9");
        break;
      case "m10":
        showMonthView(year, 10);
        displayMonthManagement(year + ",10");
        break;
      case "m11":
        showMonthView(year, 11);
        displayMonthManagement(year + ",11");
        break;
      case "m12":
        showMonthView(year, 12);
        displayMonthManagement(year + ",12");
        break;
      }
    });
    $("#dAll").hide();
    $("#last").click(function() {
      showYearView(year - 1);
    });
    $("#next").click(function() {
      showYearView(year + 1);
    });
  }

  var personListHtml;


  function displayMonthManagement(yearMonthStr) {
    $.ajax({
      method :  'GET',
      url :  '/psemgy/dutyManagement/listJson?yearMonthStr=' + yearMonthStr,
      async :  true,
      dataType :  'json',
      success : function(data)  {
        for (var i=0;(data&&i<data.length);i++) {//var i in data
          var date = (new Date(data[i].dutyDate)).getDate();
          var html = $("#l" + (date + startLiIndex - 1)).html();
          html = html + "<div id='dutyDiv'><span class='name' style='font-size:14px;color:black;'>姓名: " + data[i].personName + "</span>";
          if (data[i].phoneNumber) html = html + "<br><span class='phone' style='font-size:14px;color:black;'>电话: " + data[i].phoneNumber + "</span>";
          html = html + "</div>";
          $("#l" + (date + startLiIndex - 1)).html(html);
        }
      },
      error : function(e)  {
        layer.msg("发生错误！", {icon: 2});
        console.log('displayMonthManagement error!'+e);
      }
    });
  }



  function deleteMonth() {
    layer.confirm('确定清空本月值班安排？', {
      btn: ['确定', '取消']
    },
    function(index) {
      var timeText = $("#parentTime").text();
      var year = timeText.substr(0, 4);
      var month = timeText.substr(0, timeText.length - 1).substr(5);
      $.ajax({
        method :  'post',
        url :  '/psemgy/dutyManagement/deleteMonthJson',
        data: {
          yearMonthStr: year + "," + month
        },
        async :  true,
        dataType :  'json',
        success : function(data)  {
          showMonthView(year, month);
          layer.close(index);
        },
        error : function(e)  {
          alert('deleteMonth error！'+e);
        }
      });
    },
    function() {});
  }

  function queryDistrict(){
    awaterui.createNewtab("/psemgy/eims/dispatch/dutyManagement/districtQuery.html","成员单位值班安排",function(){
      require(["psemgy/eims/dispatch/dutyManagement/js/districtQuery"],function(districtQuery){
        districtQuery.init();
      }); 
    });
  } 




  function initBtn(){
    $("#dutyManagementQueryDistrictBtn").click(queryDistrict);
    $("#dutyManagementDeleteMonthBtn").click(deleteMonth);
    $("#parentTime").click(
    function(){
      var text=this.innerText;
      var year=parseInt(text.substr(0,4));
      showYearView(year);
    });
  }

  function init(){
      $.ajax({
          url: '/psemgy/meteoHydrologAlarm/getUserType',
          dataType: 'json',
          cache:false,
          success: function (data){
              if(data.type=="1")
                  $("#dutyManagement #title").text("市级值班管理");
              else{
                  $("#dutyManagement #title").text("成员单位值班管理");
                  $("#queryDistrict").hide();
              }
              initBtn();
              var curDate=new Date();
              showMonthView(curDate.getFullYear(),curDate.getMonth()+1);
              var yearMonthStr=curDate.getFullYear()+","+(curDate.getMonth()+1);
              displayMonthManagement(yearMonthStr);
          },
          error : function() {
              alert('error');
          }
      });
  };

  return{
    init:init
  }

})



