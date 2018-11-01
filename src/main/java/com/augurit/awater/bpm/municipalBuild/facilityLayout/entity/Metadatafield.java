package com.augurit.awater.bpm.municipalBuild.facilityLayout.entity;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

@Entity
@Table(name = "DRI_METADATAFIELD")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Metadatafield implements java.io.Serializable {
	
	// 属性
	
	private Long fieldid;
	
	private String fieldname;

	private String belongmetacodename;

	private String belongmetacodeitem;

	private String displayname;
	
	private Long tableid;
	
	private Long classpropertyid;
	
	private String fielddesc;
	
	private Long datatypeid;
	
	private String datatypename;

	private String fieldstatecode;

	private Long datatypelength;
	
	private Long nullflag;
	
	private String fieldinfo;
	
	private Long primarykeyfieldflag;
	
	private Long relatedfieldflag;
	
	private Long listfieldflag;
	
	private Long queryfieldflag;
	
	private Long displayorder;

	private String diccode;
	
	private Long patrolfieldflag;
	
	private Long componentid;
	
	private Long colspan;
	
	private Long editflag;
	
	private Long validateid;

	private String relateddiccode;

	private String relatedtablediccode;

	private String relatedtabledicname;

	private String relatedtabletypecode;
	@Id
    @Column(name = "ID")
    @SequenceGenerator(name="SEQ_METADATAFIELD", allocationSize=1)
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="SEQ_METADATAFIELD")
	private Long id;

	public Long getFieldid() {
		return this.fieldid;
	}

	public void setFieldid(Long fieldid) {
		this.fieldid = fieldid;
	}
	public String getFieldname() {
		return this.fieldname;
	}

	public void setFieldname(String fieldname) {
		this.fieldname = fieldname;
	}
	public String getDisplayname() {
		return this.displayname;
	}

	public void setDisplayname(String displayname) {
		this.displayname = displayname;
	}
	public Long getTableid() {
		return this.tableid;
	}

	public void setTableid(Long tableid) {
		this.tableid = tableid;
	}
	public Long getClasspropertyid() {
		return this.classpropertyid;
	}

	public void setClasspropertyid(Long classpropertyid) {
		this.classpropertyid = classpropertyid;
	}
	public String getFielddesc() {
		return this.fielddesc;
	}

	public void setFielddesc(String fielddesc) {
		this.fielddesc = fielddesc;
	}
	public Long getDatatypeid() {
		return this.datatypeid;
	}

	public void setDatatypeid(Long datatypeid) {
		this.datatypeid = datatypeid;
	}
	public String getDatatypename() {
		return this.datatypename;
	}

	public void setDatatypename(String datatypename) {
		this.datatypename = datatypename;
	}
	public Long getDatatypelength() {
		return this.datatypelength;
	}

	public void setDatatypelength(Long datatypelength) {
		this.datatypelength = datatypelength;
	}
	public Long getNullflag() {
		return this.nullflag;
	}

	public void setNullflag(Long nullflag) {
		this.nullflag = nullflag;
	}
	public String getFieldinfo() {
		return this.fieldinfo;
	}

	public void setFieldinfo(String fieldinfo) {
		this.fieldinfo = fieldinfo;
	}
	public Long getPrimarykeyfieldflag() {
		return this.primarykeyfieldflag;
	}

	public void setPrimarykeyfieldflag(Long primarykeyfieldflag) {
		this.primarykeyfieldflag = primarykeyfieldflag;
	}
	public Long getRelatedfieldflag() {
		return this.relatedfieldflag;
	}

	public void setRelatedfieldflag(Long relatedfieldflag) {
		this.relatedfieldflag = relatedfieldflag;
	}
	public Long getListfieldflag() {
		return this.listfieldflag;
	}

	public void setListfieldflag(Long listfieldflag) {
		this.listfieldflag = listfieldflag;
	}
	public Long getQueryfieldflag() {
		return this.queryfieldflag;
	}

	public void setQueryfieldflag(Long queryfieldflag) {
		this.queryfieldflag = queryfieldflag;
	}
	public Long getDisplayorder() {
		return this.displayorder;
	}

	public void setDisplayorder(Long displayorder) {
		this.displayorder = displayorder;
	}

	public String getDiccode() {
		return diccode;
	}

	public void setDiccode(String diccode) {
		this.diccode = diccode;
	}

	public Long getPatrolfieldflag() {
		return this.patrolfieldflag;
	}

	public void setPatrolfieldflag(Long patrolfieldflag) {
		this.patrolfieldflag = patrolfieldflag;
	}
	public Long getComponentid() {
		return this.componentid;
	}

	public void setComponentid(Long componentid) {
		this.componentid = componentid;
	}
	public Long getColspan() {
		return this.colspan;
	}

	public void setColspan(Long colspan) {
		this.colspan = colspan;
	}
	public Long getEditflag() {
		return this.editflag;
	}

	public void setEditflag(Long editflag) {
		this.editflag = editflag;
	}
	public Long getValidateid() {
		return this.validateid;
	}

	public void setValidateid(Long validateid) {
		this.validateid = validateid;
	}
	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getBelongmetacodeitem() {
		return belongmetacodeitem;
	}
	public void setBelongmetacodeitem(String belongmetacodeitem) {
		this.belongmetacodeitem = belongmetacodeitem;
	}

	public String getBelongmetacodename() {
		return belongmetacodename;
	}

	public void setBelongmetacodename(String belongmetacodename) {
		this.belongmetacodename = belongmetacodename;
	}

	public String getFieldstatecode() {
		return fieldstatecode;
	}

	public void setFieldstatecode(String fieldstatecode) {
		this.fieldstatecode = fieldstatecode;
	}

	public String getRelateddiccode() {
		return relateddiccode;
	}

	public void setRelateddiccode(String relateddiccode) {
		this.relateddiccode = relateddiccode;
	}

	public String getRelatedtablediccode() {
		return relatedtablediccode;
	}

	public void setRelatedtablediccode(String relatedtablediccode) {
		this.relatedtablediccode = relatedtablediccode;
	}

	public String getRelatedtabledicname() {
		return relatedtabledicname;
	}

	public void setRelatedtabledicname(String relatedtabledicname) {
		this.relatedtabledicname = relatedtabledicname;
	}

	public String getRelatedtabletypecode() {
		return relatedtabletypecode;
	}

	public void setRelatedtabletypecode(String relatedtabletypecode) {
		this.relatedtabletypecode = relatedtabletypecode;
	}
}
