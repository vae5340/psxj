package  com.augurit.awater.util.excel.factory;

import  com.augurit.awater.util.excel.iface.AbstractExcelExporter;
import  com.augurit.awater.util.excel.iface.impl1.ExporterForDataSetWithTitleAndParams;

public class ExcelExporterFactory {
	public final static int TYPE_DATA_SET_WITH_TITLE_AND_PARAMS = 1;
	
	public static AbstractExcelExporter getInstance(int dataSetType){
		AbstractExcelExporter exporter = null;
		switch(dataSetType){
			case TYPE_DATA_SET_WITH_TITLE_AND_PARAMS: 
				exporter = ExporterForDataSetWithTitleAndParams.getInstance();
				break;
		}
		return exporter;
	} 
}
