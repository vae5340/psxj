package com.augurit.awater.common;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 树形结构类
 * @author 
 * @since 2010-12-15
 */
public class Tree {
	
	private String id;            //为了与后台交互方便，而不使用 int
	private String seniorid;
	private String templateid;
	private String name;
	private String iconCls;
	private String iconSkin;
	private String state;
	private String belongtofacman;
	private boolean checked = false;
	private List<Tree> children = new ArrayList<Tree>();
	private Map<String,Object> attributes = new HashMap<String,Object>();
	
	public List<Tree> getChildren() {
		return children;
	}
	public void setChildren(List<Tree> children) {
		this.children = children;
	}
	public String getIconCls() {
		return iconCls;
	}
	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setId(int id){
		this.id = Integer.toString(id);
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public boolean isChecked() {
		return checked;
	}
	public void setChecked(boolean checked) {
		this.checked = checked;
	}
	public Map<String, Object> getAttributes() {
		return attributes;
	}
	public void setAttributes(Map<String, Object> attributes) {
		this.attributes = attributes;
	}
	public String getSeniorid() {
		return seniorid;
	}
	public void setSeniorid(String seniorid) {
		this.seniorid = seniorid;
	}
	public void setSeniorid(int seniorid){
		this.seniorid = Integer.toString(seniorid);
	}

	public String getIconSkin() {
		return iconSkin;
	}

	public void setIconSkin(String iconSkin) {
		this.iconSkin = iconSkin;
	}

	public String getTemplateid() {
		return templateid;
	}

	public void setTemplateid(String templateid) {
		this.templateid = templateid;
	}

	public String getBelongtofacman() {
		return belongtofacman;
	}

	public void setBelongtofacman(String belongtofacman) {
		this.belongtofacman = belongtofacman;
	}
}
