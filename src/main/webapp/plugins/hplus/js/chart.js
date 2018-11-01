$("#exampleTableEvents").bootstrapTable({
                url:'data/comb.json',												
				clickToSelect:true,//点击选中行																
				columns:[{
					field:'id',
					title:'编号',
					sortable:'true'
				},{
					field:'comb_name',
					title:'设施名称',
					sortable:'true'
				},{
					field:'est_type',
					title:'设施类型',
					sortable:'true',
					//editable:'true',
					align:'center'
				}]				     		
		});	
		var myChart1 = echarts.init(document.getElementById('chart1')); 
		var option1 = {
		    tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
           legend: {
                itemWidth: 12,
                itemHeight: 7,
                itemGap: 5,
				orient: 'vertical',
				left: 'left',
				top: 'top',
				data:['非满管','满管','积水','一般内涝','严重内涝'],

				textStyle: {
				    color: ['rgb(0,0,0)']
				}
				
			},
			series: [
				{
					name:'访问来源',
					type:'pie',
					radius: ['50%', '85%'],
					center: ['50%', '50%'],
					avoidLabelOverlap: false,
					grid:{
						x:40,
						y:20,
						y2:40,
						x2:8
					  },
					label: {
						normal: {
							show: false,
							position: 'center'
						},
						emphasis: {
							show: true,
							textStyle: {
								fontSize: '12',
								fontWeight: 'bold'
							}
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data:[
						{value:335, name:'非满管'},
						{value:310, name:'满管'},
						{value:234, name:'积水'},
						{value:135, name:'一般内涝'},
						{value:600, name:'严重内涝'}
					],
					color: ['#60C0DD','#F3A43B','#FAD860','#9BCA63','#FE8463']
				}
			]
		};      
		// 使用刚指定的配置项和数据显示图表。
			myChart1.setOption(option1);
		var myChart2 = echarts.init(document.getElementById('chart2'));        
		var option2 = {
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				left:'left',
				data:['一年一遇','两年一遇','五年一遇','十年一遇','三十年一遇','五十年一遇','一百年一遇']
				
			},
			series: [
				{
					name:'访问来源',
					type:'pie',
					radius: ['50%', '70%'],
					center: ['72%', '50%'],
					avoidLabelOverlap: false,
					grid:{
						x:40,
						y:20,
						y2:40,
						x2:8
					  },
					label: {
						normal: {
							show: false,
							position: 'center'
						},
						emphasis: {
							show: true,
							textStyle: {
								fontSize: '12',
								fontWeight: 'bold'
							}
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data:[
						{value:335, name:'一年一遇'},
						{value:310, name:'两年一遇'},
						{value:234, name:'五年一遇'},
						{value:135, name:'十年一遇'},
						{value:1048, name:'三十年一遇'},
						{value:251, name:'五十年一遇'},
						{value:147, name:'一百年一遇'}
					],
					color: ['rgb(254,67,101)','rgb(252,157,154)','rgb(249,205,173)','rgb(200,200,169)','rgb(131,175,155)','#8BCDAF','#75DEB2']
				}
			]
		};
		// 使用刚指定的配置项和数据显示图表。
			myChart2.setOption(option2);