package com.augurit.awater.bpm.municipalBuild.facilityLayout.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "DRI_METACODEITEM")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Metacodeitem implements java.io.Serializable {

    // 属性
    @Id
    @Column(name = "ID")
    @SequenceGenerator(name = "SEQ_METACODEITEM", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_METACODEITEM")
    private Long id;

    private String typecode;

    private String code;

    private String name;

    private Long status;

    private Long sortno;

    private String memo;

    private String parenttypecode;

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypecode() {
        return this.typecode;
    }

    public void setTypecode(String typecode) {
        this.typecode = typecode;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getStatus() {
        return this.status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getSortno() {
        return this.sortno;
    }

    public void setSortno(Long sortno) {
        this.sortno = sortno;
    }

    public String getMemo() {
        return this.memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public String getParenttypecode() {
        return parenttypecode;
    }

    public void setParenttypecode(String parenttypecode) {
        this.parenttypecode = parenttypecode;
    }
}