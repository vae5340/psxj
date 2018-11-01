package  com.augurit.awater.util.excel.iface.impl1;

import  com.augurit.awater.util.excel.iface.ExcelConfigParser;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ConfigParserForDatasetWithTitleAndParams extends ExcelConfigParser {

	private static String populatePatternWithVars(String pattern, Map<String, Object> contextVars) {
		if(contextVars == null){
			return pattern;
		}
		if(pattern == null){
			return null;
		}
		for(String key : contextVars.keySet()){
			String matchPattern = "\\$\\{[ \\t]*"+key+"[ \\t]*\\}";
			Object value = contextVars.get(key);
			pattern = pattern.replaceAll(matchPattern, value != null? value.toString(): "");
		}
		return pattern;
	}
	
	public ExcelDataSetWithTitleAndParams parseExcelConfigForDataSet(JsonObject config, Map<String, JsonObject> enumMap, Map<String, Object> contextVars) {
		ExcelDataSetWithTitleAndParams dataSet = new ExcelDataSetWithTitleAndParams();

		String sheetName = populatePatternWithVars(config.get("sheetName").getAsString(), contextVars);
		String sheetTitle = populatePatternWithVars(config.get("sheetTitle").getAsString(), contextVars);
		Integer titleRowHeight = null;
		Integer headerRowHeight = null;
		Integer bodyRowHeight = null;
		
		if(config.get("titleRowHeight") != null){
			titleRowHeight = toInteger(config.get("titleRowHeight").getAsNumber());
		}
		if(config.get("headerRowHeight") != null){
			headerRowHeight = toInteger(config.get("headerRowHeight").getAsNumber());
		}
		if(config.get("bodyRowHeight") != null){
			bodyRowHeight = toInteger(config.get("bodyRowHeight").getAsNumber());
		}
		
		Map<String, String> fieldMap = null;
		Map<String, Integer> fieldColsMap = null;
		Map<String, String> fieldTypeMap = null;
		List<String> fields = null;
		
		JsonArray fieldArr = config.get("fields").getAsJsonArray();
		
		fieldMap = new HashMap<String, String>();
		fields = new ArrayList<String>();
		fieldColsMap = new HashMap<String, Integer>();
		fieldTypeMap = new HashMap<String, String>();
		
		for(JsonElement ele : fieldArr){
			JsonObject field = ele.getAsJsonObject();
			String fieldField = field.get("field").getAsString();
			String fieldName = field.get("name").getAsString();
			fields.add(fieldField);
			fieldMap.put(fieldField, fieldName);
			
			if(field.get("enum") != null){
				enumMap.put(fieldField, field.get("enum").getAsJsonObject());				
			}
			if(field.get("type") != null){
				fieldTypeMap.put(fieldField, field.get("type").getAsString());
			}
			if(field.get("cols") != null){
				Integer fieldCol = toInteger(field.get("cols").getAsNumber());
				if(fieldCol != null){
					fieldColsMap.put(fieldField, fieldCol);
				}
			}
		}
		
		dataSet.setSheetName(sheetName);
		dataSet.setFields(fields);
		dataSet.setFieldMap(fieldMap);
		dataSet.setTitle(sheetTitle);
		dataSet.setFieldColsMap(fieldColsMap);
		dataSet.setFieldTypeMap(fieldTypeMap);
		
		if(titleRowHeight != null){
			dataSet.setTitleRowHeight(titleRowHeight);
		}
		if(headerRowHeight != null){
			dataSet.setHeaderRowHeight(headerRowHeight);
		}
		if(bodyRowHeight != null){ 
		}
		
		return dataSet;
	}
	
	public Short toShortInteger(Number num){
		Integer intNum = toInteger(num);
		if(intNum == null){
			return null;
		}
		return Short.valueOf(intNum.toString());
	}
	
	public Integer toInteger(Number num){
		if(num == null){
			return null;
		}
		Integer intNum = null;
		try{
			String numStr = num.toString();
			numStr = numStr.replaceAll("\\..*", "");
			intNum = Integer.parseInt(numStr);
		}catch(Exception e){
			return null;
		}
		return intNum;
	}
}
