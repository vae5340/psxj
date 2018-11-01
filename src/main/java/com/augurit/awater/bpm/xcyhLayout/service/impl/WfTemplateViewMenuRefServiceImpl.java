package com.augurit.awater.bpm.xcyhLayout.service.impl;

import java.util.*;

import com.augurit.awater.bpm.common.dao.WfPageElementDao;
import com.augurit.awater.bpm.common.entity.WfPageElement;
import com.augurit.awater.bpm.xcyhLayout.convert.WfTemplateViewMenuRefConvertor;
import com.augurit.awater.bpm.xcyhLayout.dao.WfTemplateViewMenuRefDao;
import com.augurit.awater.bpm.xcyhLayout.entity.WfTemplateViewMenuRef;
import com.augurit.awater.bpm.xcyhLayout.service.IWfTemplateViewMenuRefService;
import com.augurit.awater.bpm.xcyhLayout.web.form.WfTemplateViewMenuRefForm;
import com.augurit.awater.common.Tree;
import com.augurit.awater.util.data.DataConvert;
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
public class WfTemplateViewMenuRefServiceImpl implements IWfTemplateViewMenuRefService {

	@Autowired
	private WfTemplateViewMenuRefDao wfTemplateViewMenuRefDao;

	@Autowired
	private WfPageElementDao wfPageElementDao;
	
