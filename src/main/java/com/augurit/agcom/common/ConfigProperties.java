package com.augurit.agcom.common;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

public class ConfigProperties {
    public static Map<String, String> CONFIGMAP = new HashMap();

    public ConfigProperties() {
    }

    public static void initConfigProperties() {
        Properties properties = new Properties();
        ConfigProperties rsfp = new ConfigProperties();
        InputStream in = rsfp.getClass().getResourceAsStream("/application.properties");
        if (in == null) {
            System.out.println("没有找到application.properties文件!");
        } else {
            try {
                properties.load(in);
                Set propertiesSet = properties.keySet();
                Iterator ite = propertiesSet.iterator();

                while(ite.hasNext()) {
                    String key = ite.next().toString();
                    CONFIGMAP.put(key, properties.getProperty(key));
                }
            } catch (IOException var14) {
                var14.printStackTrace();
            } finally {
                try {
                    if (in != null) {
                        in.close();
                    }
                } catch (Exception var13) {
                    var13.printStackTrace();
                }

            }
        }

    }

    public static String getByKey(String key) {
        return CONFIGMAP.get(key) != null ? (String)CONFIGMAP.get(key) : null;
    }
}
