package  com.augurit.awater.util;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MapUtil {
    public static Map<String, Object> objectToMap(Object obj) throws IllegalAccessException {
        if(obj == null){
            return null;
        }

        Map<String, Object> map = new HashMap<String, Object>();

        Field[] declaredFields = obj.getClass().getDeclaredFields();
        for (Field field : declaredFields) {
            field.setAccessible(true);
            map.put(field.getName(), field.get(obj));
        }

        return map;
    }
    public static List<Map<String,Object>> MapToLowerCase(List<Map<String,Object>> list){

        List<Map<String, Object>> resultList = new ArrayList<Map<String,Object>>();
        Map<String, Object> resultMap = new HashMap<String, Object>();
        Map<String, Object> map = new HashMap<String, Object>();
        for (int i = 0; i < list.size(); i++) {
            map  =list.get(i);
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                //System.out.println("key= " + entry.getKey() + " and value= " + entry.getValue());
                resultMap.put(((String)entry.getKey()).toLowerCase(), entry.getValue());
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
            resultMap.put(((String)entry.getKey()).toLowerCase(), entry.getValue());
        }
        return resultMap;
    }
}
