package com.augurit.awater.awaterMobile.monitoring.station.domain;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class HisData {
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date tm;
    private Float upz;//上水位
    private Float dwz;//下水位
    private Float chanbz;//渠箱水位
    private  Float pz;//泵坑水位
    private Float z;//水位
    private Float drp;//雨量的数据
    private Float q;//流量
    private Float jjsw;//警戒水位
    private  Float v;//流速

    public Date getTm() {
        return tm;
    }

    public void setTm(Date tm) {
        this.tm = tm;
    }

    public Float getUpz() {
        return upz;
    }

    public void setUpz(Float upz) {
        this.upz = upz;
    }

    public Float getDwz() {
        return dwz;
    }

    public void setDwz(Float dwz) {
        this.dwz = dwz;
    }

    public Float getChanbz() {
        return chanbz;
    }

    public void setChanbz(Float chanbz) {
        this.chanbz = chanbz;
    }

    public Float getPz() {
        return pz;
    }

    public void setPz(Float pz) {
        this.pz = pz;
    }

    public Float getZ() {
        return z;
    }

    public void setZ(Float z) {
        this.z = z;
    }

    public Float getDrp() {
        return drp;
    }

    public void setDrp(Float drp) {
        this.drp = drp;
    }

    public Float getQ() {
        return q;
    }

    public void setQ(Float q) {
        this.q = q;
    }

    public Float getJjsw() {
        return jjsw;
    }

    public void setJjsw(Float jjsw) {
        this.jjsw = jjsw;
    }

    public Float getV() {
        return v;
    }

    public void setV(Float v) {
        this.v = v;
    }
}
