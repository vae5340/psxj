package com.augurit.awater.util.excel.util;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;

/**
 * 
 * @author ztb
 *
 */
public class ExcelExportUtil {
	public static void fillTitle(Workbook tempWorkBook,String title, String[] colTitles, int[] colsWidth){
		//样式
		CellStyle style = tempWorkBook.createCellStyle();
	    style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
	    style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
	    style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
	    style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
	    style.setBorderRight(HSSFCellStyle.BORDER_THIN);
	    style.setRightBorderColor(IndexedColors.BLACK.getIndex());
	    style.setBorderTop(HSSFCellStyle.BORDER_THIN);
	    style.setTopBorderColor(IndexedColors.BLACK.getIndex());
	    style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		//颜色
		style.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
		style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);

		//字体
	    Font font = tempWorkBook.getFontAt((short)0);
	    Font cfont = tempWorkBook.createFont();
	    cfont.setFontName(font.getFontName());
	    cfont.setFontHeight(font.getFontHeight());
	    cfont.setFontHeightInPoints((short)12);
		cfont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);//粗体显示
	    style.setFont(cfont);
	    
		Sheet sheet = tempWorkBook.createSheet("Sheet1");
		int startRow = 0;
		Row row = sheet.getRow(startRow);
		if(null == row){
			row = sheet.createRow(startRow);
			row.setHeight((short)(15 * 40));
			startRow++;
		}
		Cell cell = null;
		//填充标题
		if(null != title && !"".equals(title)){
			cell = row.getCell(0);
			if(null == cell){
				cell = row.createCell(0);
			}
			cell.setCellValue(title);
			CellStyle titleStyle = tempWorkBook.createCellStyle();
			titleStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			titleStyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());
			titleStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
			titleStyle.setLeftBorderColor(IndexedColors.BLACK.getIndex());
			titleStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
			titleStyle.setRightBorderColor(IndexedColors.BLACK.getIndex());
			titleStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
			titleStyle.setTopBorderColor(IndexedColors.BLACK.getIndex());
			titleStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			titleStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
			Font titleFont = tempWorkBook.createFont();
			titleFont.setFontName(font.getFontName());
			titleFont.setFontHeight((short)13);
			titleFont.setFontHeightInPoints((short)14);
			
			titleStyle.setFont(titleFont);
			
			cell.setCellStyle(titleStyle);
			//合并单元格
			sheet.addMergedRegion(new CellRangeAddress(
		            0, //first row (0-based)
		            0, //last row  (0-based)
		            0, //first column (0-based)
		            colTitles.length-1  //last column  (0-based)
		    ));
		}
		//填充表头
		row = sheet.getRow(startRow);
		if(null == row){
			row = sheet.createRow(startRow);
			row.setHeightInPoints((short)( 28));
		}
		for(int i=0; i<colTitles.length; i++){
			cell = row.createCell(i);
			cell.setCellStyle(style);
			cell.setCellValue(colTitles[i]);
			if(colsWidth != null && colsWidth[i] > 0){
				sheet.setColumnWidth(i, colsWidth[i]*2*256);
			}
		}
	}
	/**
	 * 
	 * @param <T>
	 * @param list 数据
	 * @param startRow 开始的excel行
	 * @param cellLength 列的个数
	 * @param serialNumber 是否生成编号列
	 */
	public static <T> void fillData( Workbook tempWorkBook, List<T> list,
			int startRow, boolean serialNumber ) throws Exception{
		Sheet tempSheet = null;
		Row tempRow = null;
	    Cell tempCell = null;
	    // 获取模板sheet页  
        tempSheet = tempWorkBook.getSheetAt(0);
        Class clazz = null;
		Field[] fs = null;
		Method[] methods = null;
		// Style the cell with borders all around.
	    CellStyle style = tempWorkBook.createCellStyle();
	    style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
	    style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
	    style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
	    style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
	    style.setBorderRight(HSSFCellStyle.BORDER_THIN);
	    style.setRightBorderColor(IndexedColors.BLACK.getIndex());
	    style.setBorderTop(HSSFCellStyle.BORDER_THIN);
	    style.setTopBorderColor(IndexedColors.BLACK.getIndex());
	    style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
	   
		 // 将数据写入excel
    	for (int i = 0; i < list.size(); i++ ) {
    		// 获取指定行  
            tempRow = tempSheet.createRow(startRow++);
            //tempRow.setHeightInPoints(20); 
			tempRow.setHeight((short)(15 * 20));

			T t = list.get(i);
			// 获取类信息
			if(clazz == null || fs == null || methods == null){
				clazz = t.getClass();
				fs = clazz.getDeclaredFields();
				methods = clazz.getMethods();
			}
			if( serialNumber ) {
				// 编号列
				tempCell = tempRow.createCell(0);
				tempCell.setCellStyle(style);
				tempCell.setCellValue(i+1);

				// 填充列
				for (int j=0; j<fs.length; j++){
					tempCell = tempRow.createCell(j+1);
					tempCell.setCellStyle(style);
					Field f = fs[j];
					String upfname = toUpperCase(f.getName());
					//String type = f.getType().toString();//得到此属性的类型
					Method method = null;
					for( int k=0; k<methods.length; k++){
						method = methods[k];
						if(method.getName().equals("get" + upfname)){
							//TODO 处理类型
							String result = "";
							Object res = method.invoke(t);
							if(res != null){
								result = String.valueOf(res);
							}
							tempCell.setCellValue(result);
							//tempCell.setCellValue(String.valueOf(method.invoke(t)));
							break;
						}
					}
				}
			}else{
				// 填充列
				for (int j=0; j<fs.length; j++){
					tempCell = tempRow.createCell(j);
					tempCell.setCellStyle(style);
					Field f = fs[j];
					String upfname = toUpperCase(f.getName());
					//String type = f.getType().toString();//得到此属性的类型
					Method method = null;
					for( int k=0; k<methods.length; k++){
						method = methods[k];
						if(method.getName().equals("get" + upfname)){
							//TODO 处理类型
							String result = "";
							Object res = method.invoke(t);
							if(res != null){
								result = String.valueOf(res);
							}
							tempCell.setCellValue(result);
							//tempCell.setCellValue(String.valueOf(method.invoke(t)));
							break;
						}
					}
				}
			}

        }// end for
	}
	/**
	 * 
	 * @param tempWorkBook
	 * @param list
	 * @param startRow
	 * @param serialNumber
	 * @throws Exception
	 */
	public static void fillStringData(Workbook tempWorkBook, List<Object[]> list,
			int startRow, boolean serialNumber ) throws Exception{
		Sheet tempSheet = null;
		Row tempRow = null;
	    Cell tempCell = null;
	    // Style the cell with borders all around.
	    CellStyle style = tempWorkBook.createCellStyle();
	    style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
	    style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
	    style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
	    style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
	    style.setBorderRight(HSSFCellStyle.BORDER_THIN);
	    style.setRightBorderColor(IndexedColors.BLACK.getIndex());
	    style.setBorderTop(HSSFCellStyle.BORDER_THIN);
	    style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
	    // 获取模板sheet页  
        tempSheet = tempWorkBook.getSheetAt(0);
		 // 将数据写入excel
    	for (int i = 0; i < list.size(); i++ ) {
    		// 获取指定行
            tempRow = tempSheet.createRow(startRow++);
            //tempRow.setHeightInPoints(20); 
            tempRow.setHeight((short)(15 * 20));
			Object[] data = list.get(i);
			String res = "";
			if( serialNumber ) {
				// 编号列
				tempCell = tempRow.createCell(0);
				tempCell.setCellStyle(style);
				tempCell.setCellValue(i+1);

				// 填充列
				for (int j=0; j<data.length; j++){
					res = (data[j]== null) ? "" : data[j].toString();
					tempCell = tempRow.createCell(j+1);
					tempCell.setCellStyle(style);
					tempCell.setCellValue(res);
				}
			}else{
				// 填充列
				for (int j=0; j<data.length; j++){
					res = (data[j]== null) ? "" : data[j].toString();
					tempCell = tempRow.createCell(j);
					tempCell.setCellStyle(style);
					tempCell.setCellValue(res);
				}
			}

        }// end for
	}
	
	/**
	 * 首字母转化为大写
	 * @return
	 */
	public static String toUpperCase(String str){
		if(str == null || "".equals(str)){
			return "";
		}
		
		char[] cs = str.toCharArray();
        cs[0] -= 32;
        return String.valueOf(cs);
	}

	/**
	 *
	 * @param list_fieldname_disname 按顺序存放表头的字段显示名（displayname），字段名（fieldname），组件id（componentid）和diccode
	 * @param datalist数据
	 * @param sheet
	 * @param dicmap存放数据字典的map，格式是Map<String,Map> dicmap = new HashMap<String,Map>();外面的map是以数据字典名为键，数据字典项为值，里面的map是以数据字典项名称为键，数据字典值为对应值。
	 */
	public static void fillMapData(List list_fieldname_disname,List datalist,HSSFSheet sheet,Map<String,Map> dicmap){
		//拼接表头
		//创建HSSFRow对象,这是第一行，用来写属性名
		HSSFRow row = sheet.createRow(0);
		for (int i = 0; i < list_fieldname_disname.size(); i++) {
			HSSFCell cell = row.createCell(i);
			Object[] fieldname_disname = (Object[]) list_fieldname_disname.get(i);
			cell.setCellValue(fieldname_disname[0] + "(" + fieldname_disname[1] + ")");
		}
		for (int j = 0; j < datalist.size(); j++) {
			HSSFRow attrRow = sheet.createRow(j + 1);
			int k = 0;
			Object[] obj = (Object[]) datalist.get(j);
			for (int i = 0; i < obj.length; i++) {
				//创建HSSFCell对象
				HSSFCell cell = attrRow.createCell(k++);
				Object[] fieldname_disname = (Object[]) list_fieldname_disname.get(i);
				String compid = null;
				Object compidflag = fieldname_disname[2];
				if(!(fieldname_disname[2]==null)&&(compidflag.toString()).equals("0")&&(!(fieldname_disname[3]==null))&&(!(obj[i]==null))){
					//根据数据字典项（typecode）以及数据字典code来匹配code对应的显示名（name）
					Map<String,String> map_cname = dicmap.get(fieldname_disname[3].toString());
					String dicname = map_cname.get(obj[i].toString());
					obj[i] = dicname;//将数据字典code替换成数据字典name

				}
				if (obj[i] == null) {
					cell.setCellValue("");
				} else {
					cell.setCellValue(obj[i].toString());
				}
			}
		}
	}
	/**
	 * web端浏览器导出
	 * 默认导出到浏览器下载文件的位置
	 * */
	public static void ExportWithResponse(String sheetName, String titleName,  
            String fileName, int columnNumber, int[] columnWidth,  
            String[] columnName, List<Object[]> dataList,  
            HttpServletResponse response) throws Exception {  
        if (columnNumber == columnWidth.length&& columnWidth.length == columnName.length) {  
            // 第一步，创建一个webbook，对应一个Excel文件  
            HSSFWorkbook wb = new HSSFWorkbook();  
            // 第二步，在webbook中添加一个sheet,对应Excel文件中的sheet  
            HSSFSheet sheet = wb.createSheet(sheetName);  
            // sheet.setDefaultColumnWidth(15); //统一设置列宽  
            for (int i = 0; i < columnNumber; i++)   
            {  
                for (int j = 0; j <= i; j++)   
                {  
                    if (i == j)   
                    {  
                        sheet.setColumnWidth(i, columnWidth[j] * 256); // 单独设置每列的宽  
                    }  
                }  
            }  
            // 创建第0行 也就是标题  
            HSSFRow row1 = sheet.createRow((int) 0);  
            row1.setHeightInPoints(30);// 设备标题的高度  
            // 第三步创建标题的单元格样式style2以及字体样式headerFont1  
            HSSFCellStyle style2 = wb.createCellStyle();  
            style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);  
            style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);  
            style2.setFillForegroundColor(HSSFColor.LIGHT_TURQUOISE.index);  
            style2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);  
            HSSFFont headerFont1 = (HSSFFont) wb.createFont(); // 创建字体样式  
            headerFont1.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD); // 字体加粗  
            headerFont1.setFontName("黑体"); // 设置字体类型  
            headerFont1.setFontHeightInPoints((short) 15); // 设置字体大小  
            style2.setFont(headerFont1); // 为标题样式设置字体样式  
  
            HSSFCell cell1 = row1.createCell(0);// 创建标题第一列  
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0,  
                    columnNumber - 1)); // 合并列标题  
            cell1.setCellValue(titleName); // 设置值标题  
            cell1.setCellStyle(style2); // 设置标题样式  
  
            // 创建第1行 也就是表头  
            HSSFRow row = sheet.createRow((int) 1);  
            row.setHeightInPoints(20);// 设置表头高度  
  
            // 第四步，创建表头单元格样式 以及表头的字体样式  
            HSSFCellStyle style = wb.createCellStyle();  
            style.setWrapText(true);// 设置自动换行  
            style.setAlignment(HSSFCellStyle.ALIGN_CENTER);  
            style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER); // 创建一个居中格式  
  
            style.setBottomBorderColor(HSSFColor.BLACK.index);  
            style.setBorderBottom(HSSFCellStyle.BORDER_THIN);  
            style.setBorderLeft(HSSFCellStyle.BORDER_THIN);  
            style.setBorderRight(HSSFCellStyle.BORDER_THIN);  
            style.setBorderTop(HSSFCellStyle.BORDER_THIN);  
  
            HSSFFont headerFont = (HSSFFont) wb.createFont(); // 创建字体样式  
            headerFont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD); // 字体加粗  
            headerFont.setFontName("黑体"); // 设置字体类型  
            headerFont.setFontHeightInPoints((short) 10); // 设置字体大小  
            style.setFont(headerFont); // 为标题样式设置字体样式  
  
            // 第四.一步，创建表头的列  
            for (int i = 0; i < columnNumber; i++)   
            {  
                HSSFCell cell = row.createCell(i);  
                cell.setCellValue(columnName[i]);  
                cell.setCellStyle(style);  
            }  
  
            // 第五步，创建单元格，并设置值  
         // 为数据内容设置特点新单元格样式2 自动换行 上下居中左右也居中  
            HSSFCellStyle zidonghuanhang2 = wb.createCellStyle();  
            zidonghuanhang2.setWrapText(true);// 设置自动换行  
            zidonghuanhang2  
                    .setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER); // 创建一个上下居中格式  
            zidonghuanhang2.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 左右居中  

            // 设置边框  
            zidonghuanhang2.setBottomBorderColor(HSSFColor.BLACK.index);  
            zidonghuanhang2.setBorderBottom(HSSFCellStyle.BORDER_THIN);  
            zidonghuanhang2.setBorderLeft(HSSFCellStyle.BORDER_THIN);  
            zidonghuanhang2.setBorderRight(HSSFCellStyle.BORDER_THIN);  
            zidonghuanhang2.setBorderTop(HSSFCellStyle.BORDER_THIN);  
            for (int i = 0; i < dataList.size(); i++)   
            {  
                row = sheet.createRow((int) i + 2);   
                HSSFCell datacell = null;  
                for (int j = 0; j < columnNumber; j++)   
                {  
                    datacell = row.createCell(j);  
                    datacell.setCellValue(""+dataList.get(i)[j]);  
                    datacell.setCellStyle(zidonghuanhang2);  
                }  
            }  
  
            // 第六步，将文件存到浏览器设置的下载位置  
            String filename = fileName + ".xls";  
            response.setContentType("application/ms-excel;charset=UTF-8");  
            response.setHeader("Content-Disposition", "attachment;filename="  
                    .concat(String.valueOf(URLEncoder.encode(filename, "UTF-8"))));  
            OutputStream out = response.getOutputStream();  
            try {  
                wb.write(out);// 将数据写出去  
                String str = "导出" + fileName + "成功！";  
                System.out.println(str);  
            } catch (Exception e) {  
                e.printStackTrace();  
                String str1 = "导出" + fileName + "失败！";  
                System.out.println(str1);  
            } finally {  
                out.close();  
            }  
  
        } else {  
            System.out.println("列数目长度名称三个数组长度要一致");  
        }  
  
    }  
}
