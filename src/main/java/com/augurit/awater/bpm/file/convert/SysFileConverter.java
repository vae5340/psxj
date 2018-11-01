package com.augurit.awater.bpm.file.convert;

import com.augurit.awater.bpm.file.entity.SysFile;
import com.augurit.awater.bpm.file.entity.SysFileLink;
import com.augurit.awater.bpm.file.web.form.SysFileForm;
import com.augurit.awater.common.page.Page;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;


public class SysFileConverter {
    public SysFileConverter() {
    }

    public static void convert(SysFileForm form, SysFile entity) {
        if (form != null && entity != null) {
            entity.setSysFileId(form.getSysFileId());
            entity.setFileCode(form.getFileCode());
            entity.setFileName(form.getFileName());
            entity.setFileSize(form.getFileSize());
            entity.setFileType(form.getFileType());
            entity.setFilePath(form.getFilePath());
            entity.setFileFormat(form.getFileFormat());
            entity.setCmp(form.getCmp());
            entity.setCdt(form.getCdt());
            entity.setEemp(form.getEemp());
            entity.setEdt(form.getEdt());
            entity.setMemo1(form.getMemo1());
            entity.setMemo2(form.getMemo2());
        }

    }

    public static SysFileForm convertToForm(SysFile entity) {
        if (entity != null) {
            SysFileForm form = new SysFileForm();
            form.setSysFileId(entity.getSysFileId());
            form.setFileCode(entity.getFileCode());
            form.setFileName(entity.getFileName());
            form.setFileSize(entity.getFileSize());
            form.setFileType(entity.getFileType());
            form.setFilePath(entity.getFilePath());
            form.setFileFormat(entity.getFileFormat());
            form.setCmp(entity.getCmp());
            form.setCdt(entity.getCdt());
            form.setEemp(entity.getEemp());
            form.setEdt(entity.getEdt());
            form.setMemo1(entity.getMemo1());
            form.setMemo2(entity.getMemo2());
            return form;
        } else {
            return null;
        }
    }

    public static SysFileForm convertToForm(SysFileLink entity) {
        if (entity != null) {
            SysFileForm form = new SysFileForm();
            form.setSysFileId(entity.getSysFileId());
            form.setEntity(entity.getEntity());
            form.setEntityId(entity.getEntityId());
            return form;
        } else {
            return null;
        }
    }

    public static List<SysFileForm> convertToFormList(List<SysFile> list) {
        if (list != null && list.size() > 0) {
            List<SysFileForm> result = new ArrayList();
            Iterator var3 = list.iterator();

            while(var3.hasNext()) {
                SysFile entity = (SysFile)var3.next();
                SysFileForm form = convertToForm(entity);
                result.add(form);
            }

            return result;
        } else {
            return null;
        }
    }

    public static List<SysFileForm> convertToLinkFormList(List<SysFileLink> list) {
        if (list != null && list.size() > 0) {
            List<SysFileForm> result = new ArrayList();
            Iterator var3 = list.iterator();

            while(var3.hasNext()) {
                SysFileLink entity = (SysFileLink)var3.next();
                SysFileForm form = convertToForm(entity);
                result.add(form);
            }

            return result;
        } else {
            return null;
        }
    }

    public static List<SysFileForm> pageResultConvertToFormList(Page page) {
        List<SysFileForm> list = null;
        if (page != null && page.getResult() != null && page.getResult().size() > 0) {
            list = new ArrayList();
            List<Object[]> result = page.getResult();
            Iterator var4 = result.iterator();

            while(var4.hasNext()) {
                Object[] objs = (Object[])var4.next();
                SysFile entity = (SysFile)objs[0];
                SysFileForm form = convertToForm(entity);
                form.setEntity((String)objs[1]);
                form.setEntityId((String)objs[2]);
                list.add(form);
            }
        }

        return list;
    }

    public static String constructOrderBy(String orderProperty, String orderDirection) {
        String result = "";
        if (orderProperty != null && orderProperty.trim().length() > 0 && orderDirection != null && orderDirection.trim().length() > 0) {
            if (!orderProperty.equals("entity") && !orderProperty.equals("entityId")) {
                result = result + " order by file." + orderProperty + " " + orderDirection;
            } else {
                result = result + " order by link." + orderProperty + " " + orderDirection;
            }
        }

        return result;
    }
}
