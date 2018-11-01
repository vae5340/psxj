package com.augurit.awater.dri.utils;

public class ResultForm<T>{
    private Integer code;
    private Boolean success;
    private T data;
    private String message;

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public ResultForm(Integer code, T data, String message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }
    public ResultForm(Boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    public ResultForm(Boolean success, T data) {
        this.success = success;
        this.data = data;
    }

    public ResultForm(Integer code, T data) {
        this.code = code;
        this.data = data;
    }
    public ResultForm(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public ResultForm() {
    }
}
