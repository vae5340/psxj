package com.augurit.awater.dri.rest.util.arcgis;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.augurit.awater.util.ThirdUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * 同步上报图层功能类
 * @author hows
 * */
public final class httpArcgisClient {
	protected static Logger log = LoggerFactory.getLogger(httpArcgisClient.class);
	private static String url = ThirdUtils.getArcgisPath();
	private static int TIME_OUT=50000;//50s
	private static BasicHttpParams httpParams = null;
	static{
		httpParams = new BasicHttpParams();
		HttpConnectionParams.setConnectionTimeout(httpParams, TIME_OUT); //连接超时
		HttpConnectionParams.setSoTimeout(httpParams, TIME_OUT); //响应超时
	}
	public static String addFeature(String features){
		String request_url = url+"/addFeatures";
		HttpClient httpClient = new DefaultHttpClient(httpParams);
		HttpPost post = new HttpPost(request_url);
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("f", "json"));
		params.add(new BasicNameValuePair("features",features ));
		try {
			HttpEntity entity = new UrlEncodedFormEntity(params,"UTF-8");
			post.setHeader(new BasicHeader("ContentType", "text/plain;charset=utf-8"));
			post.setEntity(entity);
			HttpResponse response = httpClient.execute(post);
			if(response.getStatusLine().getStatusCode() == 200){
				String result = EntityUtils.toString(response.getEntity());
				JSONObject json =  JSONObject.fromObject(result);
				System.out.println(result);
				if(json.containsKey("addResults")){
					JSONArray jsonResult = json.getJSONArray("addResults");
					JSONObject js = jsonResult.getJSONObject(0);
					if(js.containsKey("success") ){
						log.info(js.toString());
						return js.toString();
					}
				}
			}
			return "300";
		} catch (Exception e) {
			log.info("addFeature请求连接或超时异常!"+e.getMessage());
			return "500";
		}
	}
	public static String updateFeature(String features){
		String request_url = url+"/updateFeatures";
		HttpClient httpClient = new DefaultHttpClient(httpParams);
		HttpPost post = new HttpPost(request_url);
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("f", "json"));
		params.add(new BasicNameValuePair("features",features));
		try {
			HttpEntity entity = new UrlEncodedFormEntity(params,"UTF-8");
			post.setHeader(new BasicHeader("ContentType", "text/plain;charset=utf-8"));
			post.setEntity(entity);
			HttpResponse response = httpClient.execute(post);
			if(response.getStatusLine().getStatusCode() == 200){
				String result = EntityUtils.toString(response.getEntity());
				JSONObject json =  JSONObject.fromObject(result);
//				System.out.println(result);
				if(json.containsKey("updateResults")){
					JSONArray jsonResult = json.getJSONArray("updateResults");
					JSONObject js = jsonResult.getJSONObject(0);
					if(js.containsKey("success")){
						log.info(js.toString());
						return js.toString();
					}
				}
			}
		} catch (Exception e) {
			log.info("updateFeature请求连接或超时异常!"+e.getMessage());
			return "500";
		}
		return "300";
	}
	public static Boolean deleteFeature(String ids){
		String request_url = url+"/deleteFeatures";
		HttpClient httpClient = new DefaultHttpClient(httpParams);
		HttpPost post = new HttpPost(request_url);
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("f", "json"));
		params.add(new BasicNameValuePair("objectIds",ids));
		try {
			HttpEntity entity = new UrlEncodedFormEntity(params,"UTF-8");
			post.setHeader(new BasicHeader("ContentType", "text/plain;charset=utf-8"));
			post.setEntity(entity);
			HttpResponse response = httpClient.execute(post);
			if(response.getStatusLine().getStatusCode() == 200){
				String result = EntityUtils.toString(response.getEntity());
				JSONObject json =  JSONObject.fromObject(result);
				System.out.println(json.toString());
				if(json.containsKey("deleteResults")){
					JSONArray jsonResult = json.getJSONArray("deleteResults");
					JSONObject js = jsonResult.getJSONObject(0);
					if(js.containsKey("success")){
						log.info("删除成功!"+js.toString());
						return true;
					}
				}
				if("{}".equals(json.toString())){//说明该数据未在图层中
					return true;
				}
			}
			return false;
		} catch (Exception e) {
			log.info("deleteFeature请求连接或超时异常!"+e.getMessage());
			return false;
		}
	}
	/**
	 * 查询条件
	 * @param parameter
	 * @return JSONArray
	 * */
	public static String query(Map<String,Object> parameter){
		String request_url = url+"/query";
		HttpClient httpClient = new DefaultHttpClient(httpParams);
		HttpPost post = new HttpPost(request_url);
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		for(String key :parameter.keySet()){
			if(parameter.get(key)!=null)
				params.add(new BasicNameValuePair(key,parameter.get(key).toString()));
		}
		try {
			HttpEntity entity = new UrlEncodedFormEntity(params,"UTF-8");
			post.setHeader(new BasicHeader("ContentType", "text/plain;charset=utf-8"));
			post.setEntity(entity);
			HttpResponse response = httpClient.execute(post);
			if(response.getStatusLine().getStatusCode() == 200) {
				String result = EntityUtils.toString(response.getEntity());
				JSONObject json = JSONObject.fromObject(result);
				if(json.containsKey("features")){
					JSONArray jsonArray = json.getJSONArray("features");
					if(jsonArray.size()>1){
						log.info(json.toString());
						return json.toString();
					}
				}
			}
			return "300";
		} catch (Exception e) {
			log.info("query请求连接或超时异常!"+e.getMessage());
			return "500";
		}
	}
}
