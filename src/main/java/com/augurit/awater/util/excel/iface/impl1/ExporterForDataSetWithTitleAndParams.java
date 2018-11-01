package  com.augurit.awater.util.excel.iface.impl1;


import  com.augurit.awater.util.excel.iface.AbstractExcelExporter;
import  com.augurit.awater.util.excel.iface.ExcelDataSet;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

public class ExporterForDataSetWithTitleAndParams extends AbstractExcelExporter {
	
	private static ExporterForDataSetWithTitleAndParams inst;
	
	public static ExporterForDataSetWithTitleAndParams getInstance(){
		inst = inst == null? new ExporterForDataSetWithTitleAndParams(): inst;
		return inst;
	}

	@Override
	public void exportSheet(Workbook workbook, ExcelDataSet ds) {
		Sheet sheet = workbook.createSheet(ds.getSheetName());
		
		ExcelDataSetWithTitleAndParams dataSet = (ExcelDataSetWithTitleAndParams) ds;
		String title = dataSet.getTitle();
		List<String> fields = dataSet.getFields();
		Map<String, String> fieldMap = dataSet.getFieldMap();
		Map<String, String> fieldTypeMap = dataSet.getFieldTypeMap();
		Map<String, Integer> fieldColsMap = dataSet.getFieldColsMap();
		List<Map<String, Object>> dataList = dataSet.getDataList();
		Map<String, CellStyle> cellStyleMap = new HashMap<String, CellStyle>();
		
		int rowIndex = 0;
		int startCellIndex = 0;
		Row row = null;
		Cell cell = null;
		
		CellStyle headerCellStyle = getCellStyleForHeaderCell(workbook);
		CellStyle bodyCellStyle = getCellStyleForBodyCell(workbook);
		CellStyle bodyCellStyleForDatetime = getCellStyleForBodyCellOfDatetime(workbook);
		
		cellStyleMap.put("headerCell", headerCellStyle);
		cellStyleMap.put("bodyCell", bodyCellStyle);
		cellStyleMap.put("bodyCellOfDatetime", bodyCellStyleForDatetime);
		
		createTitleRow(sheet, rowIndex++, startCellIndex, fields.size(), title, dataSet.getTitleRowHeight());
		
		//populate header
		row = createHeaderRow(sheet, rowIndex++, dataSet.getHeaderRowHeight());
		for(int i=0;i<fields.size();i++){
			String field = fields.get(i);
			String fieldName = fieldMap.get(field);
			Integer cols = fieldColsMap.get(field);
			cell = createHeaderCell(row, startCellIndex + i, cols, cellStyleMap);
			setCellValue(cell, "String", fieldName, cellStyleMap);
		}
		//populate body
		for(int i=0;i<dataList.size();i++){
			row = createBodyRow(sheet, rowIndex++, dataSet.getBodyRowHeight());
			Map<String, Object> item = dataList.get(i);
			for(int j=0;j<fields.size();j++){
				String field = fields.get(j);
				String type = fieldTypeMap.get(field);
				Object value = item.get(field);
				cell = createBodyCell(row, startCellIndex + j, cellStyleMap);
				setCellValue(cell, type, value, cellStyleMap);
			}
		}
	}
	
	private CellStyle getCellStyleForBodyCellOfDatetime(Workbook workbook) {
		CellStyle style = getCellStyleForBodyCell(workbook);
		
		DataFormat dataFormat = workbook.createDataFormat();
		short fmt = dataFormat.getFormat("yyyy-MM-dd hh:mm:ss");
		style.setDataFormat(fmt);
		
		return style;
	}

	private Row createTitleRow(Sheet sheet, int rowIndex, int cellIndex, int colspan, String title, Integer rowHeight){
		Workbook workbook = sheet.getWorkbook();
		Row row = sheet.createRow(rowIndex);
		Cell cell = row.createCell(cellIndex);
		CellStyle style = workbook.createCellStyle();
		CellRangeAddress range = new CellRangeAddress(rowIndex, rowIndex, cellIndex, cellIndex + colspan - 1);
		
		sheet.addMergedRegion(range);
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setBorderRight(CellStyle.BORDER_THIN);
		
		Font font = workbook.createFont();
		if(rowHeight != null){
			font.setFontHeightInPoints((short)Math.floor((rowHeight * 0.5)));
		}
		style.setFont(font);

		cell.setCellStyle(style);
		cell.setCellValue(title);
		
		if(rowHeight != null){
			row.setHeightInPoints(rowHeight);
		}
		
		return row;
	}
	
