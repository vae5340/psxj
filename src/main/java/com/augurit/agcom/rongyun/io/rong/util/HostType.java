package com.augurit.agcom.rongyun.io.rong.util;
//API("http://139.159.227.100:8081"), SMS("http://api.sms.ronghub.com");
public enum HostType {

	API("http://api.cn.ronghub.com"), SMS("http://api.sms.ronghub.com");
	private String type;

	private HostType(String type) {
		this.type = type;
	}

	public static HostType getType(String state) {
		for (HostType deviceType : HostType.values()) {
			if (deviceType.type.equalsIgnoreCase(state)) {
				return deviceType;
			}
		}
		throw new RuntimeException(state + " is not a valid Host Type!");
	}

	public String getStrType() {
		return type;
	}
}