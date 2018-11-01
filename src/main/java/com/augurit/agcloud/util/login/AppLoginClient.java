package com.augurit.agcloud.util.login;


import com.augurit.agcloud.org.PsxjProperties;
import com.augurit.awater.dri.rest.util.arcgis.httpArcgisClient;
import com.augurit.awater.util.ThirdUtils;
import org.apache.http.Header;
import org.apache.http.HeaderElement;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import sun.misc.BASE64Encoder;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AppLoginClient {
    protected static Logger log = LoggerFactory.getLogger(AppLoginClient.class);

    private static BASE64Encoder encoder = new BASE64Encoder();
    private static int TIME_OUT=30000;//50s
    private static RequestConfig config = null;
    static{
        config = RequestConfig.custom()
                .setConnectTimeout(TIME_OUT)//连接超时
                .setConnectionRequestTimeout(TIME_OUT) //请求超时
                .setSocketTimeout(TIME_OUT)
                .setRedirectsEnabled(false)//不予许重定向
                .build();
    }

    /**
     * 登陆认证
     * */
    public static String login(Map<String,String> heard,Map<String,String> params, LoginForm loginForm) throws IOException {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        String result = null;
        try {
            //HttpPost post = new HttpPost(loginUrl+"/authentication/form");
            HttpPost post = new HttpPost(loginForm.getLoginUrl());
            post.setConfig(config);
            for(String key :heard.keySet()){
                post.setHeader(key,heard.get(key));
            }
            List<BasicNameValuePair> list = new ArrayList<BasicNameValuePair>();
            if(params!=null){
                for(String paramsKey:params.keySet()){
                    list.add(new BasicNameValuePair(paramsKey,params.get(paramsKey)));
                }
            }
            UrlEncodedFormEntity entity = new UrlEncodedFormEntity(list,"UTF-8");
            post.setEntity(entity);
            HttpResponse response = httpClient.execute(post);

            if(response.getStatusLine().getStatusCode() == 200) {
                result = EntityUtils.toString(response.getEntity());
            }
        } finally {
            if(httpClient!=null){
                httpClient.close();
            }
        }
        return result;
    }

    public static String appLogin(AppLoginForm loginForm) throws IOException {
        log.info(loginForm.getUsername()+":"+loginForm.getLoginname()+"请求登陆..............");
        if(!loginForm.getLoginUrl().contains("authentication")){
            loginForm.setLoginUrl(loginForm.getLoginUrl()+"/authentication/form");
        }
        Map<String,String> heard = new HashMap();
        Map<String,String> params = new HashMap();
        String clientId = loginForm.getClientId();
        String clientSecret = loginForm.getClientSecret();
        byte[] bytes =(clientId+":"+clientSecret).getBytes("UTF-8");
        String basic =  encoder.encode(bytes);
        heard.put("Content-Type","application/x-www-form-urlencoded");
        heard.put("Authorization","Basic "+basic);
        params.put("username",loginForm.getLoginname());
        params.put("password",loginForm.getPassword());
        params.put("deviceType",loginForm.getDeviceType());
        params.put("isApp",loginForm.getIsApp());
        params.put("orgId",loginForm.getOrgId());
        String result =  login(heard,params,loginForm);
        if(result!=null){
            log.info(loginForm.getUsername()+"登陆成功..............");
        }else{
            log.error(loginForm.getUsername()+"登陆认证失败!");
        }
        return result;
    }
}
