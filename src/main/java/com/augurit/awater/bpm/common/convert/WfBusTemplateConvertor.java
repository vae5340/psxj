package com.augurit.awater.bpm.common.convert;


import com.augurit.awater.bpm.common.entity.WfBusTemplate;
import com.augurit.awater.bpm.common.form.WfBusTemplateForm;
import java.util.ArrayList;
import java.util.List;

public class WfBusTemplateConvertor {
    public WfBusTemplateConvertor() {
    }

    public static WfBusTemplateForm convertVoToForm(WfBusTemplate entity) {
        if (entity != null) {
            WfBusTemplateForm form = new WfBusTemplateForm();
            form.setId(entity.getId());
            form.setTemplateCode(entity.getTemplateCode());
            form.setTemplateName(entity.getTemplateName());
            form.setWfDefKey(entity.getWfDefKey());
            form.setWfDefVersion(entity.getWfDefVersion());
            form.setIsActive(entity.getIsActive());
            form.setCreator(entity.getCreator());
            form.setCreateTime(entity.getCreateTime());
            form.setUpdator(entity.getUpdator());
            form.setUpdateTime(entity.getUpdateTime());
            form.setMemo(entity.getMemo());
            form.setTemplateTypeId(entity.getTemplateTypeId());
            form.setMasterEntity(entity.getMasterEntity());
            form.setSlaveEntities(entity.getSlaveEntities());
            form.setSortNo(entity.getSortNo());
            String templateShortName = entity.getTemplateName();
            if (templateShortName != null && templateShortName.length() > 8) {
                templateShortName = entity.getTemplateName().substring(0, 8) + "...";
            }

            form.setTemplateShortName(templateShortName);
            return form;
        } else {
            return null;
        }
    }

    public static void convertFormToVo(WfBusTemplateForm form, WfBusTemplate entity) {
        if (entity != null && form != null) {
            entity.setId(form.getId());
            if (form.getTemplateCode() != null && form.getTemplateCode().trim().length() > 0) {
                entity.setTemplateCode(form.getTemplateCode().trim());
            }

            if (form.getTemplateName() != null && form.getTemplateName().trim().length() > 0) {
                entity.setTemplateName(form.getTemplateName().trim());
            }

            if (form.getWfDefKey() != null && form.getWfDefKey().trim().length() > 0) {
                entity.setWfDefKey(form.getWfDefKey().trim());
            }

            if (form.getWfDefVersion() != null) {
                entity.setWfDefVersion(form.getWfDefVersion());
            }

            if (form.getIsActive() != null && form.getIsActive().trim().length() > 0) {
                entity.setIsActive(form.getIsActive().trim());
            }

            if (form.getMemo() != null && form.getMemo().trim().length() > 0) {
                entity.setMemo(form.getMemo().trim());
            }

            if (form.getTemplateTypeId() != null) {
                entity.setTemplateTypeId(form.getTemplateTypeId());
            }

            if (form.getMasterEntity() != null) {
                entity.setMasterEntity(form.getMasterEntity().trim());
            }

            if (form.getSlaveEntities() != null) {
                entity.setSlaveEntities(form.getSlaveEntities().trim());
            }

            if (form.getCreator() != null && form.getCreator().trim().length() > 0) {
                entity.setCreator(form.getCreator().trim());
            }

            if (form.getCreateTime() != null) {
                entity.setCreateTime(form.getCreateTime());
            }

            if (form.getUpdator() != null && form.getUpdator().trim().length() > 0) {
                entity.setUpdator(form.getUpdator().trim());
            }

            if (form.getUpdateTime() != null) {
                entity.setUpdateTime(form.getUpdateTime());
            }

            entity.setSortNo(form.getSortNo());
        }

    }

    public static List<WfBusTemplateForm> convertVoListToFormList(List<WfBusTemplate> wfBusTemplateList) {
        if (wfBusTemplateList != null && wfBusTemplateList.size() > 0) {
            List<WfBusTemplateForm> wfBusTemplateFormList = new ArrayList();

            for(int i = 0; i < wfBusTemplateList.size(); ++i) {
                wfBusTemplateFormList.add(convertVoToForm((WfBusTemplate)wfBusTemplateList.get(i)));
            }

            return wfBusTemplateFormList;
        } else {
            return null;
        }
    }

    public static List<WfBusTemplate> convertFormListToVoList(List<WfBusTemplateForm> wfBusTemplateFormList) {
        if (wfBusTemplateFormList != null && wfBusTemplateFormList.size() > 0) {
            List<WfBusTemplate> wfBusTemplateList = new ArrayList();

            for(int i = 0; i < wfBusTemplateFormList.size(); ++i) {
                WfBusTemplate wfBusTemplate = new WfBusTemplate();
                convertFormToVo((WfBusTemplateForm)wfBusTemplateFormList.get(i), wfBusTemplate);
                wfBusTemplateList.add(wfBusTemplate);
            }

            return wfBusTemplateList;
        } else {
            return null;
        }
    }

    public static List<WfBusTemplateForm> convertTo(List<Object[]> result) {
        if (result != null && result.size() > 0) {
            List<WfBusTemplateForm> wfBusTemplateFormList = new ArrayList();

            for(int i = 0; i < result.size(); ++i) {
                Object[] objs = (Object[])result.get(i);
                WfBusTemplateForm form = convertVoToForm((WfBusTemplate)objs[0]);
                form.setTemplateTypeName((String)objs[1]);
                wfBusTemplateFormList.add(form);
            }

            return wfBusTemplateFormList;
        } else {
            return null;
        }
    }

//    public static List<BasicCombo> convertToBasicCombo(List<WfBusTemplateForm> tempList) {
//        List<BasicCombo> result = new ArrayList();
//        if (tempList != null && tempList.size() > 0) {
//            Iterator var3 = tempList.iterator();
//
//            while(var3.hasNext()) {
//                WfBusTemplateForm form = (WfBusTemplateForm)var3.next();
//                BasicCombo combo = new BasicCombo();
//                combo.setLabel(form.getTemplateName());
//                combo.setValue(form.getTemplateName());
//                result.add(combo);
//            }
//        }
//
//        return result;
//    }
}
