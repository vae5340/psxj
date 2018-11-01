function wfBusSave(templateCode, taskInstDbid, masterEntityKey){
	if(validateForm()){
		if(masterEntityKey != null && masterEntityKey==-1)
			$('form').attr('action', '${ctx}/awater-dlkw!wfBusSave.action?templateCode='+templateCode+'&taskInstDbid='+taskInstDbid+'&subProcessflag='+'1');
		else
			$('form').attr('action', '${ctx}/awater-dlkw!wfBusSave.action?templateCode='+templateCode+'&taskInstDbid='+taskInstDbid);
		$('form').submit();
	}
}

function validateForm(){
	if(document.forms[0].title.value == ''){
		alert('标题不能为空，请填写');
		document.forms[0].title.focus();
		return false;
	}
	return true;
}