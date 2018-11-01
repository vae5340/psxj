package  com.augurit.awater.util;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CommUtil {
    public static void render(String contentType, String content, HttpServletResponse servletResponse, String... headers) {
        HttpServletResponse response = StringUtil.initResponseHeader(contentType, servletResponse,headers);

        try {
            response.getWriter().write(content);
            response.getWriter().flush();
        } catch (IOException var5) {
            throw new RuntimeException(var5.getMessage(), var5);
        }
    }
}
