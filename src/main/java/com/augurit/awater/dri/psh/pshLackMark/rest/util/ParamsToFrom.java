package com.augurit.awater.dri.psh.pshLackMark.rest.util;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import com.augurit.awater.dri.problem_report.correct_mark.web.form.CorrectMarkForm;
import com.augurit.awater.dri.problem_report.diary.web.form.DiaryForm;
import com.augurit.awater.dri.problem_report.lack_mark.web.form.LackMarkForm;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.Thumbnails.Builder;


public class ParamsToFrom {
	
	/**
	 * 来自移动端的参数
	 * @param request 请求包含请求参数
	 * */
	public static Object paramsTofromApp(HttpServletRequest request,Class clazz) throws Exception, IllegalAccessException{
		// 实例
		Object obj=clazz.newInstance();
		Map<String,String[]> map = request.getParameterMap();
		if(map==null||map.size()<1){
			return obj;
		}
		Set<String> params = map.keySet();
		//得到字段
		Field[] field = clazz.getDeclaredFields();
		for(Field f : field){
			String name = f.getName();
			for(String nams : params){
				if(name.equals(nams)){
					Object[] paramsValue = new Object[1];
					if(f.getType().equals(Long.class)){
						paramsValue[0]=new Long(map.get(name)[0]);
					}
					if(f.getType().equals(Double.class)){
						paramsValue[0]= Double.parseDouble(map.get(name)[0]);
					}
					if(f.getType().equals(Integer.class)){
						paramsValue[0]=Integer.parseInt(map.get(name)[0]);		
					}
					if(f.getType().equals(String.class)){
						paramsValue[0]=map.get(name)[0];
					}
					if(f.getType().equals(Date.class)){
						Long time=null;
						if(map.get(name)[0].length()>11)
							time = Long.parseLong((map.get(name)[0]));
						else
							time = Long.parseLong((map.get(name)[0]))*1000;
						paramsValue[0]=new Date(time);
					}
					StringBuffer buffer = new StringBuffer("set");
					buffer.append(name.substring(0,1).toUpperCase());
					buffer.append(name.substring(1));
					//Class[] paramsType = {f.getType()};
					//set方法
					Method method = clazz.getDeclaredMethod(buffer.toString(), f.getType());
					method.invoke(obj, paramsValue);
				}
			}
		}
		return obj;
	}
	/**
	 * @param request 请求包含请求参数
	 * */
	public static Object paramsTofrom(HttpServletRequest request,Class clazz) throws Exception, IllegalAccessException{
		Map<String,String[]> map = request.getParameterMap();
		Set<String> params = map.keySet();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		// 实例
		Object obj=clazz.newInstance();
		//得到字段
		Field[] field = clazz.getDeclaredFields();
		for(Field f : field){
			String name = f.getName();
			for(String nams : params){
				if(name.equals(nams)){
					Object[] paramsValue = new Object[1];
					if(f.getType().equals(Long.class)){
						paramsValue[0]=new Long(map.get(name)[0]);
					}
					if(f.getType().equals(Double.class)){
						paramsValue[0]= Double.parseDouble(map.get(name)[0]);
					}
					if(f.getType().equals(Integer.class)){
						paramsValue[0]=Integer.parseInt(map.get(name)[0]);		
					}
					if(f.getType().equals(String.class)){
						paramsValue[0]=map.get(name)[0];
					}
					if(f.getType().equals(Date.class)){
						paramsValue[0]=format.parse(map.get(name)[0]);
					}
					StringBuffer buffer = new StringBuffer("set");
					buffer.append(name.substring(0,1).toUpperCase());
					buffer.append(name.substring(1));
					//Class[] paramsType = {f.getType()};
					//set方法
					Method method = clazz.getDeclaredMethod(buffer.toString(), f.getType());
					method.invoke(obj, paramsValue);
				}
			}
		}
		return obj;
	}
	
	/***************************************排序方法****************************************/
	/**
	 * 是否保存缩略图
	 * return boolean
	 * */
	public static Boolean toThumbnail(String filePath,String thumbnailsUrl){
		Builder<File> builder=null;
		try {
			builder= Thumbnails.of(filePath);
			builder.scale(0.4f).toFile(thumbnailsUrl);
			return true;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}finally{
			if(builder!=null){
				builder=null;
			}
		}
	}
	
