package com.augurit.demo.controller;

import com.augurit.agcloud.bpm.front.controller.BpmBusAbstractController;
import com.augurit.agcloud.bpm.front.domain.BpmProcessContext;
import com.augurit.agcloud.bpm.front.domain.BpmWorkFlowConfig;
import com.augurit.agcloud.framework.ui.result.ContentResultForm;
import com.augurit.agcloud.framework.ui.result.ResultForm;
import com.augurit.demo.domain.TestProblem;
import com.augurit.demo.service.TestProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping("/test/problem")
public class TestProblemController extends BpmBusAbstractController<TestProblem>{
    @Autowired
    private TestProblemService testProblemService;

    @RequestMapping("/testProblemIndex.do")
    public ModelAndView testProblemIndex() throws Exception{
        return new ModelAndView("/demo/testProblem/test_problem_index");
    }

    @RequestMapping("/testProIndex.do")
    public ModelAndView testProIndex() throws Exception{
        return new ModelAndView("/demo/testProblem/test_pro_index");
    }

    @RequestMapping("/workFlowBusSave.do")
    @Override
    public ResultForm workFlowBusSave(TestProblem form, BpmWorkFlowConfig workFlowConfig) throws Exception {
        BpmProcessContext processContext = super.workFlowBusSave(testProblemService,form,workFlowConfig);
        return new ContentResultForm(true,processContext);
    }

    @RequestMapping("/getTestProblemById.do")
    public TestProblem getTestProblemById(String id) throws Exception {
        if(id!=null)
            return testProblemService.getTestProblemById(id);
        return null;
    }


    @RequestMapping("/getTestProblemByMasterKey.do")
    public TestProblem getTestProblemByMasterKey(String masterEntityKey) throws Exception {
        if(masterEntityKey!=null)
            return testProblemService.getTestProblemByMasterKey(masterEntityKey);
        return null;
    }

    @RequestMapping("/saveTestProlem.do")
    public ResultForm saveTestProlem(TestProblem testProblem) throws Exception {
        if(testProblem!=null&&testProblem.getProblemId()!=null&&!"".equals(testProblem.getProblemId().trim())){
            testProblemService.updateBusForm(testProblem);
        }else{
            testProblemService.saveBusForm(testProblem);
        }
        return new ResultForm(true);
    }

}
