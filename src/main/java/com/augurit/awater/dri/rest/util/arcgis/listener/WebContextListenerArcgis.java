package com.augurit.awater.dri.rest.util.arcgis.listener;

/**
 * 监听项目启动初始化队列类
 * */

import com.augurit.awater.dri.problem_report.check_record.service.IReportDeleteService;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import com.augurit.awater.dri.rest.util.arcgis.timer.SynchronousData;
import com.augurit.awater.dri.rest.util.arcgis.timer.SynchronousDeleteData;
import com.augurit.awater.dri.rest.util.arcgis.timer.SynchronousUpdateData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;


@Component
public class WebContextListenerArcgis implements ApplicationListener<ContextRefreshedEvent>{
	protected Logger log = LoggerFactory.getLogger(WebContextListenerArcgis.class);

	private ICorrectMarkService correctMarkService;
	private IReportDeleteService reportDeleteService;
	private SynchronousData saAdd=null;
	private SynchronousUpdateData saUpdate=null;
	private SynchronousDeleteData saDelete=null;

	/*@Override
	public void contextDestroyed(ServletContextEvent sce) {
		//停止
		if(saAdd!=null)
			saAdd.stop();
		if(saUpdate!=null)
			saAdd.stop();
		if(saDelete!=null)
			saAdd.stop();
	}*/

	@Override
	public void onApplicationEvent(ContextRefreshedEvent event) {
		log.info("启动巡检队列任务.......");
		correctMarkService = event.getApplicationContext().getBean(ICorrectMarkService.class);
		reportDeleteService = event.getApplicationContext().getBean(IReportDeleteService.class);
		//开启上报定时
		saAdd = new SynchronousData(correctMarkService);
		saAdd.start();
		saUpdate = new SynchronousUpdateData(correctMarkService);
		saUpdate.start();
		saDelete=new SynchronousDeleteData(reportDeleteService);
		saDelete.start();
		//项目启动时清理一次数据库数据
		FeatureThread thread= new FeatureThread();
		thread.start();
		log.info("启动巡检队列成功.......");
	}

}
