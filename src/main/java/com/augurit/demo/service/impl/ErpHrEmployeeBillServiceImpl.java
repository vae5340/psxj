package com.augurit.demo.service.impl;

import com.augurit.agcloud.bpm.front.domain.BpmProcessContext;
import com.augurit.agcloud.bpm.front.service.impl.BpmBusAbstractServiceImpl;
import com.augurit.agcloud.framework.ui.result.ContentResultForm;
import com.augurit.demo.domain.ErpHrEmployeeBill;
import com.augurit.demo.mapper.ErpHrEmployeeBillMapper;
import com.augurit.demo.service.ErpHrEmployeeBillService;
import com.augurit.agcloud.framework.security.SecurityContext;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
* -Service服务接口实现类
<ul>
    <li>项目名：奥格erp3.0--第一期建设项目</li>
    <li>版本信息：v1.0</li>
    <li>版权所有(C)2016广州奥格智能科技有限公司-版权所有</li>
    <li>创建人:Administrator</li>
    <li>创建时间：2018-04-27 10:26:25</li>
</ul>
*/
@Service
@Transactional
public class ErpHrEmployeeBillServiceImpl extends BpmBusAbstractServiceImpl<ErpHrEmployeeBill> implements ErpHrEmployeeBillService {

    private static Logger logger = LoggerFactory.getLogger(ErpHrEmployeeBillServiceImpl.class);

    @Autowired
    private ErpHrEmployeeBillMapper erpHrEmployeeBillMapper;

    @Override
    public void saveBusForm(ErpHrEmployeeBill form) throws Exception {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        if(form.getBillId()==null||"".equals(form.getBillId()))
            form.setBillId(UUID.randomUUID().toString());

        form.setIsDeleted("0");
        form.setBillCreateDate(new Date());
        form.setOrgId(SecurityContext.getCurrentOrgId());
        form.setUserLoginName(SecurityContext.getOpusLoginUser().getUser().getLoginName());

        if(StringUtils.isNotBlank(form.getBillStartDateStr())){
            form.setBillStartDate(simpleDateFormat.parse(form.getBillStartDateStr()));
        }
        if(StringUtils.isNotBlank(form.getBillEndDateStr())){
            form.setBillEndDate(simpleDateFormat.parse(form.getBillEndDateStr()));
        }

        erpHrEmployeeBillMapper.insertErpHrEmployeeBill(form);
    }

    @Override
    public void updateBusForm(ErpHrEmployeeBill form) throws Exception {
        erpHrEmployeeBillMapper.updateErpHrEmployeeBill(form);
    }

    @Override
    public ErpHrEmployeeBill getErpHrEmployeeBillById(String id) throws Exception {
        if(id!=null){
            ErpHrEmployeeBill bill = erpHrEmployeeBillMapper.getErpHrEmployeeBillById(id);

            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            if(bill.getBillStartDate()!=null){
                bill.setBillStartDateStr(simpleDateFormat.format(bill.getBillStartDate()));
            }
            if(bill.getBillEndDate()!=null){
                bill.setBillEndDateStr(simpleDateFormat.format(bill.getBillEndDate()));
            }

            return bill;
        }
        return null;
    }
}

