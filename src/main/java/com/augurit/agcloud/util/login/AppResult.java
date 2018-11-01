package com.augurit.agcloud.util.login;

public class AppResult {
    private Boolean success;
    private String message;
    private Object content;
    public AppResult(){}

    public  AppResult(Boolean success,String message){
        this.success=  success;
        this.message = message;
    }
    public  AppResult(Boolean success,String message,Object content){
        this.success=  success;
        this.message = message;
        this.content = content;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }
}
