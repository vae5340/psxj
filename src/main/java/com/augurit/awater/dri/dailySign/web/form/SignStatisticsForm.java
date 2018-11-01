package com.augurit.awater.dri.dailySign.web.form;

import java.util.List;

public class SignStatisticsForm {
    private String signDate;
    private String orgName;
    private Integer signNumber;
    private Integer total;
    private Double signPercentage;
    private List<ChildOrg> childOrgs;

    public String getOrgName() {
        return orgName;
    }

    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }

    public Integer getSignNumber() {
        return signNumber;
    }

    public void setSignNumber(Integer signNumber) {
        this.signNumber = signNumber;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Double getSignPercentage() {
        return signPercentage;
    }

    public void setSignPercentage(Double signPercentage) {
        this.signPercentage = signPercentage;
    }

    public List<ChildOrg> getChildOrgs() {
        return childOrgs;
    }

    public void setChildOrgs(List<ChildOrg> childOrgs) {
        this.childOrgs = childOrgs;
    }

    public String getSignDate() {
        return signDate;
    }

    public void setSignDate(String signDate) {
        this.signDate = signDate;
    }

    public static class ChildOrg{
        private String orgName;
        private Integer signNumber;
        private Integer total;
        private Double signPercentage;

        public String getOrgName() {
            return orgName;
        }

        public void setOrgName(String orgName) {
            this.orgName = orgName;
        }

        public Integer getSignNumber() {
            return signNumber;
        }

        public void setSignNumber(Integer signNumber) {
            this.signNumber = signNumber;
        }

        public Integer getTotal() {
            return total;
        }

        public void setTotal(Integer total) {
            this.total = total;
        }

        public Double getSignPercentage() {
            return signPercentage;
        }

        public void setSignPercentage(Double signPercentage) {
            this.signPercentage = signPercentage;
        }
    }
}
