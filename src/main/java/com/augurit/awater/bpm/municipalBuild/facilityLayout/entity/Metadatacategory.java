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
@Table(name = "DRI_METADATACATEGORY")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Metadatacategory implements java.io.Serializable {

    // 属性

    private Long metadatacategoryid;

    private String metadatacategoryname;

    private String displayname;

    private Long displayorder;

    private Long seniorid;

    private String state;
    private String belongtofacman;

    @Id
    @Column(name = "ID")
    @SequenceGenerator(name = "SEQ_METADATACATEGORY", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_METADATACATEGORY")
    private Long id;

    public Long getMetadatacategoryid() {
        return this.metadatacategoryid;
    }

    public void setMetadatacategoryid(Long metadatacategoryid) {
        this.metadatacategoryid = metadatacategoryid;
    }

    public String getMetadatacategoryname() {
        return this.metadatacategoryname;
    }

    public void setMetadatacategoryname(String metadatacategoryname) {
        this.metadatacategoryname = metadatacategoryname;
    }

    public String getDisplayname() {
        return this.displayname;
    }

    public void setDisplayname(String displayname) {
        this.displayname = displayname;
    }

    public Long getDisplayorder() {
        return this.displayorder;
    }

    public void setDisplayorder(Long displayorder) {
        this.displayorder = displayorder;
    }

    public Long getSeniorid() {
        return this.seniorid;
    }

    public void setSeniorid(Long seniorid) {
        this.seniorid = seniorid;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getBelongtofacman() {
        return belongtofacman;
    }

    public void setBelongtofacman(String belongtofacman) {
        this.belongtofacman = belongtofacman;
    }
}
