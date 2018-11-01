package com.augurit.awater.util;

public class ExceptionUtils {
    public ExceptionUtils() {
    }

    public static RuntimeException unchecked(Exception e) {
        return e instanceof RuntimeException ? (RuntimeException)e : new RuntimeException(e.getMessage(), e);
    }
}
