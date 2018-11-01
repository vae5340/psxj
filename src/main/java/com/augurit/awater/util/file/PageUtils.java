package com.augurit.awater.util.file;

import java.util.List;

import com.augurit.awater.common.page.Page;
import com.augurit.awater.common.page.PageRequest;
import org.apache.commons.lang.StringUtils;

public class PageUtils {
    public PageUtils() {
    }

    public static Page newPageInstance(Page source) {
        if (source != null) {
            Page destination = new Page();
            copyProperty(source, destination);
            return destination;
        } else {
            return null;
        }
    }

    public static PageRequest newPageRequestInstance(Page source) {
        if (source != null) {
            PageRequest destination = new PageRequest();
            copyProperty(source, destination);
            return destination;
        } else {
            return null;
        }
    }

    public static void copy(Page source, List result, Page destination) {
        copyProperty(source, destination);
        if (result != null && result.size() > 0) {
            destination.setResult(result);
            destination.setTotalItems(source.getTotalItems());
        }

    }

    public static void copy(Page source, Page destination) {
        copyProperty(source, destination);
        if (source.getResult() != null && source.getResult().size() > 0) {
            destination.setResult(source.getResult());
            destination.setTotalItems(source.getTotalItems());
        }

    }

    public static void copyProperty(PageRequest source, PageRequest destination) {
        if (source != null && destination != null) {
            destination.setPageNo(source.getPageNo());
            destination.setPageSize(source.getPageSize());
            destination.setCountTotal(source.isCountTotal());
            destination.setOrderBy(source.getOrderBy());
            if (StringUtils.isNotBlank(source.getOrderDir())) {
                destination.setOrderDir(source.getOrderDir());
            }
        }

    }
}
