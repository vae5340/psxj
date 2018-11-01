package  com.augurit.awater.util.excel.iface;

import  com.augurit.awater.util.excel.exception.ExcelException;
import java.io.OutputStream;
import java.util.List;

public interface IExcelExporter {
	void export(List<ExcelDataSet> dss, OutputStream out) throws ExcelException, Exception;
}
