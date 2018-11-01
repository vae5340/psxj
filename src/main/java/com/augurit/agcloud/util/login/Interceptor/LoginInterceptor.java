package com.augurit.agcloud.util.login.Interceptor;


import com.alibaba.fastjson.JSON;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpusLoginUser;
import com.augurit.awater.dri.utils.Result;
import com.augurit.awater.framework.config.AppAuthenication;
import io.jsonwebtoken.*;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationManager;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class LoginInterceptor implements HandlerInterceptor {
    private static final Logger log = LoggerFactory.getLogger(LoginInterceptor.class);

    //请求之前
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        //log.info("---------------------开始进入app请求地址拦截----------------------------");
        Result result = new Result();
        /****判断是否已登录状态****/
        try {
            OpusLoginUser opusLoginUser = SecurityContext.getOpusLoginUser();
            request.setAttribute("opusLoginUser",opusLoginUser);
            return true;
        } catch (Exception e) {}

        String tokenValue =  request.getHeader("Authorization");
        if(StringUtils.isBlank(tokenValue) || tokenValue.trim().length()==0){
            try {
                response.setContentType("text/json");
                response.getWriter().append(JSON.toJSONString(new Result(false,"no token!"))).flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        if(tokenValue.contains("bearer")){
            tokenValue = tokenValue.substring(7);
        }
        Claims claims = null;
        try {
            claims = (Claims) Jwts.parser().setSigningKey("agcloudTokenKey88".getBytes("UTF-8")).parseClaimsJws(tokenValue).getBody();
            Object object = claims.get("opusLoginUser");
            ObjectMapper objectMapper = new ObjectMapper();
            OpusLoginUser opusLoginUser = (OpusLoginUser)objectMapper.convertValue(object, OpusLoginUser.class);
            request.setAttribute("opusLoginUser",opusLoginUser);
            //认证成功后设置回Context中 和设置到request中步骤重复
            Authentication token = new UsernamePasswordAuthenticationToken(opusLoginUser.getUser().getLoginName(), "N/A");
            AppAuthenication app = new AppAuthenication();
            request.setAttribute(OAuth2AuthenticationDetails.ACCESS_TOKEN_VALUE,tokenValue);
            app.setDetail(new OAuth2AuthenticationDetails(request));
            SecurityContextHolder.getContext().setAuthentication(app);
        } catch (Exception e) {
            try {
                response.setContentType("text/json");
                response.getWriter().append(JSON.toJSONString(new Result(false,"token验证失败!"+e.getMessage()))).flush();
                return false;
            } catch (IOException e1) {
                e1.printStackTrace();
                return false;
            }
        }
        //可以从request中获取当前app请求过来的用户
        return true;
    }
    /**
     * 请求处理之后（视图操作）
     * 可以在这里进行token过期刷新返回处理
     * */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }
    /**
     * 整个请求结束之后（需要preHandler 为true）
     * */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }

}
