package com.augurit.demo.mapper;

import com.augurit.demo.domain.ErpHrEmployeeBill;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
* -Mapper数据与持久化接口类
<ul>
    <li>项目名：奥格erp3.0--第一期建设项目</li>
    <li>版本信息：v1.0</li>
    <li>版权所有(C)2016广州奥格智能科技有限公司-版权所有</li>
    <li>创建人:Administrator</li>
    <li>创建时间：2018-04-27 10:26:25</li>
</ul>
*/
@Mapper
public interface ErpHrEmployeeBillMapper {
    public void insertErpHrEmployeeBill(ErpHrEmployeeBill erpHrEmployeeBill) throws Exception;
    public void updateErpHrEmployeeBill(ErpHrEmployeeBill erpHrEmployeeBill) throws Exception;
    public void deleteErpHrEmployeeBill(@Param("id") String id) throws Exception;
    public List <ErpHrEmployeeBill> listErpHrEmployeeBill(ErpHrEmployeeBill erpHrEmployeeBill) throws Exception;
    public ErpHrEmployeeBill getErpHrEmployeeBillById(@Param("id") String id) throws Exception;
}