	/**
	 * 根据主键获取Form对象
	 */
	@Transactional(readOnly = true)
	public WfTemplateViewMenuRefForm get(Long id) {
		WfTemplateViewMenuRef entity = wfTemplateViewMenuRefDao.get(id);
		return WfTemplateViewMenuRefConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 删除Form对象列表
	 */
	public void delete(Long... ids) {
		wfTemplateViewMenuRefDao.delete(ids);
	}

	/**
	 * 保存新增或修改的Form对象列表
	 */
	public void save(WfTemplateViewMenuRefForm... forms) {
		if(forms != null)
			for(WfTemplateViewMenuRefForm form : forms)
				this.save(form);
	}
	
	/**
	 * 保存新增或修改的Form对象
	 */
	public void save(WfTemplateViewMenuRefForm form){
		
		if(form != null){
			WfTemplateViewMenuRef entity = null;
			
			//准备VO对象
			if(form != null && form.getId() != null){
				entity = wfTemplateViewMenuRefDao.get(form.getId());
			}else{
				entity = new WfTemplateViewMenuRef();
			}
			
			//属性值转换
			WfTemplateViewMenuRefConvertor.convertFormToVo(form, entity);
			
			//保存
			wfTemplateViewMenuRefDao.save(entity);
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

	/**
	 * 根据Form对象的查询条件作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<WfTemplateViewMenuRefForm> search(Page<WfTemplateViewMenuRefForm> page, WfTemplateViewMenuRefForm form) {
		// 查询语句及参数
		StringBuffer hql = new StringBuffer("from WfTemplateViewMenuRef ps where 1=1");
		Map<String,Object> values = new HashMap<String,Object>();
		
		// 查询条件
		if(form != null){
			
		}
		
		//排序
		hql.append(HqlUtils.buildOrderBy(page, "ps"));
		
		// 执行分页查询操作
		Page pg = wfTemplateViewMenuRefDao.findPage(page, hql.toString(), values);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<WfTemplateViewMenuRefForm> list = WfTemplateViewMenuRefConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}
	
	/**
	 * 根据过滤条件列表作分页查询
	 */
	@Transactional(readOnly = true)
	public Page<WfTemplateViewMenuRefForm> search(Page<WfTemplateViewMenuRefForm> page, List<PropertyFilter> filters) {
		// 按过滤条件分页查找对象
		Page<WfTemplateViewMenuRef> pg = wfTemplateViewMenuRefDao.findPage(page, filters);
		
		// 转换为Form对象列表并赋值到原分页对象中
		List<WfTemplateViewMenuRefForm> list = WfTemplateViewMenuRefConvertor.convertVoListToFormList(pg.getResult());
		PageUtils.copy(pg, list, page);
		return page;
	}

	/**
	 * 获取某一模版视图的菜单树
	 *
	 * @param request
	 * @return
	 */
	@Override
	public List<Tree> getWfTemplateViewMenuTree(HttpServletRequest request) {
		//模版id
		String templateId = request.getParameter("templateId");
		//任务视图id
		String viewId = request.getParameter("viewId");

		Long templateIdVal = DataConvert.strToLong(templateId);
		Long viewIdval = DataConvert.strToLong(viewId);

		//先查询出已经配置了的菜单的id,把id存到一个long类型的数组中
		String hql = "from WfTemplateViewMenuRef where templateId = ? and viewId = ?";
		List<WfTemplateViewMenuRef> lstWfTemplateViewMenuRef = wfTemplateViewMenuRefDao.find(hql, templateIdVal, viewIdval);
		long [] longs = new long[lstWfTemplateViewMenuRef.size()];
		for (int i = 0; i < lstWfTemplateViewMenuRef.size(); i++) {
			WfTemplateViewMenuRef wfTemplateViewMenuRef = lstWfTemplateViewMenuRef.get(i);
			longs[i] = wfTemplateViewMenuRef.getElementId();
		}
		//对数组进行排序
		Arrays.sort(longs);

		//根据模版id查询出该模版下的可配菜单
		String sql = String.format("select * from wf_page_element p where p.element_type = 'button' and p.id in " +
				"(select t.element_id from wf_template_element_ref t where t.template_id = %s)", templateId);
		List<WfPageElement> lstWfPageElement = wfPageElementDao.createSQLQuery(sql).addEntity(WfPageElement.class).list();

		List<Tree> rlt = new ArrayList();

		//构建树的最初2层
		Tree wfOperationNode = new Tree();
		wfOperationNode.setId(1);
		wfOperationNode.setName("工作流操作");
		Tree newOperationNode = new Tree();
		newOperationNode.setId(2);
		newOperationNode.setName("新增操作");
		Tree rootNode = new Tree();
		rootNode.setId(-1);
		rootNode.setName("菜单树");
		rootNode.getChildren().add(wfOperationNode);
		rootNode.getChildren().add(newOperationNode);

		//构建树的第3层
		for (WfPageElement wfPageElement : lstWfPageElement) {
			long id = wfPageElement.getId();

			Tree tree = new Tree();
			tree.setId((int) id);
			tree.setName(wfPageElement.getElementName());
			tree.setChecked(Arrays.binarySearch(longs, id) >= 0);

			//根据菜单是否公共加入不同的节点中, 1表示公共, 0表示非公共
			if ("1".equals(wfPageElement.getIsPublic()))
				wfOperationNode.getChildren().add(tree);
			else
				newOperationNode.getChildren().add(tree);
		}

		rlt.add(rootNode);

		return rlt;
	}

	/**
	 * 保存某一模版视图的对应菜单
	 *
	 * @param request
	 * @return
	 */
	@Override
	public boolean saveWfTemplateViewMenuData(HttpServletRequest request) {
		//标志：是否成功保存
		boolean hasSuccessfullySaved;

		//模版id
		String templateId = request.getParameter("templateId");
		//任务视图id
		String viewId = request.getParameter("viewId");
		//菜单id字符串, 例:2,7,9,15
		String elementIds = request.getParameter("elementIds");

		Long templateIdVal = DataConvert.strToLong(templateId);
		Long viewIdval = DataConvert.strToLong(viewId);

		//菜单id存到一个list中
		String[] elementIdArray = elementIds.split(",");
		List<String> list = Arrays.asList(elementIdArray);
		List<String> elementIdList = new ArrayList(list);

		//根据模版id、任务视图id获取已有记录
		String hql = "from WfTemplateViewMenuRef where templateId = ? and viewId = ?";
		List<WfTemplateViewMenuRef> lstWfTemplateViewMenuRef = wfTemplateViewMenuRefDao.find(hql, templateIdVal, viewIdval);

		for (WfTemplateViewMenuRef wfTemplateViewMenuRef : lstWfTemplateViewMenuRef) {
			Long elementId = wfTemplateViewMenuRef.getElementId();

			//删除已有记录中id不存在菜单id字符串中的记录
			if (!elementIdList.contains(elementId.toString())) {
				wfTemplateViewMenuRefDao.delete(wfTemplateViewMenuRef);
			} else {
				//在菜单id列表中去掉已经存在的id,避免新增重复的记录
				elementIdList.remove(DataConvert.longToStr(elementId));
			}
		}

		//新增新的记录
		for (String elementIdStr : elementIdList) {
			WfTemplateViewMenuRef wfTemplateViewMenuRef = new WfTemplateViewMenuRef();
			wfTemplateViewMenuRef.setTemplateId(templateIdVal);
			wfTemplateViewMenuRef.setViewId(viewIdval);
			wfTemplateViewMenuRef.setElementId(DataConvert.strToLong(elementIdStr));

			wfTemplateViewMenuRefDao.save(wfTemplateViewMenuRef);
		}

		hasSuccessfullySaved = true;

		return hasSuccessfullySaved;
	}
}