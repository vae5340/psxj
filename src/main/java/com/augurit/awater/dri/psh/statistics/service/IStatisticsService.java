package com.augurit.awater.dri.psh.statistics.service;


public interface IStatisticsService {
	String pshStatistics(Object[] orgArray, String type);
	String getOrgIdByOrgName(String orgName, String orgGrade, String parentOrgId);
}
