package com.augurit.awater.bpm.xcyhLayout.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.augurit.awater.bpm.common.entity.WfPageElement;
import com.augurit.awater.bpm.xcyhLayout.convert.WfTemplateViewFieldRefConvertor;
import com.augurit.awater.bpm.xcyhLayout.dao.WfTemplateViewFieldRefDao;
import com.augurit.awater.bpm.xcyhLayout.entity.WfTemplateElementRef;
import com.augurit.awater.bpm.xcyhLayout.entity.WfTemplateViewFieldRef;
import com.augurit.awater.bpm.xcyhLayout.service.IWfTemplateViewFieldRefService;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewFieldRefForm;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewFieldRefShowForm;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.augurit.awater.util.file.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.common.page.Page;

import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
public class WfTemplateViewFieldRefServiceImpl implements IWfTemplateViewFieldRefService {

	@Autowired
	private WfTemplateViewFieldRefDao wfTemplateViewFieldRefDao;

	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public WfTemplateViewFieldRefForm get(Long id) {
		WfTemplateViewFieldRef entity = wfTemplateViewFieldRefDao.get(id);
		return WfTemplateViewFieldRefConvertor.convertVoToForm(entity);
	}

	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		wfTemplateViewFieldRefDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(WfTemplateViewFieldRefForm... forms) {
		if(forms != null)
			for(WfTemplateViewFieldRefForm form : forms)
				this.save(form);
	}

	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(WfTemplateViewFieldRefForm form){

		if(form != null){
			WfTemplateViewFieldRef entity = null;

			//准备VO对象
			if(form != null && form.getId() != null){
				entity = wfTemplateViewFieldRefDao.get(form.getId());
			}else{
				entity = new WfTemplateViewFieldRef();
			}

			//属性值转换
			WfTemplateViewFieldRefConvertor.convertFormToVo(form, entity);

			//保存
			wfTemplateViewFieldRefDao.save(entity);

			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<WfTemplateViewFieldRefForm> search(Page<WfTemplateViewFieldRefForm> page, WfTemplateViewFieldRefForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from WfTemplateViewFieldRef ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();

		// 查询条件
		if(form != null){

		}

		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));

		// 执行分页查询操作
		Page pg = wfTemplateViewFieldRefDao.findPage(page, hql.toString(), values);

		// 转换为Form对象列表并赋值到原分页对象中
		List<WfTemplateViewFieldRefForm> list = WfTemplateViewFieldRefConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<WfTemplateViewFieldRefForm> search(Page<WfTemplateViewFieldRefForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<WfTemplateViewFieldRef> pg = wfTemplateViewFieldRefDao.findPage(page, filters);

		// 转换为Form对象列表并赋值到原分页对象中
		List<WfTemplateViewFieldRefForm> list = WfTemplateViewFieldRefConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	@Override
	public List getWfTemplateViewFieldRefData(HttpServletRequest request) {
		String templateid = request.getParameter("templateid");
		String nodeid = request.getParameter("id");
		List WfTemplateViewFieldlist = new ArrayList();

		//查询所有字段
		String hql_elementid = "from WfTemplateElementRef where 1 =1 and templateId = "+templateid;
		List<WfTemplateElementRef> wftemplateelementref = wfTemplateViewFieldRefDao.find(hql_elementid);
		String elementids_left = "";
		if (wftemplateelementref.size()!=0){
			for (int i=0;i<wftemplateelementref.size();i++){
				elementids_left += wftemplateelementref.get(i).getElementId()+",";
			}
			elementids_left =  elementids_left.substring(0,elementids_left.length()-1);
			String hql_wfpageelement_left = "from WfPageElement where 1=1 and elementType = 'field' and id in ("+elementids_left+")";
			List<WfPageElement> wfpageelement_left = wfTemplateViewFieldRefDao.find(hql_wfpageelement_left);
			WfTemplateViewFieldRefShowForm wftemplateviewfieldrefshowform = null;
			List<WfTemplateViewFieldRefShowForm> wfPageElementForms_left =new ArrayList();
			for (int k=0;k<wfpageelement_left.size();k++){
				wftemplateviewfieldrefshowform = new WfTemplateViewFieldRefShowForm();
				wftemplateviewfieldrefshowform.setElementId(wfpageelement_left.get(k).getId());
				wftemplateviewfieldrefshowform.setElementName(wfpageelement_left.get(k).getElementName());
				wftemplateviewfieldrefshowform.setTemplateId(Long.valueOf(templateid).longValue());
				wftemplateviewfieldrefshowform.setViewId(Long.valueOf(nodeid).longValue());
				wfPageElementForms_left.add(wftemplateviewfieldrefshowform);
			}
			WfTemplateViewFieldlist.add(wfPageElementForms_left);
		}

		//查询所有字段,并且分类显示。
		String sql_elementid_middle = "select t.id,t.template_id,t.view_id,t.element_id,t.display_order,t.display_flag,k.element_name from WF_TEMPLATE_VIEW_FIELD_REF t, wf_page_element k where t.element_id = k.id and t.template_id="+templateid+" and t.view_id ="+nodeid +" order by t.display_order";
		List list = wfTemplateViewFieldRefDao.createSQLQuery(sql_elementid_middle).list();
		List<WfTemplateViewFieldRefShowForm> wfPageElementForms_middle =new ArrayList();
		List<WfTemplateViewFieldRefShowForm> wfPageElementForms_right =new ArrayList();
		if(list.size()!=0){
			for (int i=0;i<list.size();i++){
				Object[] object = (Object[]) list.get(i);
				WfTemplateViewFieldRefShowForm wftemplateviewfieldrefshowform = new WfTemplateViewFieldRefShowForm();
				wftemplateviewfieldrefshowform.setId(Long.valueOf(object[0].toString()));
				wftemplateviewfieldrefshowform.setTemplateId(Long.valueOf(object[1].toString()));
				wftemplateviewfieldrefshowform.setViewId(Long.valueOf(object[2].toString()));
				wftemplateviewfieldrefshowform.setElementId(Long.valueOf(object[3].toString()));
				wftemplateviewfieldrefshowform.setDisplayOrder(Long.valueOf(object[4].toString()));
				wftemplateviewfieldrefshowform.setDisplayFlag(Long.valueOf(object[5].toString()));
				wftemplateviewfieldrefshowform.setElementName(object[6].toString());
				if(Long.valueOf(object[5].toString()) == 0){
				wfPageElementForms_middle.add(wftemplateviewfieldrefshowform);
				}else {
					wfPageElementForms_right.add(wftemplateviewfieldrefshowform);
				}
			}
			if (wfPageElementForms_middle.size()!=0){
				WfTemplateViewFieldlist.add(wfPageElementForms_middle);
			}else {
				WfTemplateViewFieldlist.add(wfPageElementForms_middle);
			}
			if(wfPageElementForms_right.size()!=0){
				WfTemplateViewFieldlist.add(wfPageElementForms_right);
			}
		}

		return WfTemplateViewFieldlist;
	}

	@Override
	public boolean saveWfTemplateViewFieldRefData(HttpServletRequest request) {
		String wftemplateviewfieldref_string = request.getParameter("middleFields");
		List<WfTemplateViewFieldRef> wftemplateviewfieldrefList = new ArrayList<WfTemplateViewFieldRef>();
		if(StringUtils.isNotBlank(wftemplateviewfieldref_string)&&!wftemplateviewfieldref_string.equalsIgnoreCase("[]")){
			JSONArray array = JSONArray.parseArray(wftemplateviewfieldref_string);
			WfTemplateViewFieldRef entity = null;
			for(int i=0;i<array.size();i++){
				JSONObject jo = array.getJSONObject(i);
				if(StringUtils.isBlank(jo.getString("id"))){
					 entity = new WfTemplateViewFieldRef();
					entity.setTemplateId(Long.valueOf(jo.getString("templateId")).longValue());
					entity.setViewId(Long.valueOf(jo.getString("viewId")));
					entity.setElementId(Long.valueOf(jo.getString("elementId")));
					entity.setDisplayOrder(Long.valueOf(jo.getString("displayOrder")));
					entity.setDisplayFlag(Long.valueOf(jo.getString("displayFlag")));
					wftemplateviewfieldrefList.add(entity);
				}else{
					entity = wfTemplateViewFieldRefDao.find(Long.valueOf(jo.getString("id")));
					entity.setDisplayFlag(Long.valueOf(jo.getString("displayFlag")));
					entity.setDisplayOrder(Long.valueOf(jo.getString("displayOrder")));
					wftemplateviewfieldrefList.add(entity);
				}
			}
			wfTemplateViewFieldRefDao.save(wftemplateviewfieldrefList);
		}
		return false;
	}

	@Override
	public boolean deleteWfTemplateViewFieldRefData(HttpServletRequest request) {
		String ids = request.getParameter("ids");
		String[] str=ids.split(",");
		Long[] longIds = new Long[str.length];
		for (int i = 0; i < str.length; i++) {
			longIds[i] = Long.valueOf(str[i]);
		}
		wfTemplateViewFieldRefDao.delete(longIds);
		return false;
	}
}