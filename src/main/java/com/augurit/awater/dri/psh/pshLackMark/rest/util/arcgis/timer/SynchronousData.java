package com.augurit.awater.dri.psh.pshLackMark.rest.util.arcgis.timer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.augurit.awater.dri.psh.pshLackMark.rest.util.arcgis.form.DataFormToFeatureConvertor;
import com.augurit.awater.dri.psh.pshLackMark.rest.util.arcgis.form.FeatureForm;
import com.augurit.awater.dri.psh.pshLackMark.rest.util.arcgis.httpArcgisClient;
import com.augurit.awater.dri.psh.pshLackMark.service.IPshCorrectMarkService;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;


/**
 * 上报信息新增图层功能类
 * @author hows
 * */
public class SynchronousData {
	 //队列大小  
    private static final int QUEUE_LENGTH = 100000*10;  
    //基于内存的阻塞队列  
    private static BlockingQueue<FeatureForm> queue = new LinkedBlockingQueue<FeatureForm>(QUEUE_LENGTH);
    //创建保存计划任务执行器  
    private static ScheduledExecutorService esecute = null;  
    public static Boolean flag=false;
	
	public static IPshCorrectMarkService correctMarkService=null;
	@Autowired
	public SynchronousData(IPshCorrectMarkService correctMarkService){
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
						if((boolean) json.get("success")){
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
				System.out.println("启动上报定时器任务成功!");
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
}
