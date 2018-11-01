/**
 * Class: EchartsWidget
 * echarts组件类。
 * 输入：专题图模板。输出：专题图效果
 */
EchartsWidget = function(domId, configUrl,parameterUrl){
    /**
     * Property: configUrl
     * 配置文件路径。
     */
    this.configUrl=null,
    
    /**
     * Property: chartDiv
     * chartDiv为图表所在节点。
     */
    this.chartDiv=null,
    
    /**
     * Property: chart
     * echarts实例对象。
     */
    this.chart=null,
    
    /**
     * Property: echarts
     * echarts图表开源框架。
     */
    this.echarts=null,
    
    /**
     * Property: config
     * 解析json配置文件后所获得的js对象。
     */
    this.config=null,
	
    /**
     * Property: kpiServiceURL
     * KPI服务地址。
     */
    this.kpiServiceURL=null,
	
    /**
     * Property: style
     * 配置文件的样式节点。
     */
    this.style=null,
    
    /**
     * Property: originData
     * 请求服务后返回的原型数据。
     */
    this.originData=null,
    
    /**
     * Property: timerId
     */
    this.timerId=null,
    
     /**
     * Property: loadConfigFinished
     * 图表配置文件是否加载完成
     */
    this.loadConfigFinished=false,
    
    /**
     * Property: catalogConfigs
     * 配置文件的目录节点。
     */
    this.catalogConfigs=null,
    
   /**
     * Property: updateConfigFun
     * 更新echarts配置文件方法
     */
    this.updateConfigFun=null, 	
    /**
     * Property: parameterUrl
     * get请求的参数串
     */
    this.parameterUrl = "",
    /**
     * Property: ajax请求
     * get请求的参数串
     */
    this.ajaxRequest;
    /**
     * Method: loadChartByConfigUrl
     * 请求服务，执行回调，回调函数的参数为请求的数据。
     *
     * Parameters:
     * configUrl - {String} 配置文件的路径。
     */
    this.loadChartByConfigUrl=function(configUrl){
    	this.loadConfigFinished = false;
        $.ajax({
            url: configUrl,
            context: this,
            async: true, //false为同步请求。同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
            dataType: "text",  // json
            success: function(jsonObj){
            	this.loadConfigFinished = true;
				this.loadChart(jsonObj);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                alert("loadChartByConfigUrl error: 加载配置文件失败");
            }
        });
    },
    	
    /**
     * Method: loadChart
     * Parameters:
     * config - {String} 配置文件。
     * 加载图表。
     *
     */
    this.loadChart=function(config){
    	this.clear();
    	//执行配置文件中的js代码,注册事件回调
         $.proxy(new Function(config),this)();
         //设置配置文件对象
    	 this.kpiServiceURL = url;
    	 this.updateConfigFun = configFunction;
		//不请求服务则直接根据配置的选项渲染图表。
		if(this.kpiServiceURL == ""){
			//更新图表的配置文件
	        this.updateConfigFun();
			this.chart.setOption(option, true);
			return;
		}
		
		var timerCallback = function(){
			this.getKPI($.proxy(function(result){
            	//替换服务端数据
               	data = result;
               	//更新图表的配置文件
               	this.updateConfigFun();
               	this.chart.clear();
               	//更新图表
                this.chart.setOption(option, true);
            }, this));
		};
			
		if(delay >= 0){
			this.timerId = window.setInterval($.proxy(timerCallback, this), delay * 1000);
		}
		$.proxy(timerCallback, this)();
    },
	
    /**
     * Method: setChart
     * 设置图表对象。
     *
     * Parameters:
     * chart - {Object} chart对象。
     */
    this.setChart=function(chart){
        this.chart = chart;
		this.chartDiv = this.chart.dom;
    },
	
    /**
     * Method: getKPI
     * 请求KPI服务，获得原始数据。
     *
     * Parameters:
     * callBackFn - {Function} 回调函数。
     */
    this.getKPI=function(callBackFn){
    	if(this.ajaxRequest) this.ajaxRequest.abort(); //终止之前所有的未结束的ajax请求，然后重新开始新的请求  
    	this.ajaxRequest = $.ajax({
            url: this.kpiServiceURL + this.parameterUrl,
            dataType: "text",
            success: function(json){
				this.originData = eval("("+json+")");
                if (typeof callBackFn == "function") {
                    callBackFn(this.originData);
                };
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                //alert("getKPI error: 请求KPI服务失败");
				//this.loadChart(false);
            }
            
        });
    },
     
    /**
     * APIMethod: on
     * 注册事件监听回调方法。
     *
     * Parameters:
     * type - {String} 事件类型。
     * callBackFn - {function} 回调方法。
     */
    this.on= function(eventType, callBackFn){
    	this.chart.on(eventType,callBackFn);
    },
    
    this.un=function(eventType,callBackFn)
    {
    	this.chart.un(eventType,callBackFn);
    },

    
    this.clear=function(){
    	//清除上次渲染的图表
    	this.chart.clear();
    	//清除上次的图表的记时器
		window.clearInterval(this.timerId);
		this.timerId = null;
	},
	
	/**
     * Parameters:
     * parameterUrl - {String} url参数。
     * 动态更改url参数
     */
	this.changeParameterUrl = function(parameterUrl){
		this.parameterUrl = parameterUrl;
		if(this.kpiServiceURL == "")
			return;
		if(this.loadConfigFinished){
			this.getKPI($.proxy(function(result){
            	//替换服务端数据
               	data = result;
               	//更新图表的配置文件
               	this.updateConfigFun();
               	this.chart.clear();
               	//更新图表
                this.chart.setOption(option, true);
            }, this));
		}
	},
	
	/**
     * Constructor: EchartsWidget
     * Parameters:
     * domId - {String} div容器id。
     * configUrl - {String} 配置文件的路径。
     * 构造函数。
     */
	$.proxy(function(){
		this.echarts = echarts;
		if(domId){
			var chart = this.echarts.init($("."+domId)[0]);
        	this.setChart(chart);
		}
		this.parameterUrl = parameterUrl;
        this.configUrl = configUrl;
		if(configUrl){
			this.loadChartByConfigUrl(configUrl);
		}
    },this)(),
    /**
     * Property: CLASS_NAME
     * 类名。
     */
	this.CLASS_NAME= "EchartsWidget";
};
