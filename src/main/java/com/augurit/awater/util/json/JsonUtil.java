package com.augurit.awater.util.json;

import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.CommUtil;
import org.codehaus.jackson.map.ObjectMapper;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

public class JsonUtil {
    public static void renderJson(Object data, HttpServletResponse servletResponse, String... headers) {
        renderJson(JsonUtils.toJson(data), servletResponse, headers);
    }

    public static String toJson(Object data) {
        return JsonUtils.toJson(data);
    }

    public static void renderJson(String string, HttpServletResponse servletResponse, String... headers) {
        CommUtil.render("application/json", string, servletResponse, headers);
    }

    public static void extRenderSuccess(HttpServletResponse servletResponse) {
        renderJson("{\"success\":true}", servletResponse, new String[0]);
    }

    public static void extRenderSuccess(String message,HttpServletResponse servletResponse) {
        if (message != null) {
            renderJson("{\"success\":true,\"message\":\"" + message.replaceAll("\r?\n", "").replace("\"", "") + "\"}", servletResponse, new String[0]);
        } else {
            extRenderSuccess(servletResponse);
        }

    }

    public static void extRenderGridJson(Page page, HttpServletResponse servletResponse) {
        if (page != null) {
            if (page.getResult() == null) {
                page.setResult(new ArrayList(1));
            }

            renderJson(toJson(page), servletResponse,new String[0]);
        } else {
            renderJson((String)null,servletResponse, new String[0]);
        }

    }

    private static ObjectMapper mapper = new ObjectMapper();

    public static String getJsonString(Object object) {
        String jsonString = null;

        try {
            jsonString = mapper.writeValueAsString(object);
            return jsonString;
        } catch (IOException var3) {
            throw new IllegalArgumentException(var3);
        }
    }
}
