package  com.augurit.awater.util.excel.iface;

import  com.augurit.awater.util.excel.iface.impl1.ExcelDataSetWithTitleAndParams;
import com.google.gson.JsonObject;

import java.util.Map;

public abstract class ExcelConfigParser {
	public abstract ExcelDataSetWithTitleAndParams parseExcelConfigForDataSet(JsonObject config, Map<String, JsonObject> enumMap, Map<String, Object> contextVars);
}
