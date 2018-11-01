/**
 * 
 */
//兴宁区 地区编码：450102 邮编：530000 电话区号：0771
//青秀区 地区编码：450103 邮编：530000 电话区号：0771
//江南区 地区编码：450105 邮编：530000 电话区号：0771
//西乡塘区 地区编码：450107 邮编：530000 电话区号：0771
//良庆区 地区编码：450108 邮编：530200 电话区号：0771
//邕宁区 地区编码：450109 邮编：530200 电话区号：0771
//武鸣县 地区编码：450122 邮编：530100 电话区号：0771
//隆安县 地区编码：450123 邮编：532700 电话区号：0771
//马山县 地区编码：450124 邮编：530600 电话区号：0771
//上林县 地区编码：450125 邮编：530500 电话区号：0771
//宾阳县 地区编码：450126 邮编：530400 电话区号：0771
//横县 地区编码：450127 邮编：530300 电话区号：0771
/**
 * 行政区域
 */
var nnArea=[];
nnArea.push({code:'450102',name:'B区'});
nnArea.push({code:'450103',name:'H区'});
nnArea.push({code:'450105',name:'A区'});
nnArea.push({code:'450107',name:'D区'});
nnArea.push({code:'450108',name:'C区'});
nnArea.push({code:'450109',name:'E区'});
nnArea.push({code:'450122',name:'J区'});
nnArea.push({code:'450123',name:'K区'});
nnArea.push({code:'450124',name:'L区'});
nnArea.push({code:'450125',name:'M区'});
nnArea.push({code:'450126',name:'N区'});
nnArea.push({code:'450127',name:'O区'});
nnArea.push({code:'450128',name:'F区'});
nnArea.push({code:'450129',name:'H区'});
nnArea.push({code:'450130',name:'I区'});

/**
 * 设置行政区域框
 * @param selObj select jquery对象
 */
function setNnArea(selObj){ 
    var value;
    var text;
    var i=0;
    for(i;i<nnArea.length;i++){
    	value=nnArea[i].code;  
        text=nnArea[i].name;
        selObj.append("<option value='"+value+"'>"+text+"</option>");  
    }	
}