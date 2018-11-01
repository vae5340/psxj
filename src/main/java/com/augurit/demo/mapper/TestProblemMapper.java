package com.augurit.demo.mapper;
import com.augurit.demo.domain.TestProblem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
* 问题上报表-Mapper数据与持久化接口类
<ul>
    <li>项目名：奥格erp3.0--第一期建设项目</li>
    <li>版本信息：v1.0</li>
    <li>版权所有(C)2016广州奥格智能科技有限公司-版权所有</li>
    <li>创建人:Administrator</li>
    <li>创建时间：2018-07-02 10:48:52</li>
</ul>
*/
@Mapper
public interface TestProblemMapper {
    public void insertTestProblem(TestProblem testProblem) throws Exception;
    public void updateTestProblem(TestProblem testProblem) throws Exception;
    public void deleteTestProblem(@Param("id") String id) throws Exception;
    public List <TestProblem> listTestProblem(TestProblem testProblem) throws Exception;
    public TestProblem getTestProblemById(@Param("id") String id) throws Exception;
    public TestProblem getTestProblemByMasterKey(@Param("masterEntityKey") String masterEntityKey) throws Exception;

}
