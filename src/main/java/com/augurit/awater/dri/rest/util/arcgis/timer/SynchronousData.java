package com.augurit.awater.dri.rest.util.arcgis.timer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkForm;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkForm;
import com.augurit.awater.dri.rest.util.arcgis.form.DataFormToFeatureConvertor;
import com.augurit.awater.dri.rest.util.arcgis.form.FeatureForm;
import com.augurit.awater.dri.rest.util.arcgis.form.FeatureParamsForm;
import com.augurit.awater.dri.rest.util.arcgis.httpArcgisClient;
import com.augurit.awater.dri.rest.util.arcgis.listener.WebContextListenerArcgis;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;


/**
 * 上报信息新增图层功能类
 * @author hows
 * */
public class SynchronousData {
	protected static Logger log = LoggerFactory.getLogger(SynchronousData.class);

	 //队列大小  
    private static final int QUEUE_LENGTH = 100000*10;  
    //基于内存的阻塞队列  
    private static BlockingQueue<FeatureForm> queue = new LinkedBlockingQueue<FeatureForm>(QUEUE_LENGTH);
    //创建保存计划任务执行器  
    private static ScheduledExecutorService esecute = null;  
    public static Boolean flag=false;
	
	public static ICorrectMarkService correctMarkService=null;
	@Autowired
	public SynchronousData(ICorrectMarkService correctMarkService){
		SynchronousData.correctMarkService = correctMarkService;
	}
	
	/**
	 * 执行队列
	 * */
	private final static Runnable RunQueue = new Runnable() {
		@Override
		public void run() {
			try {
				//如果没有数据，则会阻塞线程
				FeatureForm takse =  queue.take();
				String features = DataFormToFeatureConvertor.convertFeatureToJson(takse);
				Boolean flags = false;
				if(StringUtils.isNotBlank(features)){
					String result = httpArcgisClient.addFeature(features);
					if(!"500".equals(result) && !"300".equals(result)){
						JSONObject json = JSONObject.fromObject(result);
						if(json.containsKey("objectId")){
							takse.setObjectid(Long.parseLong(json.getString("objectId")));
							flags = correctMarkService.featureToSaveForm(takse);
						}
					}
				}
				if(!flags){
					//同步失败（标记isAddFeature）需要手动同步
					Boolean fa = correctMarkService.updateFeatureToForm(takse,"2");
					if(!fa) addFeature(takse);
				}
			} catch (InterruptedException e) {
				e.printStackTrace();//线程中断
				flag=false;
			}
		}
	};
	/**
	 * 启动
	 * */
	public static void start(){
		if(esecute==null){
			esecute = Executors.newScheduledThreadPool(3);
			synchronized(esecute){
				flag=true;
				esecute.scheduleWithFixedDelay(RunQueue, 0, 1, TimeUnit.MICROSECONDS);
				log.info("启动上报定时器任务成功!");
			}
		}
    }
	/**
	 * 停止定时器
	 * */
	public static void stop(){
		if(esecute!=null){
			synchronized(esecute){
				if(esecute!=null && !esecute.isShutdown()){
					esecute.shutdown();
					try {
						Boolean fa = esecute.awaitTermination(5, TimeUnit.SECONDS);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}finally{
						esecute=null;
					}
					log.info("关闭上报定时器任务成功!");
				}
			}
		}
	}
	/**
	 * 重启定时器
	 * */
	public static void restart(){
		stop();
		start();
	}
	/**
	 * 添加数据到队列中
	 * */
	public static Boolean addFeature(FeatureForm form){
		if(form!=null){
			return queue.offer(form);
		}else{
			return false;
		}
	}
	/**
	 * 添加数据到队列中
	 * */
	public static Boolean addFeatureList(List<FeatureForm> listForm){
		if(listForm!=null && listForm.size()>0){
			try {
				queue.addAll(listForm);
				return true;
			} catch (Exception e) {
				e.printStackTrace();
				return false;
			}
		}else{
			return false;
		}
	}
	
	/**
	 * 查看队列的详细信息（当前队列长度剩余长度等）
	 * */
	public static Map getQueueView(){
		Map map = new HashMap();
		map.put("currentLength", queue.size());
		map.put("remaingLength", queue.remainingCapacity());
		map.put("total", QUEUE_LENGTH);
		return map;
	}
	/**
	 * 得到队列中的所有数据
	 * */
	public static Object[] getAll(){
		JSONObject json = new JSONObject();
		Object[] list = queue.toArray();
		return list;
	}
	
