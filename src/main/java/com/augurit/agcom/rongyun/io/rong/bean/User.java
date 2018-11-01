package com.augurit.agcom.rongyun.io.rong.bean;

import java.io.Serializable;

/**
 * 用户表
 *Description : TODO
 *Author : 曹铠平
 *CreateDate ：2017-1-4
 *Copyright: 广州奥格智能科技有限公司
 */
public class User implements Serializable {
	private static final long serialVersionUID = 5086893608434360361L;
	private String id;				//编号
	private String loginName;		//登录名称
	private String password;		//登录密码
	private String userName;		//用户名称
	private String isActive;		//是否有效
	private String token;//融云token
	private String portraitUri;//用户头像uri

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getIsActive() {
		return isActive;
	}

	public void setIsActive(String isActive) {
		this.isActive = isActive;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getPortraitUri() {
		return portraitUri;
	}

	public void setPortraitUri(String portraitUri) {
		this.portraitUri = portraitUri;
	}
}
