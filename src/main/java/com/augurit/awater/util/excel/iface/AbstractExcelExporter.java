package  com.augurit.awater.util.excel.iface;


import  com.augurit.awater.util.excel.exception.ExcelException;
import  com.augurit.awater.util.excel.iface.impl1.ExcelDataSetWithTitleAndParams;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;

import java.io.OutputStream;
import java.util.List;

public abstract class AbstractExcelExporter implements IExcelExporter{
	
	public void export(List<ExcelDataSet> dss, OutputStream out) throws ExcelException, Exception {
		HSSFWorkbook workbook = new HSSFWorkbook();
		ExcelDataSetWithTitleAndParams dataSet = null;

		for(int i=0;i<dss.size();i++){
			dataSet = (ExcelDataSetWithTitleAndParams) dss.get(i);
			exportSheet(workbook, dataSet);
		}
		workbook.write(out);
	}
	
	public abstract void exportSheet(Workbook workbook, ExcelDataSet dataSet);

}
