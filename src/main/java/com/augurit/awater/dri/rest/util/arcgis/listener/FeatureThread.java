package com.augurit.awater.dri.rest.util.arcgis.listener;


import com.augurit.awater.dri.rest.util.arcgis.timer.SynchronousData;

/**
 * 异步启动
 * */
public class FeatureThread extends Thread{

    @Override
    public void run() {
        /**
         * 另开一个线程启动同步方法
         * */
        SynchronousData.syncFeature();
    }

}
