package com.augurit.agcloud.common.controller;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import com.augurit.awater.common.page.Page;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public abstract class BaseController<T> {
    protected final Logger log = Logger.getLogger(this.getClass());

    @Autowired
    private HttpServletRequest servletRequest;

    protected Page<T> page = null;
    protected HttpServletRequest request;
    protected HttpServletResponse response;
    @ModelAttribute
    public void init(HttpServletRequest req, HttpServletResponse response){
        this.request=req;
        this.response=response;
        String pageNo=req.getParameter("page.pageNo");
        String pageSize=req.getParameter("page.pageSize");
        String orderBy = req.getParameter("page.orderBy");
        String orderDir = req.getParameter("page.orderDir");
        Page page = new Page();
        if(StringUtils.isNotBlank(pageNo))
            page.setPageNo(Integer.parseInt(pageNo));
        if(StringUtils.isNotBlank(pageSize))
            page.setPageSize(Integer.parseInt(pageSize));
        if(StringUtils.isNotBlank(orderBy))
            page.setOrderBy(orderBy);
        if(StringUtils.isNotBlank(orderDir))
            page.setOrderDir(orderDir);
        setPage(page);
    }
    public Page getPage() {
        return page;
    }
    public void setPage(Page page) {
        this.page = page;
    }
}
