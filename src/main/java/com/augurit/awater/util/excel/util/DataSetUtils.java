package  com.augurit.awater.util.excel.util;

import  com.augurit.awater.util.excel.exception.ExcelException;
import  com.augurit.awater.util.excel.iface.ExcelConfigParser;
import  com.augurit.awater.util.excel.iface.ExcelDataSet;
import  com.augurit.awater.util.excel.iface.impl1.ExcelDataSetWithTitleAndParams;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.commons.beanutils.BeanUtils;

import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

public class DataSetUtils {
	private static String excelConfigLocation = "./json/excel-config.json";
	
	private static Map<String, Object> getExcelExportContextVars(List<?> dataList) {
		Map<String, Object> vars = new HashMap<String, Object>();
		
		String EXCEL_EXPORT_CONTEXT_VAR_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
		String EXCEL_EXPORT_CONTEXT_VAR_TIME_FOMRAT = "HH:mm:ss";
		String EXCEL_EXPORT_CONTEXT_VAR_DATE_FORMAT = "yyyy-MM-dd";
		
		Date date = new Date(System.currentTimeMillis());
		
		
		DateFormat dtFmt = new SimpleDateFormat(EXCEL_EXPORT_CONTEXT_VAR_DATETIME_FORMAT);
		DateFormat dFmt = new SimpleDateFormat(EXCEL_EXPORT_CONTEXT_VAR_DATE_FORMAT);
		DateFormat tFmt = new SimpleDateFormat(EXCEL_EXPORT_CONTEXT_VAR_TIME_FOMRAT);
		
		vars.put("time", tFmt.format(date));
		vars.put("date", dFmt.format(date));
		vars.put("datetime", dtFmt.format(date));
		vars.put("totalCount", dataList.size());
		
		return vars;
	}
	
	private static JsonObject readExcelConfig(String configName) throws Exception {
		InputStreamReader reader = null;
		JsonElement conf = null;
		try{
			reader = new InputStreamReader(DataSetUtils.class.getClassLoader().getResourceAsStream(excelConfigLocation), Charset.forName("UTF-8"));
			JsonParser jsonParser = new JsonParser();
			JsonObject config = jsonParser.parse(reader).getAsJsonObject();
			conf = config.get(configName);
		}catch(Exception e){
			e.printStackTrace();
			conf = null;
		}finally{
			if(reader != null){
				try{
					reader.close();
				}catch(Exception e){
					e.printStackTrace();
					conf = null;
				}
			}
		}
		return conf == null? null: conf.getAsJsonObject();
	}
	
	public static List<ExcelDataSet> makeExcelDataSets(ExcelConfigParser configParser, List<?> formList, Class<?> entityClazz, String configName) throws ExcelException, Exception{
		List<ExcelDataSet> dataSets = new ArrayList<ExcelDataSet>();

		JsonObject excelConfigJson = readExcelConfig(configName);
		Map<String, JsonObject> enumMap = new HashMap<String, JsonObject>();
		Map<String, Object> contextVars = getExcelExportContextVars(formList);
		
		ExcelDataSetWithTitleAndParams dataSet = configParser.parseExcelConfigForDataSet(excelConfigJson, enumMap, contextVars);
		List<Map<String, Object>> dataList = new ArrayList<Map<String,Object>>();
		
//		Gson gson = new Gson();
		for(Object item : formList){
//			System.out.println(gson.toJson(item));
			Map<String, Object> obj = new HashMap<String, Object>();
			for(String field : dataSet.getFields()){
				Object value = null;
				if(entityClazz == Map.class){
					value = entityClazz.getMethod("get", Object.class).invoke(entityClazz.cast(item), field);
				}else{
					value = BeanUtils.getProperty(entityClazz.cast(item), field);
				}
				if(value != null && enumMap.get(field) != null){
					JsonElement val = enumMap.get(field).get(value.toString());
					if(val != null){
						value = val.getAsString();
					}
				}
				obj.put(field, value != null? value: "未知");
			}
			dataList.add(obj);
		}
		dataSet.setDataList(dataList);
		dataSets.add(dataSet);
		
		return dataSets;
	}
}
