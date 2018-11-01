function showInfo(url,id,title) {
    var options = {
        id: id,
        content:'<iframe src="' + url + '" style="width:100%;height:100%;"></iframe>',
        parentSelector:'#mapDiv',
        title: title,
        top:'1px',
        left:'1px',
        width:'100%',
        height:'500px'
    }
    new popup.PopupWin(options);
}