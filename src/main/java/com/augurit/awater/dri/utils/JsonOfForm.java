package com.augurit.awater.dri.utils;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.io.StringReader;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.*;
import java.util.*;
import java.util.Date;

import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import net.sf.json.JSONArray;

import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.stream.JsonReader;
import org.springframework.beans.BeanUtils;

public class JsonOfForm {

	public static Object jsonVoForm(String json, Class clazz) {
		Object form = null;
		try {
			form = new Object();
			Gson gson = new Gson();
			JsonReader jsonRead = new JsonReader(new StringReader(json));
			jsonRead.setLenient(true);
			form = gson.toJson(json, clazz);
		} catch (JsonParseException e) {
			e.printStackTrace();
			return form;
		}
		return form;
	}

	/**
	 * 来自移动端的参数
	 *
	 * @param json 要封装的实体对象(时间是时间戳,要先转成Long类型 )
	 */
	public static Object paramsTofromApp(JSONObject json, Class clazz) {
		try {
			// 实例
			Object obj = clazz.newInstance();
			if (json == null || json.size() < 1) {
				return obj;
			}
			Set<String> params = json.keySet();//遍历json中的key
			//得到字段
			Field[] field = clazz.getDeclaredFields();
			for (Field f : field) {
				String name = f.getName();
				for (String nams : params) {
					if (!json.get(nams).equals("null") && StringUtils.isNotBlank(json.get(nams).toString())) {
						if (name.equals(nams)) {
							Object[] paramsValue = new Object[1];
							if (f.getType().equals(Long.class)) {
								paramsValue[0] = Long.parseLong(json.get(name).toString());
							}
							if (f.getType().equals(Double.class)) {
								paramsValue[0] = Double.parseDouble(json.get(name).toString());
							}
							if (f.getType().equals(Integer.class)) {
								paramsValue[0] = Integer.parseInt(json.get(name).toString());
							}
							if (f.getType().equals(String.class)) {
								paramsValue[0] = String.valueOf(json.get(name));
							}
							if (f.getType().equals(Date.class)) {
								Long time = null;
								if (json.get(name).toString().length() > 11)
									time = Long.parseLong((json.get(name).toString()));
								else
									time = Long.parseLong((json.get(name).toString())) * 1000;
								paramsValue[0] = new Date(time);
							}
							StringBuffer buffer = new StringBuffer("set");
							buffer.append(name.substring(0, 1).toUpperCase());
							buffer.append(name.substring(1));
							//Class[] paramsType = {f.getType()};
							//set方法
							Method method = clazz.getDeclaredMethod(buffer.toString(), f.getType());
							method.invoke(obj, paramsValue);
						}
					}
				}
			}
			return obj;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 来自移动端的参数
	 *
	 * @param jsonArry 要封装的实体对象(时间是时间戳,要先转成Long类型 )
	 */
	public static Object paramsToListApp(JSONArray jsonArry, Class clazz) throws Exception, IllegalAccessException {
		List<Object> list = new ArrayList<>();
		for (Object objs : jsonArry) {
			net.sf.json.JSONObject json = net.sf.json.JSONObject.fromObject(objs);
			// 实例
			Object obj = clazz.newInstance();
			if (json != null || json.size() > 1) {
				Set<String> params = json.keySet();
				//得到字段
				Field[] field = clazz.getDeclaredFields();
				for (Field f : field) {
					String name = f.getName();
					for (String nams : params) {
						if (!json.get(nams).equals("null") && json.get(nams) != null) {
							if (name.equals(nams)) {
								Object[] paramsValue = new Object[1];
								if (f.getType().equals(Long.class)) {
									paramsValue[0] = new Long(json.get(name).toString());
								}
								if (f.getType().equals(Double.class)) {
									paramsValue[0] = Double.parseDouble(json.get(name).toString());
								}
								if (f.getType().equals(Integer.class)) {
									paramsValue[0] = Integer.parseInt(json.get(name).toString());
								}
								if (f.getType().equals(String.class)) {
									paramsValue[0] = String.valueOf(json.get(name));
								}
								if (f.getType().equals(Date.class)) {
									Long time = null;
									if (json.get(name).toString().length() > 11)
										time = Long.parseLong((json.get(name).toString()));
									else
										time = Long.parseLong((json.get(name).toString())) * 1000;
									paramsValue[0] = new Date(time);
								}
								StringBuffer buffer = new StringBuffer("set");
								buffer.append(name.substring(0, 1).toUpperCase());
								buffer.append(name.substring(1));
								//Class[] paramsType = {f.getType()};
								//set方法
								Method method = clazz.getDeclaredMethod(buffer.toString(), f.getType());
								method.invoke(obj, paramsValue);
							}
						}
					}
				}
				list.add(obj);
			}
		}
		return list;
	}


	public static Object mapToForm(Map<String, Object> json, Class clazz) {
		try {
			// 实例
			Object obj = clazz.newInstance();
			if (json == null || json.size() < 1) {
				return obj;
			}
			Set<String> params = json.keySet();
			//得到字段
			Field[] field = clazz.getDeclaredFields();
			for (Field f : field) {
				String name = f.getName();
				for (String keyName : params) {
					String keyNameLower = keyName.toLowerCase();
					String[] nas = keyNameLower.split("_");
					String nams = nas[0];
					if (nas.length > 1) {
						for (int i = 1; i < nas.length; i++) {
							nams += nas[i].substring(0, 1).toUpperCase() + nas[i].substring(1);
						}
					}

					if (json.get(keyName) != null && !json.get(keyName).equals("null") && StringUtils.isNotBlank(json.get(keyName).toString())) {
						if (name.equals(nams)) {
							Object[] paramsValue = new Object[1];
							if (f.getType().equals(Long.class)) {
								paramsValue[0] = Long.parseLong(json.get(keyName).toString());
							}
							if (f.getType().equals(Double.class)) {
								paramsValue[0] = Double.parseDouble(json.get(keyName).toString());
							}
							if (f.getType().equals(Integer.class)) {
								paramsValue[0] = Integer.parseInt(json.get(keyName).toString());
							}
							if (f.getType().equals(String.class)) {
								paramsValue[0] = String.valueOf(json.get(keyName));
							}
							if (f.getType().equals(Date.class)) {
								Long time = null;
								if (json.get(keyName).getClass().equals(Timestamp.class)) {
									time = ((Timestamp) json.get(keyName)).getTime();
								} else if (json.get(keyName).toString().length() > 11)
									time = Long.parseLong((json.get(keyName).toString()));
								else
									time = Long.parseLong((json.get(keyName).toString())) * 1000;
								paramsValue[0] = new Date(time);
							}
							if (f.getType().equals(java.sql.Date.class)) {
								Long time = null;
								if (json.get(keyName).getClass().equals(java.sql.Date.class)) {
									time = ((Timestamp) json.get(keyName)).getTime();
								} else if (json.get(keyName).toString().length() > 11)
									time = Long.parseLong((json.get(keyName).toString()));
								else
									time = Long.parseLong((json.get(keyName).toString())) * 1000;
								paramsValue[0] = new java.sql.Date(time);
							}
							if (f.getType().equals(Timestamp.class)) {
								Long time = null;
								if (json.get(keyName).getClass().equals(Timestamp.class)) {
									time = ((Timestamp) json.get(keyName)).getTime();
								} else if (json.get(keyName).toString().length() > 11)
									time = Long.parseLong((json.get(keyName).toString()));
								else
									time = Long.parseLong((json.get(keyName).toString())) * 1000;
								paramsValue[0] = new Timestamp(time);
							}
							StringBuffer buffer = new StringBuffer("set");
							buffer.append(name.substring(0, 1).toUpperCase());
							buffer.append(name.substring(1));
							//Class[] paramsType = {f.getType()};
							//set方法
							Method method = clazz.getDeclaredMethod(buffer.toString(), f.getType());
							method.invoke(obj, paramsValue);
						}
					}
				}
			}
			return obj;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static Object listMapToForm(List<Map<String, Object>> listMap, Class clazz) {
		List<Object> list = new ArrayList<>();
		try {
			for (Map<String, Object> json : listMap) {
				// 实例
				Object obj = clazz.newInstance();
				if (json == null || json.size() < 1) {
					return null;
				}
				Set<String> params = json.keySet();
				//得到字段
				Field[] field = clazz.getDeclaredFields();
				for (Field f : field) {
					String name = f.getName();
					for (String keyName : params) {
						String keyNameLower = keyName.toLowerCase();
						String[] nas = keyNameLower.split("_");
						String nams = nas[0];
						if (nas.length > 1) {
							for (int i = 1; i < nas.length; i++) {
								nams += nas[i].substring(0, 1).toUpperCase() + nas[i].substring(1);
							}
						}

						if (json.get(keyName) != null && !json.get(keyName).equals("null") && StringUtils.isNotBlank(json.get(keyName).toString())) {
							if (name.equals(nams)) {
								Object[] paramsValue = new Object[1];
								if (f.getType().equals(Long.class)) {
									paramsValue[0] = Long.parseLong(json.get(keyName).toString());
								}
								if (f.getType().equals(Double.class)) {
									paramsValue[0] = Double.parseDouble(json.get(keyName).toString());
								}
								if (f.getType().equals(Integer.class)) {
									paramsValue[0] = Integer.parseInt(json.get(keyName).toString());
								}
								if (f.getType().equals(String.class)) {
									paramsValue[0] = String.valueOf(json.get(keyName));
								}
								if (f.getType().equals(Date.class)) {
									Long time = null;
									if (json.get(keyName).getClass().equals(Timestamp.class)) {
										time = ((Timestamp) json.get(keyName)).getTime();
									} else if (json.get(keyName).toString().length() > 11)
										time = Long.parseLong((json.get(keyName).toString()));
									else
										time = Long.parseLong((json.get(keyName).toString())) * 1000;
									paramsValue[0] = new Date(time);
								}
								if (f.getType().equals(java.sql.Date.class)) {
									Long time = null;
									if (json.get(keyName).getClass().equals(java.sql.Date.class)) {
										time = ((Timestamp) json.get(keyName)).getTime();
									} else if (json.get(keyName).toString().length() > 11)
										time = Long.parseLong((json.get(keyName).toString()));
									else
										time = Long.parseLong((json.get(keyName).toString())) * 1000;
									paramsValue[0] = new java.sql.Date(time);
								}
								if (f.getType().equals(Timestamp.class)) {
									Long time = null;
									if (json.get(keyName).getClass().equals(Timestamp.class)) {
										time = ((Timestamp) json.get(keyName)).getTime();
									} else if (json.get(keyName).toString().length() > 11)
										time = Long.parseLong((json.get(keyName).toString()));
									else
										time = Long.parseLong((json.get(keyName).toString())) * 1000;
									paramsValue[0] = new Timestamp(time);
								}
								StringBuffer buffer = new StringBuffer("set");
								buffer.append(name.substring(0, 1).toUpperCase());
								buffer.append(name.substring(1));
								//Class[] paramsType = {f.getType()};
								//set方法
								Method method = clazz.getDeclaredMethod(buffer.toString(), f.getType());
								method.invoke(obj, paramsValue);
							}
						}
					}
				}
				list.add(obj);
			}
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 实体类转成Map对象
	 * */
	public static Map<String, Object> convertBeanToMap(Object bean) throws InvocationTargetException, IllegalAccessException, IntrospectionException {
		Class type = bean.getClass();
	 	Map<String, Object> returnMap = new HashMap<String, Object>();
		BeanInfo beanInfo = Introspector.getBeanInfo(type);
	 	PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
	 	for (int i = 0; i < propertyDescriptors.length; i++) {
	 		PropertyDescriptor descriptor = propertyDescriptors[i];
	 		String propertyName = descriptor.getName();
	 		if (!propertyName.equals("class")) {
			 	Method readMethod = descriptor.getReadMethod();
		 		Object result = readMethod.invoke(bean, new Object[0]);
				if (result != null) {
					returnMap.put(propertyName, result);
				} else {
					returnMap.put(propertyName, "");
				}
	 		}
	 	}
	 	return returnMap;
	}
	public static List<Map<String, Object>> convertBeansToMap(List<Object> beans) throws InvocationTargetException, IllegalAccessException, IntrospectionException {
		if(beans!=null && beans.size()>0){
			List<Map<String, Object>> list = new ArrayList<>();
			for(Object bean : beans){
				Class type = bean.getClass();
				Map<String, Object> returnMap = new HashMap<String, Object>();
				BeanInfo beanInfo = Introspector.getBeanInfo(type);
				PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
				for (int i = 0; i < propertyDescriptors.length; i++) {
					PropertyDescriptor descriptor = propertyDescriptors[i];
					String propertyName = descriptor.getName();
					if (!propertyName.equals("class")) {
						Method readMethod = descriptor.getReadMethod();
						Object result = readMethod.invoke(bean, new Object[0]);
						if (result != null) {
							returnMap.put(propertyName, result);
						} else {
							returnMap.put(propertyName, "");
						}
					}
				}
				list.add(returnMap);
			}
			return list;
		}
		return null;
	}

	public static void main(String[] args) {
		Map<String,Object> map = new HashMap<>();
		map.put("ORG_CODE","YYYTTT");
		map.put("ORG_NAME","test");
		map.put("ORG_ID","dsadsdasdas");
		OpuOmOrg org = (OpuOmOrg)mapToForm(map, OpuOmOrg.class);
		System.out.println(org.getOrgId());
	}

}
