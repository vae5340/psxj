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
import com.augurit.awater.dri.rest.util.arcgis.httpArcgisClient;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 移动端修改操作图层类
 * @author hows
 * */
public class SynchronousUpdateData {
	 //队列大小  
    private static final int QUEUE_LENGTH_UPDATE = 100000*10;  
    //基于内存的阻塞队列  
    private static BlockingQueue<FeatureForm> queue = new LinkedBlockingQueue<FeatureForm>(QUEUE_LENGTH_UPDATE);
    //创建修改计划任务执行器  
    private static ScheduledExecutorService updateEsecute = null;  
    private static Boolean flagUpdate=false;
	
	public static ICorrectMarkService correctMarkService=null;
	@Autowired
	public SynchronousUpdateData(ICorrectMarkService correctMarkService){
		SynchronousUpdateData.correctMarkService = correctMarkService;
	}
	
	
	/**
	 * 执行队列
	 * */
	private final static Runnable RunUpdateQueue = new Runnable() {
		@Override
		public void run() {
			try {
				//如果没有数据，则会阻塞线程
				FeatureForm takse =  queue.take();
				String features = DataFormToFeatureConvertor.convertFeatureToJson(takse);
				//修改数据需要修改审核状态
				Boolean flags = false;
				if(StringUtils.isNotBlank(features)){
					//在更新之前判断是否可以审核
					String result = httpArcgisClient.updateFeature(features);
					System.out.println(result);
					if(!"500".equals(result) && !"300".equals(result)){
						JSONObject json = JSONObject.fromObject(result);
						if(json.containsKey("success")){
							flags=true;
							correctMarkService.updateFeatureVoToForm(takse,"1");//更新成功标记为1（2是同步失败3是更新失败）
						}
					}
				}
				try {
					if(!flags){
						//修改失败（标记isAddFeature）需要定时器定时循环
						Boolean fa = correctMarkService.updateFeatureToForm(takse,"3");
						if(!fa) addFeature(takse);
					}
				} catch (Exception e) {
					addFeature(takse);
					e.printStackTrace();
				}
			} catch (InterruptedException e) {
				e.printStackTrace();//线程中断
				flagUpdate=false;
			}
		}
	};
	/**
	 * 执行队列(移动端修改队列)
	 * */
	public static void start(){
		if(updateEsecute==null){
			updateEsecute = Executors.newScheduledThreadPool(3);
			synchronized(updateEsecute){
				flagUpdate=true;
				updateEsecute.scheduleWithFixedDelay(RunUpdateQueue, 0, 1, TimeUnit.MICROSECONDS);
				System.out.println("启动修改上报定时器任务成功!");
			}
		}
    }
	/**
	 * 停止定时器
	 * */
	public static void stop(){
		if(updateEsecute!=null){
			synchronized(updateEsecute){
				if(updateEsecute!=null && !updateEsecute.isShutdown()){
					updateEsecute.shutdown();
					try {
						Boolean fa = updateEsecute.awaitTermination(5, TimeUnit.SECONDS);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}finally{
						updateEsecute=null;
					}
					System.out.println("关闭上报定时器任务成功!");
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
	 * 查看队列的详细信息（当前队列长度剩余长度等）
	 * */
	public static Map getQueueView(){
		Map map = new HashMap();
		map.put("currentLength", queue.size());
		map.put("remaingLength", queue.remainingCapacity());
		map.put("total", QUEUE_LENGTH_UPDATE);
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
	 * 定时执行update图层操作()
	 **/
	public static void updateFeature(){
		synchronized(SynchronousUpdateData.class){
			List<Long> listCorr =correctMarkService.getNotSyncForm("correct_mark",null,"3");
			List<Long> listLack = correctMarkService.getNotSyncForm("lack_mark",null,"3");
			int i=0;
			if(listCorr!=null && listCorr.size()>0){
				for(Long id : listCorr){
					CorrectMarkForm corrForm = correctMarkService.get(id);
					if(corrForm!=null){
						FeatureForm feature = DataFormToFeatureConvertor.convertCorrVoToForm(corrForm);
						Boolean flags =  addFeature(feature);
						if(flags) i++;
					}
				}
			}
			if(listLack!=null && listLack.size()>0){
				for(Long id : listLack){
					LackMarkForm lackForm =  correctMarkService.getLackForm(id);
					if(lackForm!=null){
						FeatureForm feature = DataFormToFeatureConvertor.convertLackVoToForm(lackForm);
						Boolean flags =  addFeature(feature);
						if(flags) i++;
					}
				}
			}
			System.out.println("更新了"+i+"条数据!");
			
		}
	}
	
	
	public void updateData(){
		List<Long> listCorr =correctMarkService.getNotSyncForm("correct_mark",null,"3");
		int i=0;
		if(listCorr!=null && listCorr.size()>0){
			for(int k=0;k<listCorr.size();k++){
				Object o = (Object)listCorr.get(k);
				Long ids = Long.parseLong(o.toString());
				CorrectMarkForm corrForm = correctMarkService.get(ids);
				FeatureForm feature = DataFormToFeatureConvertor.convertCorrVoToForm(corrForm);
				Boolean flags =  addFeature(feature);
			}
		}
		List<Long> listLack = correctMarkService.getNotSyncForm("lack_mark",null,"3");
		for(int k=0;k<listLack.size();k++){
			Object o = (Object)listLack.get(k);
			Long ids=null;
			try {
				ids = Long.parseLong(o.toString());
			} catch (NumberFormatException e) {
				e.printStackTrace();
			}
			if(ids!=null){
				LackMarkForm lackForm =  correctMarkService.getLackForm(ids);
				FeatureForm feature = DataFormToFeatureConvertor.convertLackVoToForm(lackForm);
				Boolean flags = addFeature(feature);
			}
		}
	}
	public static int getFeature(){
		return queue.size();
	}

	//修改图层（巡检日志使用）
	public static Boolean updateFeature(String feature){
		synchronized (SynchronousUpdateData.class){
			//修改数据需要修改审核状态
			Boolean flags = false;
			if(StringUtils.isNotBlank(feature)) {
				//在更新之前判断是否可以审核
				String result = httpArcgisClient.updateFeature(feature);
				if (!"500".equals(result) && !"300".equals(result)) {
					JSONObject json = JSONObject.fromObject(result);
					if (json.containsKey("success")) {
						flags = true;
					}
				}
			}
			return flags;
		}
	}
	
}
