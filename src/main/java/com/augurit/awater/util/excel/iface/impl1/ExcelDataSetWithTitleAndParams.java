package  com.augurit.awater.util.excel.iface.impl1;

import  com.augurit.awater.util.excel.iface.ExcelDataSet;

import java.util.Map;


public class ExcelDataSetWithTitleAndParams extends ExcelDataSet {
	private String title;
	private Map<String, String> params;
	private Integer titleRowHeight;
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Map<String, String> getParams() {
		return params;
	}
	public void setParams(Map<String, String> params) {
		this.params = params;
	}
	public Integer getTitleRowHeight() {
		return titleRowHeight;
	}
	public void setTitleRowHeight(Integer titleRowHeight) {
		this.titleRowHeight = titleRowHeight;
	}
}
