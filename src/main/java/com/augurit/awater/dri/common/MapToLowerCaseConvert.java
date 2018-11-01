package com.augurit.awater.dri.common;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MapToLowerCaseConvert {
	
	public static List<Map<String,Object>> MapToLowerCase(List<Map<String,Object>> list){
		
		List<Map<String, Object>> resultList = new ArrayList<Map<String,Object>>();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, Object> map = new HashMap<String, Object>();
		for (int i = 0; i < list.size(); i++) {
			map  =list.get(i);
			for (Map.Entry<String, Object> entry : map.entrySet()) {
				//System.out.println("key= " + entry.getKey() + " and value= " + entry.getValue());
				resultMap.put(entry.getKey().toLowerCase(), entry.getValue());
		    }
			 resultList.add(resultMap);
			 resultMap = new HashMap<String, Object>();
		}		
		return resultList;
	}
	
	public static Map<String,Object> MapToLowerCase(Map<String,Object> paramMap){		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		for (Map.Entry<String, Object> entry : paramMap.entrySet()) {
			//System.out.println("key= " + entry.getKey() + " and value= " + entry.getValue());
			resultMap.put(entry.getKey().toLowerCase(), entry.getValue());
	    }		
		return resultMap;
	}
	
	public static List<Map<String,Object>> MapToLowerCase2(List<Map<String,Object>> list){		
		List<Map<String, Object>> resultList = new ArrayList<Map<String,Object>>();
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, Object> map = new HashMap<String, Object>();
		String key = null;
		for (int i = 0; i < list.size(); i++) {
			map  =list.get(i);
			for (Map.Entry<String, Object> entry : map.entrySet()) {
				key = entry.getKey();
				if(key.equals("PID")){
					resultMap.put("pId", entry.getValue());
				}else{
					resultMap.put(key.toLowerCase(), entry.getValue());
				}
		    }
			 resultList.add(resultMap);
			 resultMap = new HashMap<String, Object>();
		}
		
		return resultList;
	}

	/**
	 * 把List<Map>中map的key转为驼峰命名字符串
	 * @param list
	 * @return
	 */
	public static List<Map<String,Object>> mapToCamelNameCase(List<Map<String,Object>> list){
		List<Map<String, Object>> resultList = new ArrayList<Map<String,Object>>();
		for(Map<String, Object> map : list) {
			Map<String, Object> resultMap = new HashMap<String, Object>();
			resultMap = mapToCamelNameCase(map);
			resultList.add(resultMap);
		}
		return resultList;
	}

	/**
	 * 把map的key转为驼峰命名字符串
	 * @param paramMap
	 * @return
	 */
	public static Map<String,Object> mapToCamelNameCase(Map<String,Object> paramMap){
		Map<String, Object> resultMap = new HashMap<String, Object>();
		for (Map.Entry<String, Object> entry : paramMap.entrySet()) {
			resultMap.put(camelName(entry.getKey()), entry.getValue());
		}
		return resultMap;
	}

	/**
	 * 将下划线命名的字符串转换为驼峰命名（小驼峰）字符串。
	 * 例如：HELLO_WORLD->helloWorld
	 * @param name 转换前的字符串
	 * @return 转换后的驼峰式命名的字符串
	 */
	public static String camelName(String name) {
		StringBuilder result = new StringBuilder();
		// 快速检查
		if (name == null || name.isEmpty()) {
			// 没必要转换
			return "";
		} else if (!name.contains("_")) {
			//不含下划线转为小写
			return name.toLowerCase();
		}
		// 用下划线将原始字符串分割
		String camels[] = name.split("_");
		for (String camel :  camels) {
			// 跳过原始字符串中开头、结尾的下换线或双重下划线
			if (camel.isEmpty()) {
				continue;
			}
			// 处理真正的驼峰片段
			if (result.length() == 0) {
				// 第一个驼峰片段，全部字母都小写
				result.append(camel.toLowerCase());
			} else {
				// 其他的驼峰片段，首字母大写
				char[] chars =camel.toLowerCase().toCharArray();
				chars[0]-=32;
				result.append(String.valueOf(chars));
//                result.append(camel.substring(0, 1).toUpperCase());
//                result.append(camel.substring(1).toLowerCase());
			}
		}
		return result.toString();
	}

}
