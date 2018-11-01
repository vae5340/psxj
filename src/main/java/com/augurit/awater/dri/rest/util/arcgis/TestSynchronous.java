package com.augurit.awater.dri.rest.util.arcgis;

import java.util.List;
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
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 测试类
 * */
public class TestSynchronous {
	 //队列大小  
    private static final int QUEUE_LENGTH_TEST = 100000*10;  
    //基于内存的阻塞队列  
    private static BlockingQueue<FeatureForm> queue = new LinkedBlockingQueue<FeatureForm>(QUEUE_LENGTH_TEST);
    
    //创建保存计划任务执行器  
    private static ScheduledExecutorService esecute = Executors.newScheduledThreadPool(5);  
    public static Boolean flag_add=false;
    
    //创建保存计划任务执行器  
    public static ScheduledExecutorService addEsecute = Executors.newScheduledThreadPool(1);  
    private static Boolean flag=false;
	
    public static ICorrectMarkService correctMarkService=null;
	@Autowired
	public TestSynchronous(ICorrectMarkService correctMarkService){
		TestSynchronous.correctMarkService = correctMarkService;
		if(flag==false){
			execute();
		}else if(addEsecute.isTerminated()){
			execute();
		}else if(addEsecute.isShutdown()){
			execute();
		}
		
		if(flag_add==false){
			addExecute();
		}
	}
	
	private static void addExecute(){
		flag_add=true;
    	esecute.scheduleWithFixedDelay(new Runnable() {
			@Override
			public void run() {
				try {
					//如果没有数据，则会阻塞线程
					FeatureForm takse =  queue.take();
					takse.setCheck_state("1");//默认未审核
					String features = DataFormToFeatureConvertor.convertFeatureToJson(takse);
					Boolean flags = false;
					if(StringUtils.isNotBlank(features)){
						String result = httpArcgisClient.addFeature(features);
						if(!"500".equals(result) && !"300".equals(result)){
							JSONObject json = JSONObject.fromObject(result);
							if(json.containsKey("objectId")){
								takse.setCheck_state("1");
								takse.setObjectid(Long.parseLong(json.getString("objectId")));
								flags = correctMarkService.featureToSaveForm(takse);
							}
						}
					}
					if(!flags){
						//同步失败（标记isAddFeature）需要手动同步
						Boolean fa = correctMarkService.updateFeatureToForm(takse,"3");
						if(!fa) addFeature(takse);
					}
				} catch (InterruptedException e) {
					e.printStackTrace();//线程中断
					flag_add=false;
				}
			}
		}, 0, 1, TimeUnit.MICROSECONDS);
	}
	
	/**
	 * 执行队列(移动端删除队列)
	 * */
	private static void execute(){
		flag=true;
		addEsecute.scheduleWithFixedDelay(new Runnable() {
			@Override
			public void run() {
				List<Long> listIdsCorrect = correctMarkService.getNotSyncForm("DRI_PS_CORRECT_MARK",null,"2");
				List<Long> listIdsLack = correctMarkService.getNotSyncForm("DRI_PS_LACK_MARK", null,"2");
				for(Long corr_id : listIdsCorrect){
					CorrectMarkForm corrForm = correctMarkService.get(corr_id);
					FeatureForm feature = DataFormToFeatureConvertor.convertCorrVoToForm(corrForm);
					if(TestSynchronous.addFeature(feature)){
						corrForm.setIsAddFeature("0");
					}else{
						corrForm.setIsAddFeature("2");
					}
					correctMarkService.save(corrForm);
				}
				for(Long lack_id : listIdsLack){
					LackMarkForm lackForm = correctMarkService.getLackForm(lack_id);
					FeatureForm feature = DataFormToFeatureConvertor.convertLackVoToForm(lackForm);
					if(TestSynchronous.addFeature(feature)){
						lackForm.setIsAddFeature("0");
					}else{
						lackForm.setIsAddFeature("2");
					}
					correctMarkService.save(lackForm);
				}
				if((listIdsCorrect==null || listIdsCorrect.size()==0) || (listIdsLack==null||listIdsLack.size()==0)){
					System.out.println("同步成功!");
				}
			}
		}, 0, 1, TimeUnit.MINUTES);//分钟
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
	public static int getFeature(){
		return queue.size();
	}
	
}
