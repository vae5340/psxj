package com.augurit.awater.dri.column.service;


import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.dri.column.web.form.ColumnsUnreadForm;

public interface IColumnsUnreadService extends ICrudService<ColumnsUnreadForm, Long> {
    ColumnsUnreadForm getColumnsUnreadByUserId(Long userId);
    void deleteByUserId(String userId);
    int updateUnreadColumns(String type);
}