package com.augurit.awater.bpm.file.web;

import com.augurit.awater.bpm.file.service.IDynamictableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @author lizzy
 * @date 2018/7/23 13:06
 */
@RestController
@RequestMapping("/dynamictable")
public class DynamictableController {

    @Autowired
    private IDynamictableService dynamictableService;

    @RequestMapping("/getTabs")
    public List getTabs(HttpServletRequest request) {
        return dynamictableService.getTabs(request);
    }

    @RequestMapping("/getRelatedDicitem")
    public List getRelatedDicitem(String typecode, String parenttypecode, String relatedFieldname, String tableid) {
        return dynamictableService.getRelatedDicitem(typecode, parenttypecode, relatedFieldname, tableid);
    }
}
