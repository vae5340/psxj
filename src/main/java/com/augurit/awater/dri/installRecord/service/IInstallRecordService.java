package com.augurit.awater.dri.installRecord.service;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.installRecord.web.form.InstallRecordForm;
import com.augurit.awater.dri.installRecord.web.form.OrgNameForm;

import java.util.List;
import java.util.Map;


public interface IInstallRecordService extends ICrudService<InstallRecordForm, Long> {
	/**
	 * 根据用户统计0
	 * */
    List<OrgNameForm> getStaticByOrgId(String orgId, boolean roleType);
	/**
	 * 查找某区安装的用户
	 */
    Page<InstallRecordForm> searchForUser(Page<InstallRecordForm> page, InstallRecordForm form);
	
	/**
	 * 根据机构ID查找 用户列表
	 */
    List<OpuOmUser> getUsesByOrgId(String OrgId, boolean roleType);

	List<OpuOmUserInfo> getUsesInfoByOrgId(String OrgId, boolean roleType);

	/**
	 * 获取所有的用户
	 */
    List<OpuOmUser> getAllUses(boolean roleType) ;
	
	/**
	 * 根据登录人或设备id查找
	 * */
    List<InstallRecordForm> getByLnOrDc(String loginName, String devicecode);
	
	/**
	 * 获取安装用户
	 * */
    List<InstallRecordForm> getListByPOrgId(String porgId, boolean roleType) ;
	/**
	 * 获取第四级机构记录
	 * */
    OpuOmOrg getOmorgByOrgName(String OrgName) ;
	
	/**
	 * 获取5以后级别
	 * */
    OpuOmOrg getByOrgNameUp4(String OrgName) ;
	
	/**
	 * 获取安装或未安装所有的用户
	 */
    List<OpuOmUser> getUsesByIsinstalled(boolean flag, String OrgId, boolean roleType) ;
	
	/**
	 * 根据登录用户删除
	 * **/
    void deleteByLoginName(String loginName);
	
	/***
	 * 查找区以外的人员
	 * */
    List<OpuOmUserInfo> getOverAreaUserInfo();

	List<OpuOmUser> getOverAreaUser();
	
	/***
	 * 查找区以外的人员
	 * */
    List<OpuOmUser> getOverAreaUserInstalled(Boolean isInstalled);
	
	/**
	 * 获取区外领导安装率
	 * */
    String getOverUserRate(Boolean roleType);
	
	/***
	 * 根据用户找到机构
	 * */
    String getOrgByUserId(Long userId);
	
	/**
	 * 根据loginName获取队伍和直属机构、业务单位
	* */
    Map<String,String> getOrgForAppInstall(String loginName);
}