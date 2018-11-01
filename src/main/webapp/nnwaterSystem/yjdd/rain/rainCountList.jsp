<!DOCTYPE html>
<html>
<head>
   <%@ include file="/platform/style.jsp"%>
    <meta charset="utf-8">
    <title>ECharts</title>
    <script src="<%=path %>/gzps/yjdd/rain/echarts.js"></script>
    <script src="<%=path %>/gzps/yjdd/rain/vintage.js"></script>
</head>
<body>



  <!-- echart -->
    <div id="main" style="width: 100%; height: 400px;">
    </div>
    <script type="text/javascript">
        var myChart = echarts.init(document.getElementById('main'), "vintage");

        option = {
            baseOption: {
                timeline: {
                    axisType: 'category',
                    autoPlay: false,
                    playInterval: 3000,
                    data: [
                     '按积水次数统计', '按积水时间统计'
                     ]
                },
                title: {
                left:"center"
                },
                toolbox: {
                    show : true,
                    feature : {
                    	   myTool1: {
                               show: true,
                               title: '自定义扩展方法1',
                               icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                               onclick: function (){
                                   alert('myToolHandler1')
                               }
                           }
                    }
                },
            legend: {
                top:"30",
                data: ["银花东村", "城西干渠交口", "遵阳立交桥底", "龙旺公寓", "华力包装厂门口",
                       "凤凰三村", "凤凰四村", "滁城站南巷", "创业北苑", "琅琊区"]
            },
                calculable: true,
                grid: {
                    top: 80,
                    bottom: 100
                },
                xAxis: [
            {
                'type': 'category',
                'data': [
                    '2016年'
                ]
            }
            ],
            label: {
                normal: {
                    show: true,
                    "position": "top"
                },
                emphasis: {
                    show: true,
                    "position": "top"
                }
            },
            itemStyle: {
                normal: {
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10
                }
            },
            yAxis: [{
                    
                }],
                series: [
            { name: '银花东村', type: 'bar' },
            { name: '城西干渠交口', type: 'bar' },
            { name: '遵阳立交桥底', type: 'bar' },
            { name: '龙旺公寓', type: 'bar' },
            { name: '华力包装厂门口', type: 'bar' },
            { name: '凤凰三村', type: 'bar' },
            { name: '凤凰四村', type: 'bar' },
            { name: '滁城站南巷', type: 'bar' },
            { name: '创业北苑', type: 'bar' },
            { name: '琅琊区', type: 'bar' }
        ]
            },
            options: [
        {
            yAxis: [{
            name:"(次)"
        }],
            title: { text: '按积水次数统计' },
            series: [
                { data: [20] },
                { data: [45] },
                { data: [35] },
                { data: [78] },
                { data: [38] },
                { data: [11] },
                { data: [90] },
                { data: [44] },
                { data: [84] },
                { data: [65] }
            ]
        },
        {
            yAxis: [{
                name: "(小时)"
            }],
            title: { text: '按积水时间统计' },
            series: [
                { data: [400] },
                { data: [145] },
                { data: [350] },
                { data: [578] },
                { data: [456] },
                { data: [789] },
                { data: [247] },
                { data: [542] },
                { data: [873] },
                { data: [587] }
            ]
        }
    ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    </script>
    
    
    <!--  -->
 
	<table class="ui-table" width="100%" cellpadding="1" cellspacing="1" data-options="showPage:false,
																					pageNum:<w:write bind="pageNum"/>,
																					pageSize:<w:write bind="pageSize_"/>,
																					total:<w:write bind="pagination.totalCount"/>">
		<thead>
				<tr class="ui_th">
					<th width="30%">内涝点名称</th>
	    			<th width="30%">内涝次数</th>
	    			<th width="30%">内涝时间(小时)</th>
				</tr>
			</thead>
			<tbody>
			<tr class="ui_td"><td>银花东村</td><td>20</td><td>400</td></tr>
			<tr class="ui_td"><td>城西干渠交口</td><td>45</td><td>145</td></tr>
			<tr class="ui_td">	<td>遵阳立交桥底</td><td>35</td><td>350</td></tr>
			<tr class="ui_td">	<td>龙旺公寓</td><td>78</td><td>579</td></tr>
			<tr class="ui_td">	<td>华力包装厂门口</td><td>38</td><td>456</td></tr>
			<tr class="ui_td">	<td>凤凰三村</td><td>11</td><td>789</td></tr>
			<tr class="ui_td">	<td>凤凰四村</td><td>90</td><td>247</td></tr>
			<tr class="ui_td">	<td>滁城站南巷</td><td>44</td><td>542</td></tr>
			<tr class="ui_td">	<td>创业北苑</td><td>84</td><td>873</td></tr>
			<tr class="ui_td">	<td>琅琊区</td><td>65</td><td>587</td></tr>
			</tbody>
		</table>
	
	  
	
</body>
</html>
