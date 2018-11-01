package com.augurit.awater.bpm.problem.service;

import com.augurit.agcloud.opus.common.domain.OpuAcRoleUser;
import com.augurit.agcloud.opus.common.domain.OpuOmUser;
import com.augurit.awater.bpm.problem.web.form.CcProblemForm;
import com.augurit.awater.common.page.Page;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface ICcProblemService {

	/**
	 * 根据指定主键集合批量删除CCPROBLEM
	 * @param ids 主键集合
	 */
	public void deleteCcProblems(Long... ids);

	/**
	 * 批量保存CcProblemForm对象
	 * @param forms CcProblemForm对象集合
	 */
	public void saveCcProblems(CcProblemForm... forms);

	/**
	 * 获取CcProblemForm对象
	 * @param id CCPROBLEMid
	 * @return CcProblemForm对象
	 */
	public CcProblemForm getCcProblemForm(Long id);

	/**
	 * 获取系统中所有的CCPROBLEM列表
	 * @return CcProblemForm列表
	 */
	public List<CcProblemForm> getAll();

	/**
	 * 根据分页对象和过滤条件列表进行分页条件查询
	 * @param page 分页对象
	 * @param form 查询条件
	 * @return 分页查询结果.附带结果列表及所有查询时的参数
	 */
	public Page<CcProblemForm> search(Page<CcProblemForm> page, CcProblemForm form);

	/**
	 * 修改数据
	 * @param templateId
	 * @param jsonString
	 * @return
	 */
	Boolean saveData(Long templateId, String jsonString);

	List<OpuAcRoleUser> getTabsData(String templateCode, String roleId);

	List getFormData(Long templateId, String id, HttpServletRequest request);

	List<OpuOmUser> getJlUserByUserCode(String userCode);

	List getTableData(String keyId, String tableName);

	List getDetailData(String templateCode, String masterEntityKey);
}