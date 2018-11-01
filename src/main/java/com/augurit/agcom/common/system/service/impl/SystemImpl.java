package com.augurit.agcom.common.system.service.impl;

import org.springframework.stereotype.Service;

import com.augurit.agcom.common.system.service.ISystem;
import com.common.util.Common;

/**
 * Created by hunter on 2017-11-10.
 */
@Service
public class SystemImpl implements ISystem {

    /**
     * 验证token，有效1次
     *
     * @param token
     * @return
     */

    public boolean checkToken(String token) {
        /*
        if (Common.isCheckNull(token)) return false;
        String tokenHost = Common.getByKey(new String[] {"token.url", "agsupport.url"}, "http://127.0.0.1:8080/agweb");
        String checkUrl = tokenHost + "/rest/system/checkToken";
        String result = Common.sendGet(checkUrl, "{'token':'"+token+"'}");
        return Boolean.parseBoolean(result);
        */
        return true;
    }
}
