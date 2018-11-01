package  com.augurit.awater.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * 读取application.properties文件中的属性
 * **/
public class ThirdUtils {
	private static Properties properties = new Properties();
	static {
		InputStream inputStream = null;
		try {
			inputStream = ThirdUtils.class
					.getResourceAsStream("/psxj/psxj.properties");

			if (null != inputStream) {
				properties.load(inputStream);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (null != inputStream) {
				try {
					inputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	/**
	 * 获得上传存入的路径
	  */
	public static String getInPath(){
		String path=properties.getProperty("filePath");
		return path;
	}
	
	/**
	 * 获得服务器上传读取文件的路径
	 * 上面那个路径要跟tomcat配置文件里面的一样
	  */
	public static String getOutPath(){
		String path=properties.getProperty("filePath");
		return path;
	}
	/**
	 * 获取上报数据上传地址
	  */
	public static String getArcgisPath(){
		String path=properties.getProperty("arcgis_request");
		return path;
	}
	
	/**
	 * 获取上报门牌上传地址
	  */
	public static String getArcgisMpPath(){
		String path=properties.getProperty("arcgis_mp_request");
		return path;
	}
	
	/**
	 * 获取上报门牌上传地址
	 */
	public static String getArcgisXbcPath(){
		String path=properties.getProperty("arcgis_xbc_request");
		return path;
	}
	
	/**
	 * 获取上报连线上传地址
	  */
	public static String getArcgisLxPath(){
		String path=properties.getProperty("arcgis_lx_request");
		return path;
	}

	public static Properties getProperties() {
		return properties;
	}
	
	/**
	 * 获取交办反馈的上传地址
	  */
	public static String getArcgisFeedBackPath(){
		String path=properties.getProperty("arcgis_feedBack_request");
		return path;
	}
	public static String getArcgisXzjxPath(){
		String path=properties.getProperty("arcgis_lx_request");
		return path;
	}
	public static String getByKey(String key){
		String path=properties.getProperty(key);
		return path;
	}
}
