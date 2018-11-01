package com.augurit.agcom.gx;

/**
 * @author 王海锋
 * @version 1.0
 * @Title: 系统
 * @Description:
 * @Copyright: Copyright (c) 2014
 * @Company:
 * @CreatedTime:2014-7-9 下午04:16:20
 */

public class LayerInfo {

    private String sourceId;
    private String owner;
    private String layerTable;
    private String keyName;
    private String layerId;
    private String srid;

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public String getKeyName() {
        return keyName;
    }

    public void setKeyName(String keyName) {
        this.keyName = keyName;
    }

    public String getLayerId() {
        return layerId;
    }

    public void setLayerId(String layerId) {
        this.layerId = layerId;
    }

    public String getSrid() {
        return srid;
    }

    public void setSrid(String srid) {
        this.srid = srid;
    }

    public String getLayerTable() {
        return layerTable;
    }

    public void setLayerTable(String layerTable) {
        this.layerTable = layerTable;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }
}
