function loadHarmfulDetail(tablename){
    var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
    if (rowData.length == 1) {
        var row = rowData[0];
        var tableDisplayName = "";
        var harmful_id;
        if(tablename == 'agcom_sz.ly_pests'){
            tableDisplayName = '虫害';
            if(row.pests_id == undefined || row.pests_id == "" || row.pests_id == null){
                layer.alert("未找到相应的虫害信息！");
                return;
            }else{
                harmful_id = row.pests_id;
            }
        }else if(tablename == 'agcom_sz.ly_harmful_plant'){
            tableDisplayName = '有害植物';
            if(row.harmful_plant_id == undefined || row.harmful_plant_id == "" || row.harmful_plant_id == null){
                layer.alert("未找到相应的有害植物信息！");
                return;
            }else{
                harmful_id = row.harmful_plant_id;
            }
        }else if(tablename == 'agcom_sz.ly_disease'){
            tableDisplayName = '病害';
            if(row.disease_id == undefined || row.disease_id == "" || row.disease_id == null){
                layer.alert("未找到相应的病害信息！");
                return;
            }else{
                harmful_id = row.disease_id;
            }
        }
        var itemParam = {
            serverName: serverName,
            tableName: tablename,
            id: harmful_id
        };
//iframe窗
        window.openLayerPanal('../../../../webpage/asi/common/infodetail.html', tableDisplayName + "详细信息", itemParam, 778, 600, 120, $(window).width() * 0.45, false, true, null, null);
    }else {
        layer.alert("请选中一条记录！");
    }
}