	/**
	 * CorrectMarkForm和LackMarkForm的集合对象转成Map集合对象
	 * @return List<Map> list
	 * */
	public static List<Map> correctAndLackToMap(
			List<CorrectMarkForm> listCorr, List<LackMarkForm> listLack) {
		List<Map> listMap = new ArrayList<>();
		if(listCorr != null && listCorr.size()>0){
			for(CorrectMarkForm form : listCorr){
				Map map = new HashMap();
				map.put("id", form.getId());
				map.put("markPersonId", form.getMarkPersonId());
				map.put("time", form.getMarkTime());
				map.put("updateTime", form.getUpdateTime());
				map.put("layerName", form.getLayerName());
				map.put("correctType", form.getCorrectType());
				map.put("parentOrgName", form.getParentOrgName());
				map.put("addr", form.getAddr());
				map.put("source", "correct");
				listMap.add(map);
			}
		}
		if(listLack !=null && listLack.size()>0){
			for(LackMarkForm lack : listLack){
				Map map = new HashMap();
				map.put("id", lack.getId());
				map.put("markPersonId", lack.getMarkPersonId());
				map.put("time", lack.getMarkTime());
				map.put("updateTime", lack.getUpdateTime());
				map.put("layerName", lack.getComponentType());
				map.put("parentOrgName", lack.getParentOrgName());
				map.put("addr", lack.getAddr());
				map.put("source", "lack");
				listMap.add(map);
			}
		}
		Collections.sort(listMap, ageComparatorTime);
		return listMap;
	} 
	/*******************************************************************************/
	/**
	 * List<Map<String,Object>>集合时间倒序
	 * */
	public static List<Map> getListMapDescMarkTime(List<Map> list){
		Collections.sort(list, ageComparatorMarkTime);
		return list;
	}
	/**
	 * List<Map<String,Object>>集合时间倒序
	 * */
	public static List<Map> getListMapDesc(List<Map> list){
		Collections.sort(list, ageComparatorTime);
		return list;
	}
	/**
	 * List<Map<String,Object>>集合时间倒序
	 * */
	public static List<Map<String, Object>> getListDesc(List<Map<String, Object>> list){
		Collections.sort(list, ageComparatorTime);
		return list;
	}
	
	/**
 	 * List<Map<String,Object>>集合时间排序
 	 * @param markTime(Long)
 	 * */
 	 public static Comparator ageComparatorMarkTime = new Comparator() {  
		@Override
		public int compare(Object o1, Object o2) {
			Map<String, Object> m1 = (Map<String, Object>) o1;
			Map<String, Object> m2 = (Map<String, Object>) o2;
			if(m1.get("markTime") == null) return 1;
			if(m2.get("markTime") == null) return 1;
			return ( (Long)(m1.get("markTime")) > (Long)m2.get("markTime") ? -1 :  
          	  ((Long)(m1.get("markTime")) ==(Long)(m2.get("markTime")) ? 0 : 1));  
		}  
      };  
	 /**
 	 * List<Map<String,Object>>集合时间排序
 	 * @param time(Long)
 	 * */
 	 public static Comparator ageComparatorTime = new Comparator() {  
		@Override
		public int compare(Object o1, Object o2) {
			Map<String, Object> m1 = (Map<String, Object>) o1;
			Map<String, Object> m2 = (Map<String, Object>) o2;
			if(m1.get("time") == null) return 1;
			if(m2.get("time") == null) return 1;
			return ( (Long)(m1.get("time")) > (Long)m2.get("time") ? -1 :  
          	  ((Long)(m1.get("time")) ==(Long)(m2.get("time")) ? 0 : 1));  
		}  
      };  
     /**
 	 * List<Map<String,Object>>集合时间排序
 	 * @param time(Date)
 	 * */
 	 public static Comparator ageComparator = new Comparator() {  
		@Override
		public int compare(Object o1, Object o2) {
			Map<String, Object> m1 = (Map<String, Object>) o1;
			Map<String, Object> m2 = (Map<String, Object>) o2;
			return ( ((Date)m1.get("time")).getTime() > ((Date)m2.get("time")).getTime() ? -1 :  
          	  (((Date)m1.get("time")).getTime() ==((Date)m2.get("time")).getTime() ? 0 : 1));  
		}  
      };  
      
      /**
  	 * 无序的List集合转成倒序
  	 * @param list 集合对象
  	 * */
  	@SuppressWarnings("unchecked")
  	public static List<DiaryForm> formOfDesc(List<DiaryForm>list, String time){
  		Collections.sort(list, ageComparatorMap);
  		return list;
  	} 
  	
  	/**
  	 * List集合时间排序
  	 * */
  	 public static Comparator ageComparatorMap = new Comparator() {  
           @Override  
          public int compare(Object o1, Object o2) {  
               return ( (((DiaryForm) o1).getRecordTime()).getTime() < (((DiaryForm) o2).getRecordTime()).getTime() ? -1 :  
               ((((DiaryForm) o1).getRecordTime()).getTime() ==(((DiaryForm) o2).getRecordTime()).getTime() ? 0 : 1));  
          }  
       };
}
