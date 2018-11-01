package com.augurit.awater.bpm.xcyh.asiWorkflow.web.form;

import java.util.List;
import java.util.Map;

/**
 * 班主
 * @author Administrator
 *
 */
public class BzFrom {
private String code;
private String name;
List<Map<String, String>> userFormList;
private String icon;
public String getCode() {
	return code;
}
public List<Map<String, String>> getUserFormList() {
	return userFormList;
}
public void setUserFormList(List<Map<String, String>> userFormList) {
	this.userFormList = userFormList;
}
public void setCode(String code) {
	this.code = code;
}
public String getName() {
	return name;
}
public void setName(String name) {
	this.name = name;
}
public String getIcon() {
	return icon;
}
public void setIcon(String icon) {
	this.icon = icon;
}

}
