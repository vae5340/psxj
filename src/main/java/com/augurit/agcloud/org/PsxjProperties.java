package com.augurit.agcloud.org;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;


@Configuration
@PropertySource(value = {"classpath:psxj/psxj.properties","classpath:application.properties"},encoding="utf-8")
public class PsxjProperties {
    @Value("${orgList}")
    public String orgList;
    @Value("${filePath}")
    private String filePath;
    @Value("${fileSmallPath}")
    private String fileSmallPath;
    @Value("${arcgis_request}")
    private String arcgis_request;
    @Value("${arcgis_mp_request}")
    private String arcgis_mp_request;
    @Value("${arcgis_lx_request}")
    private String arcgis_lx_request;
    @Value("${arcgis_xbc_request}")
    private String arcgis_xbc_request;
    @Value("${arcgis_feedBack_request}")
    private String arcgis_feedBack_request;
    @Value("${request_file_path}")
    private String request_file_path;


    /** application  **/
    @Value("${spring.application.name}")
    private String serverName;
    //登陆客户端id
    @Value("${security.oauth2.client.clientId}")
    private String clientId;
    @Value("${security.oauth2.client.clientSecret}")
    private String clientSecret;
    /**application */
    @Value("${agcloud.framework.sso.sso-server-url}")
    private String sso_server_url;

    public String getOrgList() {
        return orgList;
    }

    public String getFilePath() {
        return filePath;
    }

    public String getArcgis_request() {
        return arcgis_request;
    }

    public String getArcgis_mp_request() {
        return arcgis_mp_request;
    }

    public String getArcgis_lx_request() {
        return arcgis_lx_request;
    }

    public String getArcgis_xbc_request() {
        return arcgis_xbc_request;
    }

    public String getArcgis_feedBack_request() {
        return arcgis_feedBack_request;
    }

    public String getSso_server_url() {
        return sso_server_url;
    }

    public String getClientId() {
        return clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public String getRequest_file_path() {
        return request_file_path;
    }

    public String getServerName() {
        return serverName;
    }

    public String getFileSmallPath() {
        return fileSmallPath;
    }
}
