package com.augurit.awater.dri.rest.util.arcgis.form;

/**
 * Created by HOWS on 2018-07-02.
 */
public class FeatureParamsForm {
    //默认配置
    private String f="json";
    private String where;//查询条件
    private Long objectIds;
    private Long time;
    private String geometry;
    private String geometryType;
    private String inSR;
    private String spatialRel;
    private String relationParam;
    private String outFields;
    private Boolean returnGeometry=false;
    private String maxAllowableOffset;
    private String geometryPrecision;
    private String outSR;
    private String gdbVersion;
    private String returnDistinctValues;
    private String returnIdsOnly;
    private String returnCountOnly;
    private String orderByFields;
    private String groupByFieldsForStatistics;
    private String outStatistics;
    private String returnZ;
    private String returnM;

    public String getF() {
        return f;
    }

    public void setF(String f) {
        this.f = f;
    }

    public String getWhere() {
        return where;
    }

    public void setWhere(String where) {
        this.where = where;
    }

    public Long getObjectIds() {
        return objectIds;
    }

    public void setObjectIds(Long objectIds) {
        this.objectIds = objectIds;
    }

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    public String getGeometry() {
        return geometry;
    }

    public void setGeometry(String geometry) {
        this.geometry = geometry;
    }

    public String getGeometryType() {
        return geometryType;
    }

    public void setGeometryType(String geometryType) {
        this.geometryType = geometryType;
    }

    public String getInSR() {
        return inSR;
    }

    public void setInSR(String inSR) {
        this.inSR = inSR;
    }

    public String getSpatialRel() {
        return spatialRel;
    }

    public void setSpatialRel(String spatialRel) {
        this.spatialRel = spatialRel;
    }

    public String getRelationParam() {
        return relationParam;
    }

    public void setRelationParam(String relationParam) {
        this.relationParam = relationParam;
    }

    public String getOutFields() {
        return outFields;
    }

    public void setOutFields(String outFields) {
        this.outFields = outFields;
    }

    public Boolean getReturnGeometry() {
        return returnGeometry;
    }

    public void setReturnGeometry(Boolean returnGeometry) {
        this.returnGeometry = returnGeometry;
    }

    public String getMaxAllowableOffset() {
        return maxAllowableOffset;
    }

    public void setMaxAllowableOffset(String maxAllowableOffset) {
        this.maxAllowableOffset = maxAllowableOffset;
    }

    public String getGeometryPrecision() {
        return geometryPrecision;
    }

    public void setGeometryPrecision(String geometryPrecision) {
        this.geometryPrecision = geometryPrecision;
    }

    public String getOutSR() {
        return outSR;
    }

    public void setOutSR(String outSR) {
        this.outSR = outSR;
    }

    public String getGdbVersion() {
        return gdbVersion;
    }

    public void setGdbVersion(String gdbVersion) {
        this.gdbVersion = gdbVersion;
    }

    public String getReturnDistinctValues() {
        return returnDistinctValues;
    }

    public void setReturnDistinctValues(String returnDistinctValues) {
        this.returnDistinctValues = returnDistinctValues;
    }

    public String getReturnIdsOnly() {
        return returnIdsOnly;
    }

    public void setReturnIdsOnly(String returnIdsOnly) {
        this.returnIdsOnly = returnIdsOnly;
    }

    public String getReturnCountOnly() {
        return returnCountOnly;
    }

    public void setReturnCountOnly(String returnCountOnly) {
        this.returnCountOnly = returnCountOnly;
    }

    public String getOrderByFields() {
        return orderByFields;
    }

    public void setOrderByFields(String orderByFields) {
        this.orderByFields = orderByFields;
    }

    public String getGroupByFieldsForStatistics() {
        return groupByFieldsForStatistics;
    }

    public void setGroupByFieldsForStatistics(String groupByFieldsForStatistics) {
        this.groupByFieldsForStatistics = groupByFieldsForStatistics;
    }

    public String getOutStatistics() {
        return outStatistics;
    }

    public void setOutStatistics(String outStatistics) {
        this.outStatistics = outStatistics;
    }

    public String getReturnZ() {
        return returnZ;
    }

    public void setReturnZ(String returnZ) {
        this.returnZ = returnZ;
    }

    public String getReturnM() {
        return returnM;
    }

    public void setReturnM(String returnM) {
        this.returnM = returnM;
    }

    public void converVoMap(){
        
    }
}
