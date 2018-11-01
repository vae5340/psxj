package  com.augurit.awater.util.excel.iface;

import java.util.List;
import java.util.Map;

public class ExcelDataSet {
	private String sheetName;
	private Map<String, String> fieldMap;
	private List<String> fields;
	private Map<String, Integer> fieldColsMap;
	private Map<String, String> fieldTypeMap;
	private List<Map<String, Object>> dataList;
	private Integer headerRowHeight;
	private Integer bodyRowHeight;
	
	public String getSheetName() {
		return sheetName;
	}
	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}
	public Map<String, String> getFieldMap() {
		return fieldMap;
	}
	public void setFieldMap(Map<String, String> fieldMap) {
		this.fieldMap = fieldMap;
	}
	public List<Map<String, Object>> getDataList() {
		return dataList;
	}
	public void setDataList(List<Map<String, Object>> dataList) {
		this.dataList = dataList;
	}
	public List<String> getFields() {
		return fields;
	}
	public void setFields(List<String> fields) {
		this.fields = fields;
	}
	public Map<String, Integer> getFieldColsMap() {
		return fieldColsMap;
	}
	public void setFieldColsMap(Map<String, Integer> fieldColsMap) {
		this.fieldColsMap = fieldColsMap;
	}
	public Map<String, String> getFieldTypeMap() {
		return fieldTypeMap;
	}
	public void setFieldTypeMap(Map<String, String> fieldTypeMap) {
		this.fieldTypeMap = fieldTypeMap;
	}
	public Integer getHeaderRowHeight() {
		return headerRowHeight;
	}
	public void setHeaderRowHeight(Integer headerRowHeight) {
		this.headerRowHeight = headerRowHeight;
	}
	public Integer getBodyRowHeight() {
		return bodyRowHeight;
	}
	public void setBodyRowHeight(Integer bodyRowHeight) {
		this.bodyRowHeight = bodyRowHeight;
	}
}
