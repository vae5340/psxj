package com.augurit.awater.dri.problem_report.diary.entity;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Entity;

//@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TrackConfigResult{

    private int trackMinLength;   //允许保存的轨迹最短路程，单位米
    private int trackMinPointAmount;   //允许保存的最少轨迹点数
    private int trackMinTime;   //允许保存的运动最短时间，单位分钟
    private int locateIntervalDis;   //定位距离间隔，单位米
    private int locateIntervalTime;  ///定位时间间隔，单位秒
    private int uploadIntervalTime;   //上传轨迹记录的间隔，单位分钟


    public int getLocateIntervalTime() {
        return locateIntervalTime;
    }

    public void setLocateIntervalTime(int locateIntervalTime) {
        this.locateIntervalTime = locateIntervalTime;
    }

    public int getLocateIntervalDis() {
        return locateIntervalDis;
    }

    public void setLocateIntervalDis(int locateIntervalDis) {
        this.locateIntervalDis = locateIntervalDis;
    }

    public int getUploadIntervalTime() {
        return uploadIntervalTime;
    }

    public void setUploadIntervalTime(int uploadIntervalTime) {
        this.uploadIntervalTime = uploadIntervalTime;
    }

    public int getTrackMinTime() {
        return trackMinTime;
    }

    public void setTrackMinTime(int trackMinTime) {
        this.trackMinTime = trackMinTime;
    }

    public int getTrackMinLength() {
        return trackMinLength;
    }

    public void setTrackMinLength(int trackMinLength) {
        this.trackMinLength = trackMinLength;
    }

    public int getTrackMinPointAmount() {
        return trackMinPointAmount;
    }

    public void setTrackMinPointAmount(int trackMinPointAmount) {
        this.trackMinPointAmount = trackMinPointAmount;
    }
}
