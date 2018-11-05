package com.augurit.awater.dri.patrolTrack.service;


import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.patrolTrack.web.form.TrackLineForm;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

public interface ITrackLineService extends ICrudService<TrackLineForm, Long> {
    @Transactional(readOnly = true)
    /**
     * 巡检轨迹分页查询
     * @param userForm
     * @param page
     * @param form
     * @param map
     * @return
     */
    String getPageList(OpuOmUser userForm, Page<TrackLineForm> page, TrackLineForm form,
                       Map<String, Object> map);

    @Transactional(readOnly = true)
    Page<TrackLineForm> getPageListForApp(Page<TrackLineForm> page, TrackLineForm form,
                                          Map<String, Object> map);

    @Transactional(readOnly = true)
    List<TrackLineForm> getTrackLinesByLoginName(String loginName);
}