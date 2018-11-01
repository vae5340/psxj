package com.augurit.awater.awaterMobile.monitoring.station.domain;

import java.util.List;

public class Station {
    private String stcd;//测站编号
    private String stnm;//测站名称
    private String mnit;//监控名
    private String sttp;//测站类型
    private String type;
    private String layerType;
    private Double x;
    private Double y;
    private  String stlc;//地址
    private String addvcd;//所在行政区
    private String stsys;//数据来源

    private java.util.List<HisData> hisDataList;

    public String getStcd() {
        return stcd;
    }

    public void setStcd(String stcd) {
        this.stcd = stcd;
    }

    public String getStnm() {
        return stnm;
    }

    public void setStnm(String stnm) {
        this.stnm = stnm;
    }

    public String getMnit() {
        return mnit;
    }

    public void setMnit(String mnit) {
        this.mnit = mnit;
    }

    public String getSttp() {
        return sttp;
    }

    public void setSttp(String sttp) {
        this.sttp = sttp;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLayerType() {
        return layerType;
    }

    public void setLayerType(String layerType) {
        this.layerType = layerType;
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public String getStlc() {
        return stlc;
    }

    public void setStlc(String stlc) {
        this.stlc = stlc;
    }

    public String getAddvcd() {
        return addvcd;
    }

    public void setAddvcd(String addvcd) {
        this.addvcd = addvcd;
    }

    public String getStsys() {
        return stsys;
    }

    public void setStsys(String stsys) {
        this.stsys = stsys;
    }

    public List<HisData> getHisDataList() {
        return hisDataList;
    }

    public void setHisDataList(List<HisData> hisDataList) {
        this.hisDataList = hisDataList;
    }
}
