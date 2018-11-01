package com.augurit.demo.service.impl;

import com.augurit.agcloud.bpm.front.service.impl.BpmBusAbstractServiceImpl;
import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.demo.domain.TestProblem;
import com.augurit.demo.mapper.TestProblemMapper;
import com.augurit.demo.service.TestProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.UUID;

@Transactional
@Service
public class TestProblemServiceImpl extends BpmBusAbstractServiceImpl<TestProblem> implements TestProblemService {
    @Autowired
    private TestProblemMapper testProblemMapper;

    @Override
    public void saveBusForm(TestProblem form) throws Exception {
        if(form!=null){
            form.setProblemId(UUID.randomUUID().toString());
            form.setCreater(SecurityContext.getCurrentUser().getUserName());
            form.setCreateTime(new Date());

            testProblemMapper.insertTestProblem(form);
        }
    }

    @Override
    public void updateBusForm(TestProblem form) throws Exception {
        if(form!=null){
            form.setModifier(SecurityContext.getCurrentUser().getUserName());
            form.setModifyTime(new Date());

            testProblemMapper.updateTestProblem(form);
        }
    }

    @Override
    public TestProblem getTestProblemById(String id) throws Exception {
        if(id!=null)
            return testProblemMapper.getTestProblemById(id);
        return null;
    }

    @Override
    public TestProblem getTestProblemByMasterKey(String masterEntityKey) throws Exception {
        return testProblemMapper.getTestProblemByMasterKey(masterEntityKey);
    }
}
