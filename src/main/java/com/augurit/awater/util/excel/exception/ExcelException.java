package  com.augurit.awater.util.excel.exception;

public class ExcelException extends Exception{
	private static final long serialVersionUID = -6396852775967142238L;
	
	private int excelErrorCode;
	private String excelErrorMsg;
	public int getExcelErrorCode() {
		return excelErrorCode;
	}
	public void setExcelErrorCode(int excelErrorCode) {
		this.excelErrorCode = excelErrorCode;
	}
	public String getExcelErrorMsg() {
		return excelErrorMsg;
	}
	public void setExcelErrorMsg(String excelErrorMsg) {
		this.excelErrorMsg = excelErrorMsg;
	}
}
