package com.augurit.agcom.gx;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import java.io.IOException;
import java.io.OutputStream;

/**
 * @author 王海锋
 * @version 1.0
 * @Title: 系统
 * @Description:
 * @Copyright: Copyright (c) 2014
 * @Company:
 * @CreatedTime:2014-4-24 上午11:53:41
 */

public class ExcelOper {

    private HSSFWorkbook workbook;
    private HSSFSheet cursheet;
    private HSSFRow currow;

    public HSSFWorkbook createWorkbook() {
        workbook = new HSSFWorkbook();
        cursheet = workbook.createSheet("Sheet1");
        return workbook;
    }

    public HSSFSheet createSheet(String title) {
        cursheet = workbook.createSheet(title);
        return cursheet;
    }

    public HSSFSheet getSheet(int i) {
        return workbook.getSheetAt(i);
    }

    public HSSFRow createRow(int r) {
        currow = cursheet.createRow(r);
        return currow;
    }

    public void addRowCells(String[] cells) {
        addRowCells(cells, currow);
    }

    public void addRowCells(String[] cells, HSSFRow row) {
        for (int c = 0; c < cells.length; c++) {
            HSSFCell cell = row.createCell(c);
            cell.setCellValue(cells[c]);
        }
    }

    public void setCursheet(HSSFSheet cursheet) {
        this.cursheet = cursheet;
    }

    public void write(OutputStream out) throws IOException {
        workbook.write(out);
    }

    public HSSFRow getRow(int i) {
        return cursheet.getRow(i);
    }
}
