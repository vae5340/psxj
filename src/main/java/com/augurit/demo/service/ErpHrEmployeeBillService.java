package com.augurit.demo.service;

import com.augurit.agcloud.bpm.front.service.BpmBusAbstractService;
import com.augurit.demo.domain.ErpHrEmployeeBill;

/**
* -Service服务调用接口类
<ul>
    <li>项目名：奥格erp3.0--第一期建设项目</li>
    <li>版本信息：v1.0</li>
    <li>版权所有(C)2016广州奥格智能科技有限公司-版权所有</li>
    <li>创建人:Administrator</li>
    <li>创建时间：2018-04-27 10:26:25</li>
</ul>
*/
public interface ErpHrEmployeeBillService extends BpmBusAbstractService<ErpHrEmployeeBill> {
    public ErpHrEmployeeBill getErpHrEmployeeBillById(String id) throws Exception;
}
