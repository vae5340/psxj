package com.augurit.awater.dri.rest.util.arcgis.timer;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.awater.dri.problem_report.correct_mark.service.ICorrectMarkService;
import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkForm;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkForm;
import com.augurit.awater.dri.rest.util.arcgis.form.DataFormToFeatureConvertor;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;


public class Synchronous {
	public static ICorrectMarkService correctMarkService=null;
	@Autowired
	public Synchronous(ICorrectMarkService correctMarkService){
		Synchronous.correctMarkService = correctMarkService;
	}
	
	/**
	 * 手动同步所属区域下的同步失败数据（一次查询纠错和上报）正在使用中PC
	 * @param userForm
	 * */
	public static String synNotAddFeature(OpuOmUser userForm) {
		synchronized (Synchronous.class) {
			JSONObject json = new JSONObject();
			List<Long> listIdsCorrect = new ArrayList<>();
			List<Long> listIdsLack = new ArrayList<>();
			if(userForm!=null && StringUtils.isNotBlank(userForm.getLoginName())){
				Map<String,String> map = correctMarkService.getFrom(userForm.getLoginName());
				if(map!=null&&map.containsKey("parentOrgName")){
					if(map.containsKey("top")){//市级用户
						listIdsCorrect = correctMarkService.getNotSyncForm("correct_mark",null,"2");
						listIdsLack = correctMarkService.getNotSyncForm("lack_mark", null,"2");
					}else{// 区级用户
						listIdsCorrect = correctMarkService.getNotSyncForm("correct_mark",map.get("parentOrgId"),"2");
						listIdsLack = correctMarkService.getNotSyncForm("lack_mark",map.get("parentOrgId"),"2");
					}
					int count=0;
					if(listIdsCorrect!=null && listIdsCorrect.size()>0){
						count+=listIdsCorrect.size();
						for(Object id: listIdsCorrect){
							CorrectMarkForm corr = correctMarkService.get(Long.parseLong(id.toString()));
							if(corr != null && "2".equals(corr.getIsAddFeature())){
								corr.setIsAddFeature("0"); //表示正在同步中
								correctMarkService.save(corr);
								//添加到队列中
								Boolean flag = SynchronousData.addFeature(DataFormToFeatureConvertor.convertCorrVoToForm(corr));
								if(!flag){// 添加队列失败
									corr.setIsAddFeature("2");  //同步失败
									correctMarkService.save(corr);
								}
							}
						}
					}
					if(listIdsLack!=null && listIdsLack.size()>0){
						count+=listIdsLack.size();
						for(Object id: listIdsLack){
							LackMarkForm lack = correctMarkService.getLackForm(Long.parseLong(id.toString()));
							if(lack != null && "2".equals(lack.getIsAddFeature())){
								lack.setIsAddFeature("0"); //表示正在同步中
								correctMarkService.save(lack);
								//添加到队列中
								Boolean flag = SynchronousData.addFeature(DataFormToFeatureConvertor.convertLackVoToForm(lack));
								if(!flag){// 添加队列失败
									lack.setIsAddFeature("2");//同步失败
									correctMarkService.save(lack);
								}
							}
						}
					}
					json.put("success", true);
					json.put("message", "正在同步"+count+"条数据...请稍后刷新");
				}
			}else{
				json.put("success", false);
				json.put("message", "同步失败,参数错误!");
			}
			return json.toString();
		}
	}
	
}
