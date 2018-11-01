package com.augurit.demo.service;

import com.augurit.agcloud.bpm.front.service.BpmBusAbstractService;
import com.augurit.demo.domain.TestProblem;

public interface TestProblemService extends BpmBusAbstractService<TestProblem> {
    public TestProblem getTestProblemById(String id) throws Exception;
    public TestProblem getTestProblemByMasterKey(String masterEntityKey) throws Exception;
}
