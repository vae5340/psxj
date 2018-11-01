package  com.augurit.awater.util;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;

public class StringUtil {

    public static void renderText(String text, HttpServletResponse servletResponse, String... headers) {
        render("text/plain", text, servletResponse, headers);
    }
    
    public static void render(String contentType, String content, HttpServletResponse servletResponse, String... headers) {
        HttpServletResponse response = initResponseHeader(contentType, servletResponse, headers);

        try {
            response.getWriter().write(content);
            response.getWriter().flush();
        } catch (IOException var5) {
            throw new RuntimeException(var5.getMessage(), var5);
        }
    }

    public static HttpServletResponse initResponseHeader(String contentType, HttpServletResponse response, String... headers) {
        String encoding = "utf-8";
        boolean noCache = true;
        String[] var7 = headers;
        int var6 = headers.length;

        for(int var5 = 0; var5 < var6; ++var5) {
            String header = var7[var5];
            String headerName = substringBefore(header, ":");
            String headerValue = substringAfter(header, ":");
            if (equalsIgnoreCase(headerName, "encoding")) {
                encoding = headerValue;
            } else {
                if (!equalsIgnoreCase(headerName, "no-cache")) {
                    throw new IllegalArgumentException(headerName + "不是一个合法的header类型");
                }

                noCache = Boolean.parseBoolean(headerValue);
            }
        }

        String fullContentType = contentType + ";charset=" + encoding;
        response.setContentType(fullContentType);
        if (noCache) {
            ServletUtils.setDisableCacheHeader(response);
        }

        return response;
    }

    public static String substringBefore(String str, String separator) {
        if (!isEmpty(str) && separator != null) {
            if (separator.length() == 0) {
                return "";
            } else {
                int pos = str.indexOf(separator);
                return pos == -1 ? str : str.substring(0, pos);
            }
        } else {
            return str;
        }
    }

    public static String substringAfter(String str, String separator) {
        if (isEmpty(str)) {
            return str;
        } else if (separator == null) {
            return "";
        } else {
            int pos = str.indexOf(separator);
            return pos == -1 ? "" : str.substring(pos + separator.length());
        }
    }

    public static boolean isEmpty(String str) {
        return str == null || str.length() == 0;
    }

    public static boolean equalsIgnoreCase(String str1, String str2) {
        return str1 == null ? str2 == null : str1.equalsIgnoreCase(str2);
    }

    public static boolean isBlank(CharSequence cs) {
        int strLen;
        if (cs != null && (strLen = cs.length()) != 0) {
            for(int i = 0; i < strLen; ++i) {
                if (!Character.isWhitespace(cs.charAt(i))) {
                    return false;
                }
            }

            return true;
        } else {
            return true;
        }
    }

    public static boolean isNotBlank(CharSequence cs) {
        return !isBlank(cs);
    }

    public static String[] toStringArray(Set<String> set) {
        String[] objs = (String[])null;
        if (set != null && set.size() > 0) {
            objs = (String[])set.toArray(new String[set.size()]);
        }

        return objs;
    }
}
