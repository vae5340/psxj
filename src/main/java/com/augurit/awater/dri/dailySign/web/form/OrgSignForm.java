package com.augurit.awater.dri.dailySign.web.form;

import java.util.List;

public class OrgSignForm {
    private String orgName;
    private Integer total;
    private String date;
    private Integer signedTotal;
    private Integer unsignedTotal;
    private List<UserSignForm> users;

    public String getOrgName() {
        return orgName;
    }

    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<UserSignForm> getUsers() {
        return users;
    }

    public void setUsers(List<UserSignForm> users) {
        this.users = users;
    }

    public Integer getSignedTotal() {
        return signedTotal;
    }

    public void setSignedTotal(Integer signedTotal) {
        this.signedTotal = signedTotal;
    }

    public Integer getUnsignedTotal() {
        return unsignedTotal;
    }

    public void setUnsignedTotal(Integer unsignedTotal) {
        this.unsignedTotal = unsignedTotal;
    }

    public static class UserSignForm{
        private String userName;
        private String phone;
        private String directOrgName;
        private String title;
        private Boolean isSigned;

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getDirectOrgName() {
            return directOrgName;
        }

        public void setDirectOrgName(String directOrgName) {
            this.directOrgName = directOrgName;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public Boolean getSigned() {
            return isSigned;
        }

        public void setSigned(Boolean signed) {
            isSigned = signed;
        }
    }
}