	private Cell createHeaderCell(Row row, int cellIndex, Integer cellCols, Map<String, CellStyle> cellStyleMap){
		Cell cell = row.createCell(cellIndex);
		Sheet sheet = cell.getSheet();
		String styleName = "headerCell";
		
		if(cellStyleMap != null && cellStyleMap.get(styleName) != null){
			cell.setCellStyle(cellStyleMap.get(styleName));
		}
		
		if(cellCols != null){
			sheet.setColumnWidth(cellIndex, cellCols * 256);
		}
		
		return cell;
	}
	
	private Cell createBodyCell(Row row, int cellIndex, Map<String, CellStyle> cellStyleMap){
		Cell cell = row.createCell(cellIndex);
		String styleName = "bodyCell";

		if(cellStyleMap != null && cellStyleMap.get(styleName) != null){
			cell.setCellStyle(cellStyleMap.get(styleName));
		}
		
		return cell;
	}
	
	private CellStyle getCellStyleForHeaderCell(Workbook workbook){
		CellStyle style = workbook.createCellStyle();
		Font font = workbook.createFont();
		font.setBoldweight(Short.parseShort("700"));
		style.setFont(font);

		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);

		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setBorderRight(CellStyle.BORDER_THIN);
		
		return style;
	}
	
	private CellStyle getCellStyleForBodyCell(Workbook workbook){
		CellStyle style = workbook.createCellStyle();
		
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setBorderRight(CellStyle.BORDER_THIN);
		
		return style;
	}
	
	private Row createHeaderRow(Sheet sheet, int rowIndex, Integer rowHeight){
		Row row = sheet.createRow(rowIndex);
		if(rowHeight != null){
			row.setHeightInPoints(rowHeight);
		}
		return row;
	}
	
	private Row createBodyRow(Sheet sheet, int rowIndex, Integer rowHeight){
		Row row = sheet.createRow(rowIndex);
		if(rowHeight != null){
			row.setHeightInPoints(rowHeight);
		}
		return row;
	}
	
	private boolean isNumber(Object value){
		if(value == null){
			return false;
		}
		try{
			Double db = Double.valueOf(value.toString());
			return db != null;
		}catch(Exception e){
			return false;
		}
	}

	private void setCellValue(Cell cell, String type, Object value, Map<String, CellStyle> cellStyleMap) {
		/*
		 * boolean
		 * Calendar
		 * Date
		 * double
		 * RichTextString
		 * String
		 */
		if(value == null){
			cell.setCellValue("");
			return;
		}
		
		boolean failed = false;
		
		CellStyle datetimeStyle = cellStyleMap.get("bodyCellOfDatetime");
		
		if(type != null){
			type = type.toLowerCase();
			try{
				if("string".equals(type)){
					cell.setCellValue(value.toString());
				}else if("double".equals(type)){
					cell.setCellValue(Double.valueOf(value.toString()));
				}else if("date".equals(type)){
					Date date = null;
					if(value instanceof Date){
						date = (Date) value;
					}else{
						DateFormat dFmt = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
						date = dFmt.parse(value.toString());
						if(date == null){
							failed = true;
						}
					}
					if(!failed){
						cell.setCellStyle(datetimeStyle);
						cell.setCellValue(date);
					}
				}else if("calendar".equals(type)){
					if(value instanceof Calendar){
						Calendar cal = (Calendar) value;
						cell.setCellValue(cal);
					}else{
						failed = true;
					}
				}else if("boolean".equals(type)){
					if(value instanceof Boolean){
						Boolean bool = Boolean.valueOf(value.toString());
						cell.setCellValue(bool);
					}else{
						failed = true;
					}
				}
			}catch(Exception e){
				e.printStackTrace();
				failed = true;
			}
		}else{
			failed = true;
		}
		
		if(failed){
			if(value instanceof Number || isNumber(value)){
				cell.setCellValue(Double.valueOf(value.toString()));
			}else if(value instanceof String){
				cell.setCellValue((String)value);
			}else if(value instanceof Boolean){
				cell.setCellValue((Boolean) value);
			}else if(value instanceof Date){
				cell.setCellStyle(datetimeStyle);
				cell.setCellValue((Date)value);
			}else if(value instanceof Calendar){
				cell.setCellValue((Calendar)value);
			}else{
				cell.setCellValue(value.toString());
			}
		}
	}

}
