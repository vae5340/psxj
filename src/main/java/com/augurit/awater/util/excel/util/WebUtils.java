package  com.augurit.awater.util.excel.util;

import  com.augurit.awater.util.excel.exception.ExcelException;
import  com.augurit.awater.util.excel.factory.ExcelExporterFactory;
import  com.augurit.awater.util.excel.iface.ExcelDataSet;
import  com.augurit.awater.util.excel.iface.IExcelExporter;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

public class WebUtils {
	
	public static final String HTTP_CONTENTTYPE_EXCEL = "application/octet-stream";
	public static final String HTTP_HEADER_CONTENT_DISPOSITION = "Content-Disposition";
	public static final String HTTP_HEADER_CONTENT_DISPOSITION_PATTERN = "attachment; filename=\"%s";
	public static final String HTTP_CONTENT_WORD = "application/msword";
	public static final String HTTP_FILENAME = "attachment; filename=";
	
	public static void exportAndRenderExcel(String fileName, List<ExcelDataSet> dataSets, HttpServletResponse response) throws ExcelException, Exception{
		OutputStream out = null;
		IExcelExporter exporter = ExcelExporterFactory.getInstance(ExcelExporterFactory.TYPE_DATA_SET_WITH_TITLE_AND_PARAMS);
		response.setContentType(HTTP_CONTENTTYPE_EXCEL);
		response.setHeader(HTTP_HEADER_CONTENT_DISPOSITION, String.format(HTTP_HEADER_CONTENT_DISPOSITION_PATTERN, new String(fileName.getBytes("GBK"), "ISO8859-1")));
		out = response.getOutputStream();
		exporter.export(dataSets, out);
	}
	
	public static void createWord(Map<String, Object> map,String fileName, HttpServletResponse response) throws Exception{
		OutputStream out = null;
		File file = null;
		InputStream fin = null;
		try{
			response.setContentType(HTTP_CONTENT_WORD);
			response.setHeader(HTTP_HEADER_CONTENT_DISPOSITION, HTTP_FILENAME + new String(fileName.getBytes(),"ISO8859-1"));
			file = ExportPoiWord.exportWord(map,fileName);
			fin = new FileInputStream(file);
			out = response.getOutputStream();
			byte[] b = new byte[1024]; 
			int len = -1;
			while ((len = fin.read(b)) != -1){
				out.write(b, 0, len);
			}
		}finally{
			if(fin != null) fin.close();
			if(out != null) out.close();
			if(file != null) file.delete();
		}
	}
}
