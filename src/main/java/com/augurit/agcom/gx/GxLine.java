package com.augurit.agcom.gx;

/**
 * @author 王海锋
 * @version 1.0
 * @Title: 系统
 * @Description:
 * @Copyright: Copyright (c) 2014
 * @Company:
 * @CreatedTime:2014-3-4 上午11:09:29
 */

public class GxLine {

    private String objid;
    private String layer;
    private Double s_deep;
    private Double e_deep;
    private Double r;//管径
    private String x;
    private String y;
    private String wkt;
    private String type;
    private String length;
    private String ownerRoad;
    private String ownerDept;
    private String usId;
    private String material;

    public Double getS_deep() {
        return s_deep;
    }

    public void setS_deep(Double s_deep) {
        this.s_deep = s_deep;
    }

    public Double getE_deep() {
        return e_deep;
    }

    public void setE_deep(Double e_deep) {
        this.e_deep = e_deep;
    }

    public Double getR() {
        return r;
    }

    public void setR(Double r) {
        this.r = r;
    }

    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x;
    }

    public String getY() {
        return y;
    }

    public void setY(String y) {
        this.y = y;
    }

    public String getObjid() {
        return objid;
    }

    public void setObjid(String objid) {
        this.objid = objid;
    }

    public String getWkt() {
        return wkt;
    }

    public void setWkt(String wkt) {
        this.wkt = wkt;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLength() {
        return length;
    }

    public void setLength(String length) {
        this.length = length;
    }

    public String getOwnerRoad() {
        return ownerRoad;
    }

    public void setOwnerRoad(String ownerRoad) {
        this.ownerRoad = ownerRoad;
    }

    public String getOwnerDept() {
        return ownerDept;
    }

    public void setOwnerDept(String ownerDept) {
        this.ownerDept = ownerDept;
    }

    public String getUsId() {
        return usId;
    }

    public void setUsId(String usId) {
        this.usId = usId;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getLayer() {
        return layer;
    }

    public void setLayer(String layer) {
        this.layer = layer;
    }

}
