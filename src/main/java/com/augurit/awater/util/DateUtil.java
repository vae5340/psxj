package com.augurit.awater.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by Administrator on 2018-03-20.
 */
public class DateUtil {
    public static final String YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";
    public static final String YYYY_MM_DD = "yyyy-MM-dd";
    public static final String YEAR_MOUTH_DAY_ = "yyyy年MM月dd日";



    public static String dateToString(Date date) {
        return dateToString(date, "yyyy-MM-dd HH:mm:ss");
    }
    /**
     *date类型转换为String类型
     * @param data Date类型的时间
     * @param formatType 格式为yyyy-MM-dd HH:mm:ss//yyyy年MM月dd日 HH时mm分ss秒
     * @return
     */
    public static String dateToString(Date data, String formatType){
        String dateStr=null;
        try {
            dateStr = new SimpleDateFormat(formatType).format(data);
        }catch (Exception e) {
            e.printStackTrace();
        }
        return dateStr;
    }

    public static String longToString(String currentTime, String formatType)
            throws ParseException {
        return longToString(Long.valueOf(currentTime), formatType); // date类型转成String;
    }
    /**
     * long类型转换为String类型
     * @param currentTime   要转换的long类型的时间
     * @param formatType    要转换的string类型的时间格式
     * @return
     * @throws ParseException
     */
    public static String longToString(long currentTime, String formatType) {
        Date date = longToDate(currentTime, formatType); // long类型转成Date类型
        String strTime = dateToString(date, formatType); // date类型转成String
        return strTime;
    }


    public static Date stringToDate(String dateString) {
        return stringToDate(dateString, "yyyy-MM-dd HH:mm:ss");
    }
    /**
     * string类型转换为date类型
     * @param strTime          要转换的string类型的时间
     * @param formatType    要转换的格式yyyy-MM-dd HH:mm:ss//yyyy年MM月dd日
     * @return
     * @throws ParseException
     */
    public static Date stringToDate(String strTime, String formatType) {
        Date date = null;
        try {
            SimpleDateFormat formatter = new SimpleDateFormat(formatType);
            date = formatter.parse(strTime);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

    /**
     *long转换为Date类型
     * @param currentTime
     * @param formatType
     * @return
     * @throws ParseException
     */

    public static Date longToDate(long currentTime, String formatType){
        Date date = null;
        Date dateOld = new Date(currentTime); // 根据long类型的毫秒数生命一个date类型的时间
        String sDateTime = dateToString(dateOld, formatType); // 把date类型的时间转换为string
        date = stringToDate(sDateTime, formatType); // 把String类型转换为Date类型
        return date;
    }

    public static Date longToDate(String currentTime, String formatType){
        return longToDate(Long.valueOf(currentTime),formatType);
    }

    public static boolean isSameDay(Date oneDay, Date anotherDay){
        return (oneDay != null && anotherDay != null) && dateToString(oneDay, "yyyy-MM-dd").equals(dateToString(anotherDay, "yyyy-MM-dd"));
    }
}
