package com.augurit.awater.dri.utils;

import org.apache.commons.lang3.StringUtils;

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



public class ParamsToFrom {
	
	/**
	 * @param request 请求包含请求参数cc
	 * @return  要封装的实体对象(时间是时间戳,要先转成Long类型 )
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
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for(Field f : field){
			String name = f.getName();
			for(String nams : params){
				if(name.equals(nams)){
					Object[] paramsValue = new Object[1];
					if(f.getType().equals(Long.class)){

						String namestr = map.get(name)[0].toString();
						paramsValue[0]= Long.valueOf(    StringUtils.isNoneBlank(namestr)?map.get(name)[0]:"0"    );
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
						if(map.get(name)[0].length()==10)
							time = Long.parseLong((map.get(name)[0]));
						else if(map.get(name)[0].length()==13)
							time = Long.parseLong((map.get(name)[0]));
						else
                            format.parse((map.get(name)[0]).toString());
						paramsValue[0]=new Date(time);
					}
					StringBuffer buffer = new StringBuffer("set");
					buffer.append(name.substring(0,1).toUpperCase());
					buffer.append(name.substring(1));
					Method method = clazz.getDeclaredMethod(buffer.toString(), f.getType());
					method.invoke(obj, paramsValue);
				}
			}
		}
		return obj;
	}
	/**
	 * @param request 请求包含请求参数
	 * @return  要封装的实体对象
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
						Long time=null;
						if(map.get(name)[0].contains("-")){
							if(map.get(name)[0].length()==10)
								time = format.parse((map.get(name)[0]).toString() + " 00:00:00").getTime();
							else
								time = format.parse((map.get(name)[0]).toString()).getTime();
						}else{
							if(map.get(name)[0].length()==10)
								time = Long.parseLong((map.get(name)[0]));
							else if(map.get(name)[0].length()==13)
								time = Long.parseLong((map.get(name)[0]));
						}
						if(time!=null)
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
	
}
