package  com.augurit.awater.util.pipe;

import com.augurit.agcom.common.ConfigProperties;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;

/**
 * 读取管线配置文件pipeConfig.properties
 *
 * @author cannel
 */
public class PipeConfigProperties {
    public static Map<String, String> CONFIGMAP = new HashMap<String, String>();

    /**
     * 是否初始化
     */
    private static boolean isInit = false;

    /**
     * 从配置文件中获取配置的路径信息
     *
     * @return
     * @throws Exception
     */
    public static void initConfigProperties() throws Exception {
        Properties properties = new Properties();
        ConfigProperties rsfp = new ConfigProperties();
        InputStream in = rsfp.getClass().getResourceAsStream(
                "/psxj.properties.properties");
        BufferedReader bf = new BufferedReader(new InputStreamReader(in,
                "UTF-8"));

        if (in == null) {
            System.out.println("没有找到pipeConfig.properties文件!");
        } else {
            try {
                properties.load(bf);
                Set propertiesSet = properties.keySet();
                Iterator ite = propertiesSet.iterator();
                while (ite.hasNext()) {
                    String key = ite.next().toString();
                    CONFIGMAP.put(key, properties.getProperty(key));
                }
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    if (in != null) {
                        in.close();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 通过KEY获取到具体的配置信息
     *
     * @param key
     * @return
     * @throws Exception
     */
    public static String getByKey(String key) throws Exception {
        synchronized (PipeConfigProperties.class) {
            if (isInit == false) {
                initConfigProperties();
                isInit = true;
            }
        }

        if (PipeConfigProperties.CONFIGMAP.get(key) != null) {
            return PipeConfigProperties.CONFIGMAP.get(key);
        }
        return null;
    }
}
