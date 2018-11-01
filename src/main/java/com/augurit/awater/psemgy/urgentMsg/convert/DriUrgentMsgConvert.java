package com.augurit.awater.psemgy.urgentMsg.convert;


import com.augurit.awater.psemgy.urgentMsg.domain.DriUrgentMsg;
import com.augurit.awater.psemgy.urgentMsg.form.DriUrgentMsgForm;

public class DriUrgentMsgConvert {

    public static DriUrgentMsgForm entityVoForm(DriUrgentMsg entity){
        DriUrgentMsgForm form= new DriUrgentMsgForm();
        if(entity!=null){
            form.setId(entity.getId());
            form.setContent(entity.getContent());
            form.setIconUrl(entity.getIconUrl());
            form.setCreate(entity.getCreate());
            form.setLoginName(entity.getLoginName());
        }
        return null;
    }

}
