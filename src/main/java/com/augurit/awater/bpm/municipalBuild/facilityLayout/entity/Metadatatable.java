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
@Table(name = "DRI_METADATATABLE")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Metadatatable implements java.io.Serializable {
	
	// 属性
	
	private Long tableid;
	
	private String tablename;
	
	private String displayname;

	private String metacodetypecode;

	private String tabledesc;
	
	private Long templateid;
	
	private Long metadatacategoryid;
	
	private String primarykeyfieldname;
	
	private String relatedfieldname;

	private Long tabletype;
	
	private Long layertype;
	
	private String tablestatecode;

	private String sequencename;

	private Long displayorder;

	private Long hasfile;

	private Long isDictionary;

	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_METADATATABLE", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_METADATATABLE")
	private Long id;

	public Long getTableid() {
		return this.tableid;
	}

	public void setTableid(Long tableid) {
		this.tableid = tableid;
	}
	public String getTablename() {
		return this.tablename;
	}

	public void setTablename(String tablename) {
		this.tablename = tablename;
	}
	public String getDisplayname() {
		return this.displayname;
	}

	public void setDisplayname(String displayname) {
		this.displayname = displayname;
	}
	public String getTabledesc() {
		return this.tabledesc;
	}

	public void setTabledesc(String tabledesc) {
		this.tabledesc = tabledesc;
	}
	public Long getTemplateid() {
		return this.templateid;
	}

	public void setTemplateid(Long templateid) {
		this.templateid = templateid;
	}
	public Long getMetadatacategoryid() {
		return this.metadatacategoryid;
	}

	public void setMetadatacategoryid(Long metadatacategoryid) {
		this.metadatacategoryid = metadatacategoryid;
	}
	public String getPrimarykeyfieldname() {
		return this.primarykeyfieldname;
	}

	public void setPrimarykeyfieldname(String primarykeyfieldname) {
		this.primarykeyfieldname = primarykeyfieldname;
	}
	public String getRelatedfieldname() {
		return this.relatedfieldname;
	}

	public void setRelatedfieldname(String relatedfieldname) {
		this.relatedfieldname = relatedfieldname;
	}
	public String getSequencename() {
		return this.sequencename;
	}

	public void setSequencename(String sequencename) {
		this.sequencename = sequencename;
	}
	public Long getDisplayorder() {
		return this.displayorder;
	}

	public void setDisplayorder(Long displayorder) {
		this.displayorder = displayorder;
	}
	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public Long getTabletype() {
		return tabletype;
	}

	public void setTabletype(Long tabletype) {
		this.tabletype = tabletype;
	}

	public Long getLayertype() {
		return layertype;
	}

	public void setLayertype(Long layertype) {
		this.layertype = layertype;
	}

	public String getMetacodetypecode() {
		return metacodetypecode;
	}

	public void setMetacodetypecode(String metacodetypecode) {
		this.metacodetypecode = metacodetypecode;
	}

	public String getTablestatecode() {
		return tablestatecode;
	}

	public void setTablestatecode(String tablestatecode) {
		this.tablestatecode = tablestatecode;
	}

	public Long getHasfile() {
		return hasfile;
	}

	public void setHasfile(Long hasfile) {
		this.hasfile = hasfile;
	}

	public Long getIsDictionary() {
		return isDictionary;
	}

	public void setIsDictionary(Long isDictionary) {
		this.isDictionary = isDictionary;
	}
}