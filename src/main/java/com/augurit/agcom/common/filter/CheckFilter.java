package com.augurit.agcom.common.filter;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import com.augurit.agcom.common.system.service.ISystem;
import com.augurit.agcom.common.system.service.impl.SystemImpl;
import com.common.util.Common;

/**
 *  登录用户拦截 未登录用户不能直接访问rest接口
 * @author Hunter
 *
 */
@SuppressWarnings({"unchecked", "rawtypes"})
public class CheckFilter implements Filter {
    
	private ISystem system;
	
	private Set ipSet;

    private Pattern p;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
//        ipSet = new HashSet();
//        ipSet.addAll(Arrays.asList(Common.getLocalAddress()));
//        ipSet.addAll(Arrays.asList(Common.checkNull(Common.getByKey("allow.host")).split(", *")));
//        p = Pattern.compile("/[^\\.]+(\\.do)*$");
//        system = new SystemImpl();
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
//        HttpServletRequest request = (HttpServletRequest) servletRequest;
//        String uri = request.getRequestURI();
//        Matcher m = p.matcher(uri);
//        if (!m.matches()
//        		) {
//            filterChain.doFilter(servletRequest, servletResponse);
//            return;
//        }
//        String remoteIp = Common.getIpAddr(servletRequest);
//        String token = servletRequest.getParameter("token");
//        if (ipSet.contains(remoteIp) || checkToken(token)) {
//            filterChain.doFilter(servletRequest, servletResponse);
//        } else {
//            //跳到错误页面
//            servletRequest.getRequestDispatcher("/error/errorpage.html").forward(servletRequest, servletResponse);
//        }
    }

    private boolean checkToken(String token) {
		return system.checkToken(token);
	}

	@Override
    public void destroy() {
    }
}