	/**
	 * 修改（bs端修改操作）
	 **/
	public static Boolean updateFeature(FeatureForm form){
		synchronized(SynchronousData.class){
			form.setCheck_type("2");// bs端审核默认为2
			String features = DataFormToFeatureConvertor.convertFeatureToJson(form);
			Boolean flag = false;
			if(StringUtils.isNotBlank(features)){
				String result = httpArcgisClient.updateFeature(features);
				if(!"500".equals(result) && !"300".equals(result)){
					JSONObject json = JSONObject.fromObject(result);
					if(json.containsKey("success") && json.get("success").equals(true)){
						flag= true;
					}
				}
			}
			return flag;
		}
	}
	/**
	 * isAddFeature=0
	 * 定时执行同步图层失败的操作(不需要时刻启动)
	 * */
	public static void syncFeature() {
		synchronized(SynchronousData.class){
			if(correctMarkService!=null){
				int ii=0;
				//查询正在同步中的数据，有时候不正常重启tomcat就会发生这种情况
				//查询如果有已同步的数据但是数据库的标记没有更新那就更新数据库的objectid
				List<Long> corrList =correctMarkService.getNotSyncForm("DRI_PS_CORRECT_MARK",null,"0");
				List<Long> lackList =correctMarkService.getNotSyncForm("DRI_PS_LACK_MARK",null,"0");
				try {
					dataSyncfeature("correct",corrList);
				} catch (Exception e) {
					e.printStackTrace();
					log.error("correct同步失败！");
				}
				try {
					dataSyncfeature("lack",lackList);
				} catch (Exception e) {
					e.printStackTrace();
					log.error("lack同步失败！");
				}

			}
		}
	}
	/**
	 * isAddFeature=0
	 * 定时执行同步图层失败的操作(不需要时刻启动)
	 * */
	public static void syncNoAddFeature() {
		synchronized(SynchronousData.class){
			if(correctMarkService!=null){
				int ii=0;
				//查询正在同步中的数据，有时候不正常重启tomcat就会发生这种情况
				//查询如果有已同步的数据但是数据库的标记没有更新那就更新数据库的objectid
				List<Long> corrList =correctMarkService.getNotSyncForm("DRI_PS_CORRECT_MARK",null,"2");
				List<Long> lackList =correctMarkService.getNotSyncForm("DRI_PS_LACK_MARK",null,"2");
				try {
					dataSyncfeature("correct",corrList);
				} catch (Exception e) {
					e.printStackTrace();
					log.error("correct同步失败！");
				}
				try {
					dataSyncfeature("lack",lackList);
				} catch (Exception e) {
					e.printStackTrace();
					log.error("lack同步失败！");
				}

			}
		}
	}
	/**
	 * 同步数据库和图层失败数据
	 * */
	private static void dataSyncfeature(String reportType,List<Long> list) throws Exception {
		FeatureParamsForm params = new FeatureParamsForm();
		Map<Long,Long> map = new HashMap<>();
		StringBuffer where =new StringBuffer("1=1 and mark_id in (");
		if(list!=null && list.size()>0) {
			where.append(StringUtils.join(list.toArray(new Long[list.size()]),","));
			where.append(")");
			if("lack".equals(reportType)){
				where.append("and report_type='confirm'");
			}else if("correct".equals(reportType)){
				where.append("and report_type='modify'");
			}else{
				throw new Exception("reportType参数错误");
			}
			params.setWhere(where.toString());
			params.setOutFields("OBJECTID,MARK_ID");
			try {
				Map<String,Object> paramsMap = DataFormToFeatureConvertor.convertBeanToMap(params);
				String result = httpArcgisClient.query(paramsMap);
				if(!"300".equals(result) && !"500".equals(result)){
					JSONArray jsonArray = JSONObject.fromObject(result).getJSONArray("features");
					for(int i=0;i<jsonArray.size();i++){
						JSONObject json = jsonArray.getJSONObject(i);
						Long markId = json.getJSONObject("attributes").getLong("MARK_ID");
						Long objectId = json.getJSONObject("attributes").getLong("OBJECTID");
						map.put(markId,objectId);
					}
					int ii=0;
					if("correct".equals(reportType)){
						for(int i=0;i<list.size();i++) {
							Long key = list.get(i);
							if (map.containsKey(key)) {
								CorrectMarkForm corrForm = correctMarkService.get(key);
								corrForm.setObjectId(map.get(key).toString());
								corrForm.setIsAddFeature("1");
								correctMarkService.save(corrForm);
							} else {
								CorrectMarkForm form = correctMarkService.get(key);
								if (form != null && form.getObjectId() == null) {
									FeatureForm feature = DataFormToFeatureConvertor.convertCorrVoToForm(form);
									Boolean flags = addFeature(feature);
									if (flags) ii++;
									log.info("新增了" + ii + "条数据!");
								}
							}
						}
					}else  if("lack".equals(reportType)){
						for(int i=0;i<list.size();i++) {
							Long key = list.get(i);
							if (map.containsKey(key)) {
								LackMarkForm lackForm = correctMarkService.getLackForm(key);
								lackForm.setObjectId(map.get(key).toString());
								lackForm.setIsAddFeature("1");
								correctMarkService.save(lackForm);
							} else {
								LackMarkForm form = correctMarkService.getLackForm(key);
								if (form != null && form.getObjectId() == null) {
									FeatureForm feature = DataFormToFeatureConvertor.convertLackVoToForm(form);
									Boolean flags = addFeature(feature);
									if (flags) ii++;
									log.info("新增了" + ii + "条数据!");
								}
							}
						}
					}

				}else{ //说明没有同步到图层中
					int i=0;
					if("correct".equals(reportType)){
						for (Long id : list) {
							CorrectMarkForm form = correctMarkService.get(id);
							if(form!=null){
								FeatureForm feature = DataFormToFeatureConvertor.convertCorrVoToForm(form);
								Boolean flags =  addFeature(feature);
								if(flags) i++;
							}
						}
						log.info("新增了"+i+"条数据!");
					}else  if("lack".equals(reportType)){
						for (Long id : list) {
							LackMarkForm form = correctMarkService.getLackForm(id);
							if(form!=null){
								FeatureForm feature = DataFormToFeatureConvertor.convertLackVoToForm(form);
								Boolean flags =  addFeature(feature);
								if(flags) i++;
							}
						}
						log.info("新增了"+i+"条数据!");
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				log.info("同步失败!");
			}
		}

	}
}
