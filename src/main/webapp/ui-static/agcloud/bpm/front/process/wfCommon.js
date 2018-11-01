//流程相关
agcloud.bpm = {
    engine : {
        metronic:{
            //办理任务
            startTask:function (taskId,busRecordId){
                window.open(ctx+'/front/process/initProcessTurning.do?taskId='+taskId+"&viewId="+viewId+"&busRecordId="+busRecordId,'_blank');
            },
            //签收任务
            signTask:function (taskId){
                $.ajax({
                    url:ctx + "/front/task/signTask.do?taskId="+taskId,
                    dataType:"json",
                    type:"get",
                    success:function(result){
                        if(result.success){
                            agcloud.ui.metronic.showSuccessTip("签收成功！",2300,false);
                        }else{
                            agcloud.ui.metronic.showErrorTip("签收失败！",2000,false);
                        }
                    }
                });
            },
            //指派任务
            assignTask:function (taskId,userId){
                $.ajax({
                    url:ctx + "/front/task/assignTask.do?taskId="+taskId+"&userId="+userId,
                    dataType:"json",
                    type:"get",
                    success:function(result){
                        if(result.success){
                            agcloud.ui.metronic.showSuccessTip("指派任务成功！",2300,false);
                        }else{
                            agcloud.ui.metronic.showErrorTip("指派任务失败！",2000,false);
                        }
                    }
                });
            },
            //转交任务
            sendOnTask:function (taskId,userId){
                if (taskId != null && taskId != ''&&userId!=null && userId != '') {
                    $.ajax({
                        url:ctx + "/front/task/sendOnTask.do?taskId="+taskId+"&sendToUserId="+userId,
                        dataType:"json",
                        type:"get",
                        success:function(result){
                            if(result.success){
                                agcloud.ui.metronic.showSuccessTip("转交任务成功！",2300,true);
                            }else{
                                agcloud.ui.metronic.showErrorTip("转交任务失败,失败原因："+result.message,2000,false);
                            }
                        }
                    });
                }
            },
            //认领任务
            claimTask:function (taskId){
                $.ajax({
                    url:ctx + "/front/task/claimTask.do?taskId="+taskId+"&viewId="+viewId,
                    dataType:"json",
                    type:"get",
                    success:function(result){
                        if(result.success){
                            agcloud.ui.metronic.showSuccessTip("认领成功！",2300,false);
                            //刷新表格
                            location.reload();
                        }else{
                            agcloud.ui.metronic.showErrorTip("认领失败！",2000,false);
                        }
                    }
                });
            },
            //查看任务
            checkTask:function (taskId,busRecordId){
                window.open(ctx+'/front/process/checkTask.do?taskId='+taskId+"&viewId="+viewId+"&busRecordId="+busRecordId,'_blank');
            },
            //任务回退
            returnPrevTask:function (taskId){
                agcloud.ui.metronic.showConfirm("确认回退当前任务吗？",function () {
                    $.ajax({
                        url:ctx + "/front/task/returnPrevTask.do?taskId="+taskId,
                        dataType:"json",
                        type:"get",
                        success:function(result){
                            if(result.success){
                                agcloud.ui.metronic.showSuccessTip(result.message,2300,true);
                            }else{
                                agcloud.ui.metronic.showErrorTip(result.message,2000,false);
                            }
                        }
                    });
                });
            },
            //直接完成任务
            completeTask:function (taskId){
                agcloud.ui.metronic.showConfirm("确认完成并发送任务吗？",function () {
                    $.ajax({
                        url:ctx + "/front/task/completeTask.do?taskId="+taskId,
                        dataType:"json",
                        type:"get",
                        success:function(result){
                            if(result.success){
                                agcloud.ui.metronic.showSuccessTip(result.message,2300,true);
                            }else{
                                agcloud.ui.metronic.showErrorTip(result.message,2000,false);
                            }
                        }
                    });
                });
            }
        },
        easyui:{

        }
    },
    form : {
        metronic:{
            currentPrivData : null,///权限数据，这里写成类变量，是因为每一个表单页面都有一个独立的类，不冲突。
            currentFormId : null,//表单id
            currentFormData : null,//表单数据
            /**
             * 给表单赋值封装方法
             * @param isJsonData  true  是  否  不是
             * @param jsonData  数据
             * @param formId  '#表单id'
             */
            loadFormData : function (isJsonData,formId,jsonData){
                if(!isJsonData){
                    jsonData = eval("("+jsonData+")");
                }
                this.currentFormData = jsonData;
                this.currentFormId = formId;
                var obj = jsonData;
                var key,value,tagName,type,arr;
                for(var x in obj){
                    key = x;
                    value = obj[x];
                    $(formId + " [name='"+key+"'],"+ formId +" [name='"+key+"[]']").each(function(){
                        tagName = $(this)[0].tagName;
                        type = $(this).attr('type');
                        if(tagName == 'INPUT'){
                            if(type == 'radio'){
                                $(this).attr('checked',$(this).val()==value);
                            }else if(type == 'checkbox'){
                                arr = value.split(',');
                                for(var i =0;i<arr.length;i++){
                                    if($(this).val()==arr[i]){
                                        $(this).attr('checked',true);
                                        break;
                                    }
                                }
                            }else{
                                //加入文本框是日期类型的判断，和格式化
                                var dateType = $(this).attr("date-type");
                                var tempValue = value;
                                if(dateType){
                                    if(typeof value == "number"){
                                        if(dateType == "date"){
                                            tempValue = dateFormatter(value);
                                        }else if(dateType && dateType == "datetime"){
                                            tempValue = dateTimeFormatter(value);
                                        }
                                    }else{
                                        var date = new Date(value).getTime();
                                        if(dateType == "date"){
                                            tempValue = dateFormatter(date);
                                        }else if(dateType && dateType == "datetime"){
                                            tempValue = dateTimeFormatter(date);
                                        }
                                    }
                                }
                                $(this).val(tempValue);
                            }
                        }else if(tagName == 'TEXTAREA'){
                            $(this).val(value);
                        }else if(tagName=='SELECT'){
                            if($(this).hasClass("selectpicker")){
                                var vs = value.split(",");
                                $(this).selectpicker('val',vs);//设置选中
                                $(this).selectpicker('refresh');
                            }else{
                                $(this).val(value);
                            }
                        }
                    });
                }
            },
            /**
             * 将input框封装成日期框
             * @param selectors  input框id数组
             * @param format 日期格式
             */
            createDateInput : function (selectors,format,callback){
                if(selectors.length==0)return;
                var defaultFormat = "yyyy-mm-dd hh:ii:ss";
                if(format){
                    defaultFormat = format;
                }
                if(defaultFormat.length > 10){
                    for(var i = 0; i<selectors.length; i++){
                        var obj = $('#'+selectors[i]).datetimepicker({
                            language: 'zh',
                            format: defaultFormat,
                            minuteStep: 5,
                            secondStep: 5,
                            todayHighlight: true,
                            autoclose: true,
                            pickerPosition: 'bottom-left',
                            todayBtn: true,
                        });
                        if(callback){
                            obj.on('changeDate',callback);
                        }
                    }
                }else{
                    for(var i = 0; i<selectors.length; i++){
                        var obj = $('#'+selectors[i]).datepicker({
                            language: 'zh',
                            format: defaultFormat,
                            todayHighlight: true,
                            autoclose: true,
                            pickerPosition: 'bottom-left',
                            todayBtn: true,
                        });
                        if(callback){
                            obj.on('changeDate',callback);
                        }
                    }
                }
            },
            /**
             * 根据表单字段的权限配置，字段显隐，是否可编辑等
             * 日期类型的字段会加上日期控件
             * @param formId
             * @param fieldPowerData
             */
            formViewAndEditPower : function (formId, fieldPowerData) {
                var self = this;
                if(fieldPowerData){
                    self.currentPrivData = fieldPowerData;//暂存当前页面的权限数据
                    for(var i in fieldPowerData){
                        var field = fieldPowerData[i];
                        var key = field.elementName;
                        //根据name遍历当前表单下的所有字段
                        $(formId + " [name='"+key+"'],"+ formId +" [name='"+key+"[]']").each(function(){
                            if(field.isHidden == 1){
                                $(this).parent("div").hide();
                                $(this).parent("div").prev().hide();//连同label一起隐藏，待优化
                            }else{
                                var tagName = $(this)[0].tagName;
                                var type = $(this).attr('type');
                                if(field.isReadonly == 1){
                                    if(tagName=='INPUT'){
                                        if(type=='radio' || type=='checkbox'){
                                            $(this).click(function () {
                                                return false;//不可点击
                                            });
                                        }else{
                                            $(this).attr("readonly",true);//只读
                                        }
                                        if(field.columnType == "date" || field.columnType == "datetime"){//移除日期控件
                                            $(this).datepicker("remove");
                                            $(this).datetimepicker("remove");
                                        }
                                    }else if(tagName=='SELECT'){
                                        //直接不让下拉，即使没法把
                                        $(this).prop('disabled', true);
                                        $(this).css({'cursor':'','background':'#ffffff','border-color':'#d9d9d9'});
                                        if($(this).hasClass("selectpicker")){
                                            var $this = $(this);//针对selectpicker类型下来框的不可编辑优化
                                            var inter = setInterval(function () {
                                                if($this.siblings("button").length > 0){
                                                    window.clearInterval(inter);
                                                    $this.siblings("button").css({'cursor':'','background':'#ffffff','border-color':'#d9d9d9'});
                                                    $this.siblings("button").removeClass("disabled");
                                                    $this.parent("div").css('cursor', "");
                                                }
                                            })
                                        }else{
                                            //可下拉，但不可以改变选中的值
                                            // var sec = $(this)[0];
                                            // sec.onfocus=function(){this.defaultIndex=this.selectedIndex;}
                                            // sec.onchange=function(){this.selectedIndex=this.defaultIndex;}
                                        }
                                    }else if(tagName=='TEXTAREA'){
                                        $(this).attr("readonly",true);//只读
                                    }
                                }else{
                                    //初始化日期控件
                                    var selectors = [$(this)[0].id];
                                    if(tagName=='INPUT' && (field.columnType.toLowerCase() == "date" || field.columnType.toLowerCase() == "datetime")){
                                        var dateType = $(this).attr("date-type");
                                        if(dateType && dateType.toLowerCase() == "date"){
                                            self.createDateInput(selectors,"yyyy-mm-dd");
                                        }else if(dateType && dateType.toLowerCase() == "datetime"){
                                            self.createDateInput(selectors);//默认带时分秒的
                                        }
                                    }
                                }
                            }
                        });
                    }
                }else {
                    //没有字段权限配置数据时，默认给日期类型input加上日期控件
                    $(formId + " input").each(function(){
                        var type = $(this).attr('type');
                        if(type == 'text'){
                            var dateType = $(this).attr("date-type");
                            var selectors = [$(this).attr("id")];
                            if(dateType && dateType == "date"){
                                self.createDateInput(selectors,"yyyy-mm-dd");
                            }else if(dateType && dateType == "datetime"){
                                self.createDateInput(selectors);//默认带时分秒的
                            }
                        }
                    })
                }
            },
            //提交时数据校验，不可编辑的字段提交时只会用加载时的数据提交到后台，手动修改html后编辑没用
            formSubmitDataCheck : function () {debugger
                if(this.currentPrivData && this.currentFormId) {
                    for (var i in this.currentPrivData) {
                        var field = this.currentPrivData[i];
                        if (field.isReadonly == 1) {
                            var key = field.elementName;
                            var value = this.currentFormData[key];
                            var inputField = $(this.currentFormId + " [name='" + key + "']");
                            inputField.val(value);//设置原始值，避免被修改
                            inputField.removeAttr("disabled");//移除disabled属性，值才能传递到后台。
                        }
                    }
                }
            },
            //提交后恢复编辑权限设置
            refreshForm : function () {
                this.formViewAndEditPower(this.currentFormId,this.currentPrivData);
            },
            //设置表单的权限信息
            setCurrentPrivData : function (data) {
                this.currentPrivData = data;
            },
            //工作流自定义日期标签的初始化方法
            initBpmDatetimeTag : function (node) {
                var id = node.id;
                var format = node.getAttribute("format");
                var defaultFormat = "yyyy-mm-dd hh:ii:ss";
                if(format){
                    defaultFormat = format;
                }
                if(defaultFormat.length > 10){
                    var obj = $('#' + id).datetimepicker({
                        language: 'zh',
                        format: defaultFormat,
                        minuteStep: 5,
                        secondStep: 5,
                        todayHighlight: true,
                        autoclose: true,
                        pickerPosition: 'bottom-left',
                        todayBtn: true,
                    });
                    $('#' + id).datetimepicker("show");
                }else{
                    var obj = $('#' + id).datepicker({
                        language: 'zh',
                        format: defaultFormat,
                        todayHighlight: true,
                        autoclose: true,
                        pickerPosition: 'bottom-left',
                        todayBtn: true,
                    });
                    $('#' + id).datepicker("show");
                }
            }
        },
        easyui:{

        }
    }
}