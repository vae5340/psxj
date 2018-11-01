package com.augurit.awater.dri.onlineStatus.service;


import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.dri.onlineStatus.web.form.OnlineStatusForm;

public interface IOnlineStatusService extends ICrudService<OnlineStatusForm, Long> {
    OnlineStatusForm getOnlineStatusByUserId(String userId);
    void saveByUserId(OnlineStatusForm form);
}