<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title></title>
    <script src="js/jquery-1.7.2.min.js" type="text/javascript"></script>
    <link href="themes/default/easyui.css" rel="stylesheet" type="text/css" />
    <script src="js/jquery.easyui.min.js" type="text/javascript"></script>
</head>
<body>
    <script src="highchart4.1.9/highcharts.src.js" type="text/javascript"></script>
    <script src="js/monitorstation.js" type="text/javascript"></script>
    <script type="text/javascript">
        function getNowValue() {
            return 10 - 1 + Math.random() * 2;
        } 
    </script>
    <input id="109" name="id" value="109" type="hidden" />
    <input id="itemid109" name="itemId" value="00000000008" type="hidden" />
    <input id="itemname109" name="itemname" value="积水深度" type="hidden" />
    <input id="itemtype109" name="itemType" value="1" type="hidden" />
    <input id="rate109" name="rate" value="1" type="hidden" />
    <input id="unit109" name="unit" value="cm" type="hidden" />
    <input id="upperLimit109" name="upperLimit" value="40.0" type="hidden" />
    <input id="lowerLimit109" name="lowerLimit" value="0.0" type="hidden" />
    <input id="warnLimit109" name="warnLimit" value="210.0" type="hidden" />
    <input id="warnLimit2109" name="warnLimit2" value="310.0" type="hidden" />
    <!--      隐藏域结束 -->
    <div id="tt" class="easyui-tabs" data-options="justified: true" style="width:100%;height:500px">

    <div title="水位" style="padding:10px">
			    <div id="container109" style="width: 100%; height: 100%">
     </div>
     </div>

      <div title="监控视频" style="padding:10px">
			   <iframe style="width:100%;height:100%" src="spjk.jsp" frameborder="0"></iframe>
     </div>

      <div title="监站设备" style="padding:10px">
      <div style="width:100%;height:100%">
        <div style="width:235px;height:100%;float:left">
                 <img src="img/tongxun.png"/><img src="img/zhengchang.jpg"/><br/><br/>
                 <img src="img/dianliu.png"/><img src="img/yichang.jpg"/><br/><br/>
                 <img src="img/dianya.png"/><img src="img/yichang.jpg"/>
        </div>
         <div style="width:500px;height:100%;float:left;font-size:18px;color:gray">
            <span style="color:green;">[Tue Jan 11 17:32:52 2013]</span> <span style="color:red;">[error]</span> [google 123.124.2.2] client denied by server: /export/home/macadmin/testdoc </br>
            <span style="color:green;">[Tue Jan 11 17:32:52 2013]</span> <span style="color:red;">[error]</span> [google 123.124.2.2] client denied by server: /export/home/macadmin/testdoc - no such file</br>
            <span style="color:green;">[Tue Jan 11 17:32:52 2013]</span> <span style="color:red;">[error]</span> [google 123.124.2.2] client denied by server: /export/home/macadmin/testdoc</br>
            <span style="color:green;">[Tue Jan 11 17:32:52 2013]</span> <span style="color:red;">[error]</span> [google 123.124.2.2] client denied by server: /export/home/macadmin/testdoc - no such file</br>
            <span style="color:green;">[Tue Jan 11 17:32:52 2013]</span> <span style="color:red;">[error]</span> [google 123.124.2.2] client denied by server: /export/home/macadmin/testdoc</br>
         </div>
      </div>
  </div>
     </div>
    </div>
    </div>
    <br />
</body>
</html>
