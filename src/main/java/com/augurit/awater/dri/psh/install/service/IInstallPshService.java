package com.augurit.awater.dri.psh.install.service;

import java.util.List;
import java.util.Map;

import com.augurit.agcloud.common.service.ICrudService;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.awater.dri.installRecord.web.form.OrgNameForm;
import com.augurit.awater.dri.psh.install.web.form.PshInstallRecordForm;
import org.springside.modules.orm.Page;


public interface IInstallPshService extends ICrudService<PshInstallRecordForm, Long> {
	/**
	 * 根据用户统计0
	 * *//*
	public abstract List<OrgNameForm> getStaticByOrgId(String orgId, boolean roleType);
	*//**
	 * 查找某区安装的用户
	 *//*
	public Page<PshInstallRecordForm> searchForUser(Page<PshInstallRecordForm> page, PshInstallRecordForm form);
	
	*//**
	 * 根据机构ID查找 用户列表
	 *//*
	public List<OpuOmUserInfo> getUsesByOrgId(String OrgId, boolean roleType);
	
	*//**
	 * 获取所有的用户
	 *//*
	public List<OpuOmUserInfo> getAllUses(boolean roleType) ;
	
	*//**
	 * 根据登录人或设备id查找
	 * *//*
	public List<PshInstallRecordForm> getByLnOrDc(String loginName, String devicecode);
	
	*//**
	 * 获取安装用户
	 * *//*
	public List<PshInstallRecordForm> getListByPOrgId(String porgId, boolean roleType) ;
	*//**
	 * 获取第四级机构记录
	 * *//*
	public OpuOmOrg getOmorgByOrgName(String OrgName) ;
	
	*//**
	 * 获取5以后级别
	 * *//*
	public OpuOmOrg getByOrgNameUp4(String OrgName) ;
	
	*//**
	 * 获取安装或未安装所有的用户
	 *//*
	public List<OpuOmUserInfo> getUsesByIsinstalled(boolean flag, Long OrgId, boolean roleType) ;
	
	*//**
	 * 根据登录用户删除
	 * **//*
	public void deleteByLoginName(String loginName);
	
	*//***
	 * 查找区以外的人员
	 * *//*
	public List<OpuOmUserInfo> getOverAreaUser();
	
	*//***
	 * 查找区以外的人员
	 * *//*
	public List<OpuOmUserInfo> getOverAreaUserInstalled(Boolean isInstalled);
	
	*//**
	 * 获取区外领导安装率
	 * *//*
	public String getOverUserRate(Boolean roleType);
	
	*//***
	 * 根据用户找到机构
	 * *//*
	public String getOrgByUserId(String userId);
	
	*//**
	 * 根据loginName获取队伍和直属机构、业务单位
	* *//*
	public Map<String,String> getOrgForAppInstall(String loginName);*/
}