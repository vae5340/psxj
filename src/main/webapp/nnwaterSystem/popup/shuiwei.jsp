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
    <input id="itemname109" name="itemname" value="实时水位" type="hidden" />
    <input id="itemtype109" name="itemType" value="1" type="hidden" />
    <input id="rate109" name="rate" value="1" type="hidden" />
    <input id="unit109" name="unit" value="米" type="hidden" />
    <input id="upperLimit109" name="upperLimit" value="40.0" type="hidden" />
    <input id="lowerLimit109" name="lowerLimit" value="0.0" type="hidden" />
    <input id="warnLimit109" name="warnLimit" value="210.0" type="hidden" />
    <input id="warnLimit2109" name="warnLimit2" value="310.0" type="hidden" />
	     <div title="水位" style="padding:10px">
				<div id="container109" style="width: 100%; height: 100%"></div>
		     </div>
</body>
</html>
