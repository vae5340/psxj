package com.augurit.awater.util.data;

import com.augurit.awater.util.DateUtils;
import org.apache.commons.lang3.StringUtils;

import java.io.BufferedReader;
import java.lang.reflect.Field;
import java.sql.Clob;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 常用类型转换
 *
 * @author cannel
 */
public class DataConvert {

    /**XX转Str------------------------------------*/

    /**
     * object转String，无法转换返回""
     *
     * @param value
     * @return
     */
    public static String objToStr(Object value) {
        return value != null ? value.toString() : "";
    }

    /**
     * Date按固定格式转String，无法转换返回""
     *
     * @param value
     * @param format
     * @return
     */
    public static String dateToStr(Date value, String format) {
        return value != null ? DateUtils.dateTimeToString(value, format) : "";
    }

    /**
     * Double转String , 如果传入null则返回""
     */
    public static String douToStr(Double value) {
        if (value == null) {
            return "";
        } else {
            return value.toString();
        }
    }

    /**
     * Integer转String , 如果传入null则返回""
     */
    public static String integerToStr(Integer value) {
        if (value == null) {
            return "";
        } else {
            return value.toString();
        }
    }

    /**
     * Long转String , 如果传入null则返回""
     */
    public static String longToStr(Long value) {
        if (value == null) {
            return "";
        } else {
            return value.toString();
        }
    }

    /**obj转XX------------------------------*/

    /**
     * Object转double，无法转换返回0
     *
     * @param value
     * @return
     */
    public static double objToDou(Object value) {
        double result = 0;

        if (value != null) {
            String str = value.toString();
            try {
                result = Double.parseDouble(str);
            } catch (Exception e) {

            }
        }

        return result;
    }

    /**
     * 真实值为doubel的object，转string，不能转换返回空字符串
     *
     * @param value
     * @return
     */
    public static String objDouToStr(Object value) {
        return objDouToStr(value, null);
    }

    /**
     * 真实值为doubel的object，转string，不能转换返回空字符串
     *
     * @param value
     * @param format
     * @return
     */
    public static String objDouToStr(Object value, String format) {
        String result = "";

        if (value != null) {
            Double dou = null;
            String str = value.toString();
            try {
                dou = Double.parseDouble(str);
            } catch (Exception e) {

            }
            if (dou != null) {
                if (StringUtils.isEmpty(format)) {
                    result = dou.toString();
                } else {
                    DecimalFormat df = new DecimalFormat(format);
                    result = df.format(dou);
                }
            }
        }

        return result;
    }

    /**
     * object转Long，无法转换返回0
     *
     * @param value
     * @return
     */
    public static Long objToLong(Object value) {
        Long result = 0l;

        if (value != null) {
            String str = value.toString();
            try {
                result = Long.parseLong(str);
            } catch (Exception e) {

            }
        }

        return result;
    }

    /**
     * obj转Integer，无法转换返回null
     */
    public static Integer objToInteger(Object obj) {
        String strObj = objToStr(obj);
        Integer result = null;
        try {
            result = Integer.parseInt(strObj);
        } catch (Exception e) {
        }
        return result;
    }

    /**
     * Clob字段的object转string
     *
     * @param value
     * @return
     * @throws Exception
     */
    public static String objClobToStr(Object value) throws Exception {
        Clob clob = (Clob) value;
        String objv = "";
        BufferedReader cb = new BufferedReader(clob.getCharacterStream());
        String str = "";
        while ((str = cb.readLine()) != null) {
            objv = objv.concat(str); // 最后以String的形式得到
        }

        return objv;
    }

    /**str转XX------------------------------*/

    /**
     * string转double，无法转换返回0
     *
     * @param value
     * @return
     */
    public static double strToDou(String value) {
        double result = 0;

        try {
            result = Double.parseDouble(value);
        } catch (Exception e) {

        }

        return result;
    }

    /**
     * string转double，无法转换返回0
     *
     * @param value
     * @return
     */
    public static Double strToDouble(String value) {
        Double result = (double) 0;

        try {
            result = Double.parseDouble(value);
        } catch (Exception e) {

        }

        return result;
    }

    /**
     * string转Double，无法转换返回null
     *
     * @param value
     * @return
     */
    public static Double strToDouNull(String value) {
        Double result = null;

        try {
            result = Double.parseDouble(value);
        } catch (Exception e) {

        }

        return result;
    }

