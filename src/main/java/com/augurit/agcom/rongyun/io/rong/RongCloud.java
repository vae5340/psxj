/**
 * 融云 Server API java 客户端
 * create by kitName
 * create datetime : 2017-03-13 
 * 
 * v2.0.1
 */
package com.augurit.agcom.rongyun.io.rong;

import com.augurit.agcloud.org.PsxjProperties;
import com.augurit.agcom.rongyun.io.rong.methods.*;
import com.augurit.awater.util.ThirdUtils;
import  com.augurit.awater.util.pipe.PipeConfigProperties;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.concurrent.ConcurrentHashMap;

//import com.augurit.agcom.rongyun.io.rong.methods.*;

public class RongCloud {

	private static ConcurrentHashMap<String, RongCloud> rongCloud = new ConcurrentHashMap<String,RongCloud>();

	public User user;
	public Message message;
	public Wordfilter wordfilter;
	public Group group;
	public Chatroom chatroom;
	public Push push;
	public SMS sms;

	private RongCloud(String appKey, String appSecret) {
		user = new User(appKey, appSecret);
		message = new Message(appKey, appSecret);
		wordfilter = new Wordfilter(appKey, appSecret);
		group = new Group(appKey, appSecret);
		chatroom = new Chatroom(appKey, appSecret);
		push = new Push(appKey, appSecret);
		sms = new SMS(appKey, appSecret);

	}

	public static RongCloud getInstance(String appKey, String appSecret) {
		if (null == rongCloud.get(appKey)) {
			rongCloud.putIfAbsent(appKey, new RongCloud(appKey, appSecret));
		}
		return rongCloud.get(appKey);
	}

	public static RongCloud getInstance() throws Exception{
		String appKey = ThirdUtils.getByKey("appKey");
		String appSecret = ThirdUtils.getByKey("appSecret");
		return RongCloud.getInstance(appKey, appSecret);
	}
	 
}