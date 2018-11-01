package com.augurit.awater.dri.utils;

public class Result<T>{
    private Boolean success;
    private T data;
    private String message;


    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String msg) {
        this.message = msg;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public Result(Boolean success, T data, String msg) {
        this.success = success;
        this.data = data;
        this.message = msg;
    }
    public Result(Boolean success, String msg) {
        this.success = success;
        this.message = msg;
    }
    public Result(Boolean success, T data) {
        this.success = success;
        this.data = data;
    }

    public Result() {
    }
}
