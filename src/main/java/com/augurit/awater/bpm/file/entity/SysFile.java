package com.augurit.awater.bpm.file.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(
    name = "DRI_SYS_FILE"
)
@Cache(
    usage = CacheConcurrencyStrategy.READ_WRITE
)
public class SysFile implements Serializable {
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

    public SysFile() {
    }

    @Id
    @SequenceGenerator(
        name = "SEQ_SYS_FILE",
        sequenceName = "SEQ_SYS_FILE",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "SEQ_SYS_FILE"
    )
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

    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
