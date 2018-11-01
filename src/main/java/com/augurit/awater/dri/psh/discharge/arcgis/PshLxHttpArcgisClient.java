package com.augurit.awater.dri.psh.discharge.arcgis;

import java.util.ArrayList;
import java.util.List;

import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerForm;
import com.augurit.awater.dri.psh.menpai.web.form.PshMenpaiForm;
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


/**
 * 同步上报图层功能类
 * @author hows
 * */
public final class PshLxHttpArcgisClient {
	private static String url = ThirdUtils.getArcgisLxPath();
	private static String urlQh = ThirdUtils.getArcgisXzjxPath();
	private static int TIME_OUT=50000;//50s
	private static BasicHttpParams httpParams = null;
	static{
		httpParams = new BasicHttpParams();
		HttpConnectionParams.setConnectionTimeout(httpParams, TIME_OUT); //连接超时
		HttpConnectionParams.setSoTimeout(httpParams, TIME_OUT); //响应超时
	}
	/**
	 * 
	 * <p>Description:门牌空间查询 </p>
	 * <p>Company: </p> 
	 * @author xuzy
	 * @date 2018年8月20日下午4:00:59
	 * @return
	 */
	public static PshMenpaiForm identifyMenpai (PshMenpaiForm form, String geometry){
		String request_url = urlQh+"/identify";
		HttpClient httpClient = new DefaultHttpClient(httpParams);
		HttpPost post = new HttpPost(request_url);
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("f", "json"));
		params.add(new BasicNameValuePair("geometry",geometry ));
		params.add(new BasicNameValuePair("geometryType","esriGeometryPoint" ));
		params.add(new BasicNameValuePair("layers","visible:0" ));
		params.add(new BasicNameValuePair("tolerance","0" ));
		params.add(new BasicNameValuePair("mapExtent","112.94442462654136,22.547612828115952,114.05878172043404,23.938714362742893" ));
		params.add(new BasicNameValuePair("imageDisplay","600,550,96" ));
		try {
			HttpEntity entity = new UrlEncodedFormEntity(params,"UTF-8");
			post.setHeader(new BasicHeader("ContentType", "text/plain;charset=utf-8"));
			post.setEntity(entity);
			HttpResponse response = httpClient.execute(post);
			if(response.getStatusLine().getStatusCode() == 200){
				String result = EntityUtils.toString(response.getEntity());
				JSONObject json =  JSONObject.fromObject(result);
				//System.out.println(result);
				if(json.containsKey("results")){
					JSONArray jsonResult = json.getJSONArray("results");
					JSONObject js = jsonResult.getJSONObject(0);
					form.setKjArea(((JSONObject)js.get("attributes")).getString("行政区"));
					form.setKjTown(((JSONObject)js.get("attributes")).getString("街道"));
					form.setKjVillage(((JSONObject)js.get("attributes")).getString("NAME"));
				}
			}
			return form;
		} catch (Exception e) {
			System.out.println("identify请求连接或超时异常!");
			return form;
		}
	}
	/**
	 * 
	 * <p>Description:排水户空间查询 </p>
	 * <p>Company: </p> 
	 * @author xuzy
	 * @date 2018年8月20日下午4:00:59
	 * @return
	 */
	public static PshDischargerForm identify(PshDischargerForm form, String geometry){
		String request_url = urlQh+"/identify";
		HttpClient httpClient = new DefaultHttpClient(httpParams);
		HttpPost post = new HttpPost(request_url);
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("f", "json"));
		params.add(new BasicNameValuePair("geometry",geometry ));
		params.add(new BasicNameValuePair("geometryType","esriGeometryPoint" ));
		params.add(new BasicNameValuePair("layers","visible:0" ));
		params.add(new BasicNameValuePair("tolerance","0" ));
		params.add(new BasicNameValuePair("mapExtent","112.94442462654136,22.547612828115952,114.05878172043404,23.938714362742893" ));
		params.add(new BasicNameValuePair("imageDisplay","600,550,96" ));
		try {
			HttpEntity entity = new UrlEncodedFormEntity(params,"UTF-8");
			post.setHeader(new BasicHeader("ContentType", "text/plain;charset=utf-8"));
			post.setEntity(entity);
			HttpResponse response = httpClient.execute(post);
			if(response.getStatusLine().getStatusCode() == 200){
				String result = EntityUtils.toString(response.getEntity());
				JSONObject json =  JSONObject.fromObject(result);
				//System.out.println(result);
				if(json.containsKey("results")){
					JSONArray jsonResult = json.getJSONArray("results");
					JSONObject js = jsonResult.getJSONObject(0);
					form.setKjArea(((JSONObject)js.get("attributes")).getString("行政区"));
					form.setKjTown(((JSONObject)js.get("attributes")).getString("街道"));
					form.setKjVillage(((JSONObject)js.get("attributes")).getString("NAME"));
				}
			}
			return form;
		} catch (Exception e) {
			System.out.println("identify请求连接或超时异常!");
			return form;
		}
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
					if((boolean)js.get("success") ){
						return js.toString();
					}
				}
			}
			return "300";
		} catch (Exception e) {
			System.out.println("addFeature请求连接或超时异常!");
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
					if((boolean)js.get("success")){
						return js.toString();
					}
				}
			}
		} catch (Exception e) {
			System.out.println("updateFeature请求连接或超时异常!");
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
					if((boolean)js.get("success")){
//						System.out.println("删除成功!"+js.toString());
						return true;
					}
				}
				if("{}".equals(json.toString())){//说明该数据未在图层中
					return true;
				}
			}
			return false;
		} catch (Exception e) {
			System.out.println("deleteFeature请求连接或超时异常!");
			return false;
		}
	}
	
}
