package com.augurit.awater.dri.rest.util.arcgis.timer;

import com.augurit.awater.dri.problem_report.check_record.service.IReportDeleteService;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import org.springframework.beans.factory.annotation.Autowired;
/*
 * 测试类
 * */
public class TimerReportData {

	@Autowired
	private ICorrectMarkService correctMarkService;
	@Autowired
	private IReportDeleteService reportDeleteService;

	
	public void run() {
		System.out.println("开始定时清理上报数据删除修改操作....................");
		if(SynchronousDeleteData.reportDeleteService==null) new SynchronousDeleteData(reportDeleteService);
		if(SynchronousUpdateData.correctMarkService==null ) new SynchronousUpdateData(correctMarkService);
		SynchronousDeleteData.deleteFeature();
		SynchronousUpdateData.updateFeature();
	}
	
}
