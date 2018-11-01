package  com.augurit.awater.util;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.http.HttpException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.config.SocketConfig;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.BasicHttpClientConnectionManager;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ResourceBundle;

public class MessageUtilsJson {


	
    private static final String sendUrl="http://112.74.139.4/sms3_api/jsonapi/jsonrpc2.jsp";
	
    public static void main(String[] args) throws Exception{
    	sendSms();
	}
    
    public static void sendSms() throws HttpException, IOException{
    	//动态获取启动预案通知人员电话号码
    	String phone="15986367748,18520314751";
    	//获取启动预案短信信息
    	String content="2016年10月28日11时42分，本市已启动I级应急响应预案，请各区领导负责人启动相应预案，及时进行应急防汛调度。";
    	//打印返回结果
    	MessageUtilsJson.sendMsg(phone,content);
    }
    
	public static String sendMsg(String phone,String content) throws HttpException, IOException{
		ResourceBundle rb = ResourceBundle.getBundle("application");
    	
    	String userid=rb.getString("mchuanUserId");
    	String password=rb.getString("mchuanPassword");
		JSONObject jsonObject = new JSONObject();
		jsonObject.accumulate("id","1");
		jsonObject.accumulate("method","send");
		
		JSONObject jsonParams = new JSONObject();
		jsonParams.accumulate("userid", userid);
		jsonParams.accumulate("password", password);
		
		JSONObject jsonSubmits = new JSONObject();
		jsonSubmits.accumulate("content", content);
		jsonSubmits.accumulate("phone", phone);
		
		JSONArray jsonArray = new JSONArray();
		jsonArray.add(jsonSubmits);
		
		jsonParams.accumulate("submit",jsonArray);
		jsonObject.accumulate("params", jsonParams);
		
		System.out.println(jsonObject.toString());
		//String result = submitUrl(jsonObject, sendUrl);
		//return result;
		return null;
	}
	
	// 获取短信状态
	public static String getMsgStatus(String userid,String password) throws HttpException, IOException{
		JSONObject jsonObject = new JSONObject();
		jsonObject.accumulate("id","1");
		jsonObject.accumulate("method","report");
		
		JSONObject jsonParams = new JSONObject();
		jsonParams.accumulate("userid", userid);
		jsonParams.accumulate("password", password);
		jsonObject.accumulate("params", jsonParams);
		System.out.println(jsonObject.toString());
		String result = submitUrl(jsonObject, sendUrl);
		return result;
	}
	
	public static String getMsgUp() throws HttpException, IOException{
		JSONObject jsonObject = new JSONObject();
		jsonObject.accumulate("id","1");
		jsonObject.accumulate("method","upmsg");
		ResourceBundle rb = ResourceBundle.getBundle("application");
    	
		JSONObject jsonParams = new JSONObject();
		jsonParams.accumulate("userid", rb.getString("smsUserId"));
		jsonParams.accumulate("password", rb.getString("smsPassword"));
		jsonObject.accumulate("params", jsonParams);
		System.out.println(jsonObject.toString());
		String result = submitUrl(jsonObject, sendUrl);
		System.out.println(result);
		return result;
	}
	
	public static String submitUrl(JSONObject jsonobject, String url) throws IOException, HttpException {
		BasicHttpClientConnectionManager basicHttpClientCN = new BasicHttpClientConnectionManager();
		HttpPost method = new HttpPost(url);
		RequestConfig requestConfig = RequestConfig.custom()
				.setConnectTimeout(5000).build();
		SocketConfig socketConfig = SocketConfig.custom()
				.setSoTimeout(300000).build();
		basicHttpClientCN.setSocketConfig(socketConfig);
		CloseableHttpClient httpClient = HttpClients.custom().setConnectionManager(basicHttpClientCN)
				.setDefaultRequestConfig(requestConfig).build();
        method.setHeader("http.protocol.content-charse","UTF-8");
		StringEntity requestEntity=new StringEntity(URLEncoder.encode(jsonobject.toString(), "utf-8"));
		method.setEntity(requestEntity);
		CloseableHttpResponse closeableHttpResponse = httpClient.execute(method);
		String result = EntityUtils.toString(closeableHttpResponse.getEntity());
		return result;
	}
	
}