    /**
     * string转Long，无法转换返回0
     *
     * @param value
     * @return
     */
    public static Long strToLong(String value) {
        Long result = (long) 0;

        try {
            result = Long.parseLong(value);
        } catch (Exception e) {

        }

        return result;
    }

    /**
     * string转Long，无法转换返回null
     *
     * @param value
     * @return
     */
    public static Long strToLongNull(String value) {
        Long result = null;

        try {
            result = Long.parseLong(value);
        } catch (Exception e) {

        }

        return result;
    }

    /**
     * string转int，无法转换返回0
     *
     * @param value
     * @return
     */
    public static int strToInt(String value) {
        int result = 0;

        try {
            result = Integer.parseInt(value);
        } catch (Exception e) {

        }

        return result;
    }

    /**
     * string转Integer，无法转换返回null
     *
     * @param value
     * @return
     */
    public static Integer strToIntegerNull(String value) {
        Integer result = null;

        try {
            result = Integer.parseInt(value);
        } catch (Exception e) {

        }

        return result;
    }

    /**
     * string转Date，无法转换返回null
     *
     * @param value
     * @return
     */
    public static Date strToDate(String value) {
        return strToDate(value, "yyyy-MM-dd");
    }

    /**
     * string转Date，无法转换返回null
     *
     * @param value
     * @param format
     * @return
     */
    public static Date strToDate(String value, String format) {
        Date result = null;

        try {
            result = DateUtils.stringToDate(value, format);
        } catch (Exception e) {

        }

        return result;
    }

    /**
     * string转string，如果传入null则返回空字符串""
     */
    public static String strToStr(String value) {
        if (value != null)
            return value;
        else
            return "";
    }

    /**XX对象类型转XX值类型，例如Double转double---------------------------*/

    /**
     * Double转double , 如果传入null则返回0
     */
    public static double douNullToDou(Double value) {
        double result = 0;
        if (value == null) {
            return result;
        } else {
            result = value;
            return result;
        }
    }

    /**
     * Integer转int , 如果传入null则返回0
     */
    public static int intNullToInt(Integer value) {
        int result = 0;
        if (value == null) {
            return result;
        } else {
            result = value;
            return result;
        }
    }

    /**
     * Long转long , 如果传入null则返回0
     */
    public static long longNullToLong(Long value) {
        long result = 0;
        if (value == null) {
            return result;
        } else {
            result = value;
            return result;
        }
    }

    /**其他--------------------------------*/

    /**
     * Long转int
     *
     * @param value
     * @return
     */
    public static int LongToInt(Long value) {
        if (value == null)
            return 0;
        else
            return value.intValue();
    }

    /**
     * RGB转16进制
     */
    public static String rgbToHexEncoding(int R, int G, int B) {
        StringBuffer strHex = new StringBuffer();
        String strR = Integer.toHexString(R);
        String strG = Integer.toHexString(G);
        String strB = Integer.toHexString(B);

        strR = strR.length() == 1 ? "0" + strR : strR;
        strG = strG.length() == 1 ? "0" + strG : strG;
        strB = strB.length() == 1 ? "0" + strB : strB;

        strHex.append("#");
        strHex.append(strR.toUpperCase());
        strHex.append(strG.toUpperCase());
        strHex.append(strB.toUpperCase());

        return strHex.toString();
    }

    /**
     * javaBean 转 Map
     * @param object 需要转换的javabean
     * @return  转换结果map
     * @throws Exception
     */
    public static Map<String, Object> beanToMap(Object object) throws Exception
    {
        Map<String, Object> map = new HashMap<String, Object>();

        Class cls = object.getClass();
        Field[] fields = cls.getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            map.put(field.getName(), field.get(object));
        }
        return map;
    }

    /**
     *
     * @param map   需要转换的map
     * @param cls   目标javaBean的类对象
     * @return  目标类object
     * @throws Exception
     */
    public static Object mapToBean(Map<String, Object> map, Class cls) throws Exception
    {
        Object object = cls.newInstance();
        for (String key : map.keySet()){
            Field temFiels = cls.getDeclaredField(key);
            temFiels.setAccessible(true);
            temFiels.set(object, map.get(key));
        }
        return object;
    }
}
