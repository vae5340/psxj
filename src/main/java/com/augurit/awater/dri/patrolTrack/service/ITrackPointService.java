package com.augurit.awater.dri.patrolTrack.service;


import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.awater.dri.patrolTrack.web.form.TrackPointForm;

import java.util.List;
import java.util.Map;

public interface ITrackPointService extends ICrudService<TrackPointForm, Long> {

    List<Map<String, Object>> getFormByParentOrgId(String parentOrgId);

    List<TrackPointForm> getFormByTrackId(String trackId);

    long getLengthByTrackId(String trackId);
}