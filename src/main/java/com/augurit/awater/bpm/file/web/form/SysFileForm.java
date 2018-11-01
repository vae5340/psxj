package com.augurit.awater.bpm.file.web.form;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public class SysFileForm implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long sysFileId;
    private String fileCode;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private String filePath;
    private String fileFormat;
    private String cmp;
    private Date cdt;
    private String eemp;
    private Date edt;
    private String memo1;
    private String memo2;
    private String entity;
    private String entityId;
    private boolean isAttachmentContentChange;
    private String newFilePath;
    private String newFileName;
    private List<SysFileForm> curAttachmentList;
    private String templateCode;
    private String printTplPath;
    private String zhengwenPath;
    private String redHeadPath;

    public SysFileForm() {
    }

    public Long getSysFileId() {
        return this.sysFileId;
    }

    public void setSysFileId(Long sysFileId) {
        this.sysFileId = sysFileId;
    }

    public String getFileCode() {
        return this.fileCode;
    }

    public void setFileCode(String fileCode) {
        this.fileCode = fileCode;
    }

    public String getFileName() {
        return this.fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Long getFileSize() {
        return this.fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileType() {
        return this.fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFilePath() {
        return this.filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileFormat() {
        return this.fileFormat;
    }

    public void setFileFormat(String fileFormat) {
        this.fileFormat = fileFormat;
    }

    public String getCmp() {
        return this.cmp;
    }

    public void setCmp(String cmp) {
        this.cmp = cmp;
    }

    public Date getCdt() {
        return this.cdt;
    }

    public void setCdt(Date cdt) {
        this.cdt = cdt;
    }

    public String getEemp() {
        return this.eemp;
    }

    public void setEemp(String eemp) {
        this.eemp = eemp;
    }

    public Date getEdt() {
        return this.edt;
    }

    public void setEdt(Date edt) {
        this.edt = edt;
    }

    public String getMemo1() {
        return this.memo1;
    }

    public void setMemo1(String memo1) {
        this.memo1 = memo1;
    }

    public String getMemo2() {
        return this.memo2;
    }

    public void setMemo2(String memo2) {
        this.memo2 = memo2;
    }

    public String getEntity() {
        return this.entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public String getEntityId() {
        return this.entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getNewFilePath() {
        return this.newFilePath;
    }

    public void setNewFilePath(String newFilePath) {
        this.newFilePath = newFilePath;
    }

    public String getNewFileName() {
        return this.newFileName;
    }

    public void setNewFileName(String newFileName) {
        this.newFileName = newFileName;
    }

    public boolean getIsAttachmentContentChange() {
        return this.isAttachmentContentChange;
    }

    public void setIsAttachmentContentChange(boolean isAttachmentContentChange) {
        this.isAttachmentContentChange = isAttachmentContentChange;
    }

    public List<SysFileForm> getCurAttachmentList() {
        return this.curAttachmentList;
    }

    public void setCurAttachmentList(List<SysFileForm> curAttachmentList) {
        this.curAttachmentList = curAttachmentList;
    }

    public String getPrintTplPath() {
        return this.printTplPath;
    }

    public void setPrintTplPath(String printTplPath) {
        this.printTplPath = printTplPath;
    }

    public String getZhengwenPath() {
        return this.zhengwenPath;
    }

    public void setZhengwenPath(String zhengwenPath) {
        this.zhengwenPath = zhengwenPath;
    }

    public String getRedHeadPath() {
        return this.redHeadPath;
    }

    public void setRedHeadPath(String redHeadPath) {
        this.redHeadPath = redHeadPath;
    }

    public String getTemplateCode() {
        return this.templateCode;
    }

    public void setTemplateCode(String templateCode) {
        this.templateCode = templateCode;
    }
}
