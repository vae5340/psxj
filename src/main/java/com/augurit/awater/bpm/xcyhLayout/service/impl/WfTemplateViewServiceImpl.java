package com.augurit.awater.bpm.xcyhLayout.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

//import com.augurit.asi.xcyh.businessAccepted.service.ICcProblemService;
import com.augurit.awater.bpm.common.dao.WfBusTemplateDao;
import com.augurit.awater.bpm.common.entity.WfBusTemplate;
import com.augurit.awater.bpm.xcyhLayout.convert.WfTemplateViewConvertor;
import com.augurit.awater.bpm.xcyhLayout.dao.WfTemplateViewDao;
import com.augurit.awater.bpm.xcyhLayout.entity.WfTemplateView;
import com.augurit.awater.bpm.xcyhLayout.service.IWfTemplateViewService;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewForm;
import com.augurit.awater.common.Tree;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.util.sql.HqlUtils;
import com.augurit.awater.util.file.PageUtils;
import com.augurit.awater.util.PropertyFilter;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
public class WfTemplateViewServiceImpl implements IWfTemplateViewService {

	@Autowired
	private WfTemplateViewDao wfTemplateViewDao;
	@Autowired
	private WfBusTemplateDao wfbustemplatedao;
//	@Autowired
//	private ICcProblemService ccproblemService;
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public WfTemplateViewForm get(Long id) {
		WfTemplateView entity = wfTemplateViewDao.get(id);
		return WfTemplateViewConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		wfTemplateViewDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(WfTemplateViewForm... forms) {
		if(forms != null)
			for(WfTemplateViewForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(WfTemplateViewForm form){
		
		if(form != null){
			WfTemplateView entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = wfTemplateViewDao.get(form.getId());
			}else{
				entity = new WfTemplateView();
			}
			
			//属性值转换
			WfTemplateViewConvertor.convertFormToVo(form, entity);
			
			//保存
			wfTemplateViewDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<WfTemplateViewForm> search(Page<WfTemplateViewForm> page, WfTemplateViewForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from WfTemplateView ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = wfTemplateViewDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<WfTemplateViewForm> list = WfTemplateViewConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<WfTemplateViewForm> search(Page<WfTemplateViewForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<WfTemplateView> pg = wfTemplateViewDao.findPage(page, filters);

		// 转换为Form对象列表并赋值到原分页对象中
		List<WfTemplateViewForm> list = WfTemplateViewConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	@Override
	public List<Tree> getWfTemplateViewTree(int rootid, HttpServletRequest request) {
		String templateid = request.getParameter("templateid");
		String sql = "select templateid,viewdisplayname,id from " +
				"dri_wf_template_view where 1=1 and templateid in ("+0+","+templateid+") ORDER BY displayorder";
		// 查询条件
		SQLQuery query = wfTemplateViewDao.createSQLQuery(sql);
		query.addScalar("templateid", LongType.INSTANCE)
				.addScalar("viewdisplayname", StringType.INSTANCE)
				.addScalar("id", LongType.INSTANCE);
		query.setResultTransformer(Transformers.aliasToBean(WfTemplateViewForm.class));
		List<WfTemplateViewForm> list = query.list();
		Map<Integer, Tree> treelist = new HashMap<Integer, Tree>();
		List<Tree> rlt = new ArrayList<Tree>();
		Tree tree = null;
		WfTemplateViewForm wftemplateviewform = null;
		Tree parent = null;
		for (int i = 0; i < list.size(); i++) {
			wftemplateviewform = list.get(i);
			tree = new Tree();
			Long id = wftemplateviewform.getId();
			tree.setId(wftemplateviewform.getId().intValue());
			tree.setName(wftemplateviewform.getViewdisplayname());
			tree.setTemplateid(templateid.toString());
			if (id==0) {
				tree.setIconCls("icon-root");
				tree.setIconSkin("icon_root");
			} else {
				tree.setIconCls("icon-leaf");
				tree.setIconSkin("icon_leaf");
			}
			parent = treelist.get(0);
			if (parent != null) {
				parent.getChildren().add(tree);
			} else {
				rlt.add(tree);
			}
			treelist.put(wftemplateviewform.getTemplateid().intValue(), tree);
		}
		return rlt;
	}

	@Override
	public List<WfBusTemplate> getWfBusTemplateData() {
		String hql = "from WfBusTemplate where 1=1";
		List<WfBusTemplate> list_result = wfbustemplatedao.find(hql);
		return list_result;
	}

	@Override
	public List<WfTemplateView> getWfTemplateViewData(HttpServletRequest request) {
		String wftemplateviewid = request.getParameter("wftemplateviewid");
		String hql = "from WfTemplateView ps where 1=1";
		if(StringUtils.isNotBlank(wftemplateviewid)){
			hql = hql +" and ps.id = "+wftemplateviewid;
		}
		List<WfTemplateView> list  = wfTemplateViewDao.find(hql);
		return list;
	}



	@Override
	public boolean saveWfTemplateViewData(HttpServletRequest request) {
		String id = request.getParameter("id");
		String viewdisplayname = request.getParameter("viewdisplayname");
		String viewname = request.getParameter("viewname");
		String viewtype = request.getParameter("viewtype");
		String templateid = request.getParameter("templateid");
		String filterconditionssql = request.getParameter("filterconditionssql");
		WfTemplateView entity = null;
		if(StringUtils.isNotBlank(id)){
			entity = wfTemplateViewDao.get(Long.valueOf(id).longValue());
		}else{
			entity = new WfTemplateView();
			String sql = "select max(id) as  maxId from " +
					"DRI_WF_TEMPLATE_VIEW where 1=1";
			String sql2 = "select max(displayorder) as  maxId2 from " +
					"DRI_WF_TEMPLATE_VIEW where 1=1";
			SQLQuery query2 = wfTemplateViewDao.createSQLQuery(sql2);
			query2.addScalar("maxId2", LongType.INSTANCE);
			Long maxId2 = (Long) query2.uniqueResult();
			entity.setDisplayorder(maxId2 + 1);
		}
		entity.setViewname(viewname);
		entity.setViewtype(viewtype);
		entity.setTemplateid(Long.valueOf(templateid).longValue());
		entity.setViewdisplayname(viewdisplayname);
		entity.setFilterconditionssql(filterconditionssql);
		wfTemplateViewDao.save(entity);
		return true;
	}

	@Override
	public boolean delWftemplateviewData(HttpServletRequest request) {
		String id = request.getParameter("wftemplateviewid");
		wfTemplateViewDao.delete(Long.valueOf(id).longValue());
		return true;
	}

	/**
	 * 获取过滤字段
	 * @param request
	 * @return
	 */
	@Override
	public List getFields(HttpServletRequest request) {
		String templateid = request.getParameter("templateid");
		WfBusTemplate wfBusTemplate = new WfBusTemplate();
		wfBusTemplate = wfbustemplatedao.find(Long.valueOf(templateid));

//		List list = ccproblemService.getFieldsAndDicList(wfBusTemplate);
//		return list;
		return null;
	}
}