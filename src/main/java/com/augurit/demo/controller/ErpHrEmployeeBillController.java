package com.augurit.demo.controller;

import com.augurit.agcloud.bpm.front.controller.BpmBusAbstractController;
import com.augurit.agcloud.bpm.front.domain.BpmProcessContext;
import com.augurit.agcloud.bpm.front.domain.BpmWorkFlowConfig;
import com.augurit.agcloud.framework.ui.result.ContentResultForm;
import com.augurit.agcloud.framework.ui.result.ResultForm;
import com.augurit.demo.domain.ErpHrEmployeeBill;
import com.augurit.demo.service.ErpHrEmployeeBillService;
import com.augurit.agcloud.framework.security.SecurityContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

/**
* -Controller 页面控制转发类
<ul>
    <li>项目名：奥格erp3.0--第一期建设项目</li>
    <li>版本信息：v1.0</li>
    <li>版权所有(C)2016广州奥格智能科技有限公司-版权所有</li>
    <li>创建人:Administrator</li>
    <li>创建时间：2018-04-27 10:26:25</li>
</ul>
*/
@RestController
@RequestMapping("/erp/hr/employee/bill")
public class ErpHrEmployeeBillController extends BpmBusAbstractController<ErpHrEmployeeBill> {
    private static Logger logger = LoggerFactory.getLogger(ErpHrEmployeeBillController.class);

    @Autowired
    private ErpHrEmployeeBillService erpHrEmployeeBillService;

   @RequestMapping("/qingjiaFormIndex.do")
    public ModelAndView qingjiaFormIndex(ModelMap modelMap){
        modelMap.put("currUserName", SecurityContext.getCurrentUser().getUserName());

        return new ModelAndView("/demo/qingjia/qingjia_index");
    }



    @RequestMapping("getEmployee.do")
    public ErpHrEmployeeBill getEmployee(String id) throws Exception {
        return erpHrEmployeeBillService.getErpHrEmployeeBillById(id);
    }

    @RequestMapping("/workFlowBusSave.do")
    @Override
    public ResultForm workFlowBusSave(ErpHrEmployeeBill form, BpmWorkFlowConfig bpmWorkFlowConfig) throws Exception {//String procdefKey, String taskId, String appProcdefId,String processInstanceId
        BpmProcessContext processContext = super.workFlowBusSave(erpHrEmployeeBillService,form,bpmWorkFlowConfig);
        return new ContentResultForm(true,processContext);
    }
}
