package com.augurit.awater.util.data;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 日期帮助类
 * 
 * @author cannel
 * 
 */
public class DateHelper {
	/**
	 * 比较date1是否大于date2（如果其中一个为null返回true）
	 * 
	 * @param date1
	 * @param date2
	 * @return
	 */
	public static boolean compareGreater(Date date1, Date date2) {
		if (date1 != null && date2 != null) {
			return date1.getTime() > date2.getTime();
		}

		return true;
	}

	/**
	 * 比较date1是否小于date2（如果其中一个为null返回true）
	 * 
	 * @param date1
	 * @param date2
	 * @return
	 */
	public static boolean compareLess(Date date1, Date date2) {
		if (date1 != null && date2 != null) {
			return date1.getTime() < date2.getTime();
		}

		return true;
	}
	/**
	 * 格式化时间
	 * @param date
	 * @return
	 */
	public static String formatTime(Date date) {
		if(date!=null){
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String dateString = formatter.format(date);
			return dateString;
		}
		return "";
	}
}
