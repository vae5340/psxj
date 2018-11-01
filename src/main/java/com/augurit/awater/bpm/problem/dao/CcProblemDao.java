package com.augurit.awater.bpm.problem.dao;

import com.augurit.awater.bpm.problem.convert.CcProblemConvertor;
import com.augurit.awater.bpm.problem.entity.CcProblem;
import com.augurit.awater.bpm.problem.web.form.CcProblemForm;
import com.augurit.awater.common.hibernate.dao.BaseDao;
import org.springframework.stereotype.Repository;


@Repository
public class CcProblemDao extends BaseDao<CcProblem, Long> {

	/**
	 * 获取CCPROBLEMform对象
	 * @param id
	 * @return
	 */
	public CcProblemForm getForm(Long id){
		if(id == null)
			return null;
		CcProblem entity = this.get(id);
		return CcProblemConvertor.convertVoToForm(entity);
	}
	
	/**
	 * 保存CCPROBLEM
	 * @param form
	 */
	public void save(CcProblemForm form){
		if(form != null){
			CcProblem entity = null;
			
			//准备VO对象
			if(form.getId() != null){
				entity = this.get(form.getId());
			}
			else{
				entity = new CcProblem();
			}
			//属性值转换
			CcProblemConvertor.convertFormToVo(form, entity);
			
			//保存
			this.save(entity);
			this.flush();
			
			//回填ID属性值
			form.setId(entity.getId());
		}
	}

}