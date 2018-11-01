package com.augurit.awater.dri.psh.discharge.service.impl;

import java.io.File;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.augurit.agcloud.framework.security.SecurityContext;
import com.augurit.agcloud.framework.security.user.OpuOmUser;
import com.augurit.agcloud.opus.common.domain.OpuOmOrg;
import com.augurit.agcloud.opus.common.domain.OpuOmUserInfo;
import com.augurit.agcloud.org.rest.service.IOmOrgRestService;
import com.augurit.agcloud.org.rest.service.IOmUserInfoRestService;
import com.augurit.agcom.common.ConfigProperties;
import com.augurit.awater.common.page.Page;
import com.augurit.awater.dri.installRecord.service.IInstallRecordService;
import com.augurit.awater.dri.psh.basic.web.form.ExGongan77DzMpdyForm;
import com.augurit.awater.dri.psh.discharge.arcgis.PshLxHttpArcgisClient;
import com.augurit.awater.dri.psh.discharge.convert.PshDischargerConvertor;
import com.augurit.awater.dri.psh.discharge.convert.PshReportDeleteConvertor;
import com.augurit.awater.dri.psh.discharge.dao.PshDischargerDao;
import com.augurit.awater.dri.psh.discharge.entity.PshDischarger;
import com.augurit.awater.dri.psh.discharge.service.IPshDischargerService;
import com.augurit.awater.dri.psh.discharge.service.IPshDischargerWellService;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerForm;
import com.augurit.awater.dri.psh.discharge.web.form.PshDischargerWellForm;
import com.augurit.awater.dri.psh.discharge.web.form.PshReportDeleteForm;
import com.augurit.awater.dri.psh.pshLackMark.rest.util.ParamsToFrom;
import com.augurit.awater.dri.psh.sewerageUser.service.ISewerageUserAttachmentService;
import com.augurit.awater.dri.psh.sewerageUser.web.form.SewerageUserAttachmentForm;
import com.augurit.awater.dri.utils.JsonOfForm;
import com.augurit.awater.util.PropertyFilter;
import com.augurit.awater.util.ThirdUtils;
import com.augurit.awater.util.page.PageUtils;
import com.augurit.awater.util.sql.HqlUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class PshDischargerServiceImpl implements IPshDischargerService {

    @Autowired
    private PshDischargerDao pshDischargerDao;
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private IOmUserInfoRestService omUserService;
    @Autowired
    private IOmOrgRestService omOrgService;
    @Autowired
    private IInstallRecordService installRecordService;
    @Autowired
    private ISewerageUserAttachmentService sewerageUserAttachmentService;

    /*@Autowired
	private ISewerageUserAttachmentService  sewerageUserAttachmentService;

	@Autowired
	private IInstallPshService installRecordService;

	@Autowired
	private IExShuiwuUnitHouseFormService  exShuiwuUnitHouseFormService;
	@Autowired
	private IExGongan77DzMpdyService exGongan77DzMpdyService;
	@Autowired
	private IPshMenpaiService pshMenpaiService;
	@Autowired
	private IPshReportDeleteService pshReportDeleteService;
	@Autowired
	private IExShuiwuHousebuildFormService  exShuiwuHousebuildFormService;
	@Autowired
	private IStatisticsService statisticsService;
	@Autowired
	private IExGongan76DzJlxService exGongan76DzJlxService;//街路巷
	@Autowired
	private IExGongan78DzQjwService exGongan78DzQjwService;//社区居委会
	@Autowired
	private IExGongan79DzXzjdService exGongan79DzXzjdService;//乡政街
	@Autowired
	private IExGongan80DzXzqhService exGongan80DzXzqhService;//行政规划*/
    @Autowired
    private IPshDischargerWellService pshDischargerWellService;

    /**
     * 根据主键获取Form对象
     */
    @Transactional(readOnly = true)
    public PshDischargerForm get(String id) {
        //Long userId=Long.parseLong(id);
        PshDischarger entity = pshDischargerDao.get(Long.valueOf(id));
        return PshDischargerConvertor.convertVoToForm(entity);
    }
    @Override
    @Transactional(readOnly = true)
    public PshDischargerForm get(Long id) {
        PshDischarger entity = pshDischargerDao.get(id);
        return PshDischargerConvertor.convertVoToForm(entity);
    }

    /**
     * 删除Form对象列表
     */
    public void delete(Long... ids) {
        pshDischargerDao.delete(ids);
    }

    /**
     * 保存新增或修改的Form对象列表
     */
    public void save(PshDischargerForm... forms) {
        if (forms != null)
            for (PshDischargerForm form : forms)
                this.save(form);
    }

    /**
     * 保存新增或修改的Form对象
     */
    public void save(PshDischargerForm form) {

        if (form != null) {
            PshDischarger entity = null;

            //准备VO对象
            if (form != null && form.getId() != null) {
                entity = pshDischargerDao.get(form.getId());
            } else {
                entity = new PshDischarger();
            }

            //属性值转换
            PshDischargerConvertor.convertFormToVo(form, entity);

            //保存
            pshDischargerDao.save(entity);

            //回填ID属性值
            form.setId(entity.getId());
        }
    }

    /**
     * 根据Form对象的查询条件作分页查询
     */
    @Transactional(readOnly = true)
    public Page<PshDischargerForm> search(Page<PshDischargerForm> page, PshDischargerForm form) {
        // 查询语句及参数
        StringBuffer hql = new StringBuffer("from PshDischarger ps where 1=1");
        Map<String, Object> values = new HashMap<String, Object>();

        // 查询条件
        if (form != null) {

        }

        //排序
        hql.append(HqlUtils.buildOrderBy(page, "ps"));

        // 执行分页查询操作
        Page pg = pshDischargerDao.findPage(page, hql.toString(), values);

        // 转换为Form对象列表并赋值到原分页对象中
        List<PshDischargerForm> list = PshDischargerConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    @Transactional(readOnly = true)
    @Override
    /**
     * 排水户分页查询
     * @param userForm
     * @param page
     * @param form
     * @param map
     * @return
     */
    public String getPshList(OpuOmUser userForm, Page<PshDischargerForm> page, PshDischargerForm form,
                             Map<String, Object> map) {
        JSONObject json = new JSONObject();
        Long total = 0l;
        // 查询语句及参数
        StringBuffer hql = new StringBuffer("from PshDischarger ps where 1=1 and ps.state<>'4' ");
        Map<String, Object> values = new HashMap<String, Object>();
        if(true){
        // 查询条件
        if (form != null) {
            if (StringUtils.isNotBlank(form.getParentOrgName())) {
                hql.append(" and ps.parentOrgName like :parentOrgName");
                values.put("parentOrgName", "%" + form.getParentOrgName() + "%");
            }
            if (StringUtils.isNotBlank(form.getDoorplateAddressCode())) {
                hql.append(" and ps.doorplateAddressCode = :doorplateAddressCode");
                values.put("doorplateAddressCode", form.getDoorplateAddressCode());
            }
            if (StringUtils.isNotBlank(form.getArea())) {
                hql.append(" and ps.area like :area");
                values.put("area", "%" + form.getArea() + "%");
            }
            if (StringUtils.isNotBlank(form.getTown())) {
                hql.append(" and ps.town like :town");
                values.put("town", "%" + form.getTown() + "%");
            }
            if (StringUtils.isNotBlank(form.getName())) {
                hql.append(" and ps.name like :name");
                values.put("name", "%" + form.getName() + "%");
            }
            if (StringUtils.isNotBlank(form.getAddr())) {
                hql.append(" and ps.addr like :addr");
                values.put("addr", "%" + form.getAddr() + "%");
            }
            if (StringUtils.isNotBlank(form.getState())) {
                hql.append(" and ps.state = :state");
                values.put("state", form.getState());
            }
            if (StringUtils.isNotBlank(form.getHasCert1())) {
                hql.append(" and ps.hasCert1 = :hasCert1");
                values.put("hasCert1", form.getHasCert1());
            }
            if (StringUtils.isNotBlank(form.getHasCert3())) {
                hql.append(" and ps.hasCert3 = :hasCert3");
                values.put("hasCert3", form.getHasCert3());
            }
            if (StringUtils.isNotBlank(form.getHasCert4())) {
                hql.append(" and ps.hasCert4 = :hasCert4");
                values.put("hasCert4", form.getHasCert4());
            }
            if (StringUtils.isNotBlank(form.getMarkPerson())) {
                hql.append(" and ps.markPerson  like :markPerson");
                values.put("markPerson", "%" + form.getMarkPerson() + "%");
            }
            if (StringUtils.isNotBlank(form.getDischargerType1())) {
                String[] pcode = form.getDischargerType1().split(",");
                int i = 0;
                for (String code : pcode) {
                    if (i == 0) {
                        hql.append(" and (ps.dischargerType1 = '" + code + "'");
                    } else {
                        hql.append(" or ps.dischargerType1 = '" + code + "'");
                    }
                    if (i == pcode.length - 1) {
                        hql.append(" )");
                    }
                    i++;
                }

            }
            if (StringUtils.isNotBlank(form.getDischargerType2())) {
                String[] pcode = form.getDischargerType2().split(",");
                int i = 0;
                for (String code : pcode) {
                    if (i == 0) {
                        hql.append(" and (ps.dischargerType2 like '%" + code + "%'");
                    } else {
                        hql.append(" or ps.dischargerType2 like '%" + code + "%'");
                    }
                    if (i == pcode.length - 1) {
                        hql.append(" )");
                    }
                    i++;
                }
            }
        }
        if (map != null) {
            if (map.get("lr") != null && "sh".equals(map.get("lr"))) {
                Map<String, String> m = this.getUsersFrom(userForm.getLoginName());
                if (m.containsKey("parentOrgId") && !"1063".equals(m.get("parentOrgId"))) {
                    hql.append(" and ps.parentOrgId = :parentOrgId2");
                    values.put("parentOrgId2", m.get("parentOrgId"));
                }
            }
            if (map.get("lr") != null && "true".equals(map.get("lr"))) {
                hql.append(" and ps.loginName = :loginName");
                values.put("loginName", userForm.getLoginName());
            }
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
            if (map.get("startTime") != null) {
                hql.append(" and to_char(ps.markTime,'yyyy-MM-dd') >= :startTime ");
                values.put("startTime", df.format((Date) map.get("startTime")));
            }
            if (map.get("endTime") != null) {
                hql.append(" and to_char(ps.markTime,'yyyy-MM-dd') <= :endTime");
                values.put("endTime", df.format((Date) map.get("endTime")));
            }
        }
    }

        //排序
        if(page.getOrderDir()!=null){
            //hql.append(" Order by ps."+page.getOrderDir()+" desc");
        }else{
            page.setOrderDir("desc");
            page.setOrderBy("markTime");
            //hql.append(" Order by ps.markTime desc");
        }
        //hql.append(HqlUtils.buildOrderBy(page, "ps"));

        // 执行分页查询操作
        Page pg = pshDischargerDao.findPage(page, hql.toString(), values);

        // 转换为Form对象列表并赋值到原分页对象中
        List<PshDischargerForm> list = PshDischargerConvertor.convertVoListToFormList(pg.getResult());
        List<PshDischargerForm> rows = new ArrayList<PshDischargerForm>();
        PageUtils.copy(pg, list, page);
        if (page.getResult() != null) {
            rows = page.getResult();
            total = page.getTotalItems();
        }
        json.put("rows", rows);
        json.put("total", total);
        json.put("code", 200);
        return json.toString();
    }

    /**
     * 查询详细
     **/

    public String seePsh(String id, String path) {
        JSONObject json = new JSONObject();
        try {
            PshDischargerForm form = this.get(id);
            List<SewerageUserAttachmentForm> list1 = this.getAttList(form.getId().toString(),"1",path);
            if(form.getHasCert1()!=null && form.getHasCert1().equals("1")){//营业执照
                List<SewerageUserAttachmentForm> list2 = this.getAttList(form.getId().toString(),"2",path);
                json.put("yyzz", list2);
            }
            if(form.getHasCert2()!=null && form.getHasCert2().equals("1")){//意见核准书
                List<SewerageUserAttachmentForm> list3 = this.getAttList(form.getId().toString(),"3",path);
                json.put("hzs", list3);
            }
            if(form.getHasCert3()!=null && form.getHasCert3().equals("1")){//排水许可证
                List<SewerageUserAttachmentForm> list4 = this.getAttList(form.getId().toString(),"4",path);
                json.put("psxkz", list4);
            }
            if(form.getHasCert4()!=null && form.getHasCert4().equals("1")){//排污许可证
                List<SewerageUserAttachmentForm> list5 = this.getAttList(form.getId().toString(),"5",path);
                json.put("pwxkz", list5);
            }
            //接驳井
            List<PshDischargerWellForm> wells = pshDischargerWellService.getAffList(id.toString());
            json.put("wells", wells);
            json.put("code", 200);
            json.put("form", form);
            json.put("rows", list1);
        } catch (RuntimeException e) {
            json.put("code", 500);
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return json.toString();
       /* JSONObject json = new JSONObject();
		try {
			PshDischargerForm form = this.get(id);
			//List<SewerageUserAttachmentForm> listAll = this.getAttList(form.getId().toString(),null,path);
			List<SewerageUserAttachmentForm> list1 = this.getAttList(form.getId().toString(),"1",path);
			List<SewerageUserAttachmentForm> list1 = new ArrayList<SewerageUserAttachmentForm>();
			List<SewerageUserAttachmentForm> list2 = new ArrayList<SewerageUserAttachmentForm>();
			List<SewerageUserAttachmentForm> list3 = new ArrayList<SewerageUserAttachmentForm>();
			List<SewerageUserAttachmentForm> list4 = new ArrayList<SewerageUserAttachmentForm>();
			List<SewerageUserAttachmentForm> list5 = new ArrayList<SewerageUserAttachmentForm>();
			if(listAll!=null && listAll.size()>0){
				for(SewerageUserAttachmentForm sewerageUserAttachmentForm : listAll){
					if("1".equals(sewerageUserAttachmentForm.getAttType())){
						list1.add(sewerageUserAttachmentForm);
					}else if("2".equals(sewerageUserAttachmentForm.getAttType())){
						list2.add(sewerageUserAttachmentForm);
					}else if("3".equals(sewerageUserAttachmentForm.getAttType())){
						list3.add(sewerageUserAttachmentForm);
					}else if("4".equals(sewerageUserAttachmentForm.getAttType())){
						list4.add(sewerageUserAttachmentForm);
					}else if("5".equals(sewerageUserAttachmentForm.getAttType())){
						list5.add(sewerageUserAttachmentForm);
					}
				}
				*//*json.put("yyzz", list2);
				json.put("hzs", list3);
				json.put("psxkz", list4);
				json.put("pwxkz", list5);*//*
			}
			*//*if(form.getHasCert1()!=null && form.getHasCert1().equals("1")){//营业执照
				List<SewerageUserAttachmentForm> list2 = this.getAttList(form.getId().toString(),"2",path);
				json.put("yyzz", list2);
			}
			if(form.getHasCert2()!=null && form.getHasCert2().equals("1")){//意见核准书
				List<SewerageUserAttachmentForm> list3 = this.getAttList(form.getId().toString(),"3",path);
				json.put("hzs", list3);
			}
			if(form.getHasCert3()!=null && form.getHasCert3().equals("1")){//排水许可证
				List<SewerageUserAttachmentForm> list4 = this.getAttList(form.getId().toString(),"4",path);
				json.put("psxkz", list4);
			}
			if(form.getHasCert4()!=null && form.getHasCert4().equals("1")){//排污许可证
				List<SewerageUserAttachmentForm> list5 = this.getAttList(form.getId().toString(),"5",path);
				json.put("pwxkz", list5);
			}*//*
			//接驳井
			List<PshDischargerWellForm> wells = pshDischargerWellService.getAffList(id);
			json.put("wells", wells);
			json.put("code", 200);
			json.put("form", form);
			json.put("rows", list1);
		} catch (RuntimeException e) {
			json.put("code", 500);
			e.printStackTrace();
			throw new RuntimeException(e);
		}
        return json.toString();*/
    }
	private List<SewerageUserAttachmentForm> getAttList(String dischargeId, String type, String path){
		List<SewerageUserAttachmentForm> listAtt = sewerageUserAttachmentService.getListBySewerageUserId(dischargeId);
		/*if(listAtt != null){
			String pathDir = ConfigProperties.getByKey("filePath");
			*//*pathDir = pathDir.replace("\\", "/");
            ConfigProperties.initConfigProperties();*//*
            pathDir = "D\\:/swjImg";
			for(SewerageUserAttachmentForm f:listAtt){
				String attPath = f.getAttPath().substring(4, f.getAttPath().length());
		        File file = new File(pathDir + attPath );
		        // 路径为文件且不为空则获取文件大小
		        if (file.isFile() && file.exists()) {
		        	f.setFileSize(file.length());
		        }
				if(StringUtils.isNotBlank(f.getAttPath())){
					f.setAttPath(f.getAttPath()!=null?path+f.getAttPath():null);
				}
				if(StringUtils.isNotBlank(f.getThumPath())){
					f.setThumPath(f.getThumPath()!=null?path+f.getThumPath():null);
				}
			}
		}*/
		return listAtt;
	}

    /**
     * 根据过滤条件列表作分页查询
     */
    @Transactional(readOnly = true)
    public Page<PshDischargerForm> search(Page<PshDischargerForm> page, List<PropertyFilter> filters) {
        // 按过滤条件分页查找对象
        Page<PshDischarger> pg = pshDischargerDao.findPage(page, filters);

        // 转换为Form对象列表并赋值到原分页对象中
        List<PshDischargerForm> list = PshDischargerConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    /**
     * 统计最新十条数据
     */
    @Override
    public String getLatestTenList() {
        JSONObject json = new JSONObject();
        List<Map<String, Object>> list = new ArrayList<>();
        List<Map<String, Object>> listMap = new ArrayList<>();
        try {
            //得到最新十条
            String sql = "select PARENT_ORG_NAME,DIRECT_ORG_NAME,"
                    + "TEAM_ORG_NAME,ID,MARK_PERSON,MARK_TIME,NAME,DISCHARGER_TYPE1,DISCHARGER_TYPE2 from (select * from DRI_PSH_DISCHARGER ps where ps.MARK_TIME>sysdate-3 and ps.state<>'4' order by ps.MARK_TIME desc) where ROWNUM<=10";
            List<Map<String, Object>> listPsh = jdbcTemplate.queryForList(sql);
            if (listPsh != null && listPsh.size() > 0) {
                for (Map mp : listPsh) {
                    if (mp.containsKey("MARK_TIME")) {
                        Date time = (Date) mp.get("MARK_TIME");
                        mp.put("time", time != null ? time.getTime() : null);
                        mp.remove("MARK_TIME");
                    }
                    if (mp.size() > 0) {
                        mp.put("source", "psh");
                        list.add(mp);
                    }
                }
            }
			/*if(listProblem!=null && listProblem.size()>0){
				for(Map mp :listProblem){
					if(mp.containsKey("SBSJ")){ //时间
						Date time = (Date)mp.get("SBSJ");
						mp.put("time", time!=null? time.getTime(): null);
						mp.put("MARK_PERSON", mp.get("SBR"));
						mp.put("PROBLEM_TYPE", mp.get("BHLX"));
						mp.put("LAYER_NAME", mp.get("SSLX"));
						mp.remove("SBSJ");
						mp.remove("SBR");
						mp.remove("BHLX");
						mp.remove("SSLX");
					}
					if(mp.size()>0){
						mp.put("source","problem");
						list.add(mp);
					}
				}
			}*/
            if (list.size() > 0)
                ParamsToFrom.getListDesc(list);
            for (int i = 0; i < (list.size() < 8 ? list.size() : 8); i++) {
                listMap.add(list.get(i));
            }
            json.put("data", listMap);
            json.put("code", 200);
        } catch (RuntimeException e) {
            json.put("code", 500);
            json.put("message", "系统错误");
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return json.toString();
    }

    @Override
    public Page<PshDischargerForm> search(Page<PshDischargerForm> page,
                                          PshDischargerForm form, Map<String, Object> map) {
        // 查询语句及参数
        StringBuffer hql = new StringBuffer("from PshDischarger ps where 1=1");
        StringBuffer sql = new StringBuffer("from DRI_PSH_DISCHARGER ps where 1=1");
        Map<String, Object> values = new HashMap<String, Object>();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        // 查询条件
        if (form != null) {
            if (form.getId() != null) {//上报编号
                hql.append(" and ps.id = :id");
                sql.append(" and ps.id=:id");
                values.put("id", form.getId());
            }
            if (StringUtils.isNotBlank(form.getDischargerType1())) {//行业类别大类
                hql.append(" and ps.dischargerType1 like :dischargerType1");
                sql.append(" and ps.discharger_Type1 like :dischargerType1");
                values.put("dischargerType1", "%" + form.getDischargerType1() + "%");
            }
            if (StringUtils.isNotBlank(form.getDischargerType2())) {//行业类别小类
                hql.append(" and ps.dischargerType2 like :dischargerType2");
                sql.append(" and ps.discharger_Type2 like :dischargerType2");
                values.put("dischargerType2", "%" + form.getDischargerType2() + "%");
            }
            if (StringUtils.isNotBlank(form.getMarkPersonId())) {//上报人
                hql.append(" and ps.markPersonId = :markPersonId");
                sql.append(" and ps.mark_Person_Id=:markPersonId");
                values.put("markPersonId", form.getMarkPersonId());
            }
            if (StringUtils.isNotBlank(form.getArea())) {//区
                hql.append(" and ps.area like :area");
                sql.append(" and ps.area like :area");
                values.put("area", "%" + form.getArea() + "%");
            }
            if (StringUtils.isNotBlank(form.getTown())) {//乡镇街道
                hql.append(" and ps.town like :town");
                sql.append(" and ps.town like :town");
                values.put("town", "%" + form.getTown() + "%");
            }
            if (StringUtils.isNotBlank(form.getName())) {  //排水户名称
                hql.append(" and ps.name like :name");
                sql.append(" and ps.name like :name");
                values.put("name", "%" + form.getName() + "%");
            }
            if (StringUtils.isNotBlank(form.getAddr())) {//地址
                hql.append(" and ps.addr like :addr");
                sql.append(" and ps.addr like :addr");
                values.put("addr", "%" + form.getAddr() + "%");
            }
            if (StringUtils.isNotBlank(form.getState())) {
                hql.append(" and ps.state = :state");
//				sql.append(" and ps.state = :state");
                values.put("state", form.getState());
            }
            if (StringUtils.isNotBlank(form.getParentOrgName())) {
                hql.append(" and ps.parentOrgName like :parentOrgName");
                sql.append(" and ps.parent_Org_Name like :parentOrgName");
                values.put("parentOrgName", "%" + form.getParentOrgName() + "%");
            }
            if (map != null) {
                if (map.containsKey("startTime")) {
                    hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') >= :startTime ");
                    sql.append(" and to_char(ps.mark_Time,'yyyy-MM-dd hh24:mi:ss') >= :startTime ");
                    values.put("startTime", df.format((Date) map.get("startTime")));
                }
                if (map.containsKey("endTime")) {
                    hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') <= :endTime ");
                    sql.append(" and to_char(ps.mark_Time,'yyyy-MM-dd hh24:mi:ss') <= :endTime ");
                    values.put("endTime", df.format((Date) map.get("endTime")));
                }
            }
        }

        hql.append(" order by ps.markTime desc");
        //排序
        hql.append(HqlUtils.buildOrderBy(page, "ps"));
        // 执行分页查询操作
        Page pg = pshDischargerDao.findPage(page, hql.toString(), values);

        Map<String, Object> getCheckNum = values;
        if (getCheckNum.containsKey("state")) {
            getCheckNum.remove("state");
        }
        Long noCheck = pshDischargerDao.countSqlResult(sql.toString() + " and (ps.state ='1' or ps.state ='' or ps.state is null)", getCheckNum);
        Long pass = pshDischargerDao.countSqlResult(sql.toString() + " and ps.state ='2'", getCheckNum);
        Long succ = pshDischargerDao.countSqlResult(sql.toString() + " and ps.state ='3'", getCheckNum);
        Long zc = pshDischargerDao.countSqlResult(sql.toString() + " and ps.state ='4'", getCheckNum);
        map.put("no", noCheck);
        map.put("pass", pass);
        map.put("succ", succ);
        map.put("zc", zc);
        // 转换为Form对象列表并赋值到原分页对象中
        List<PshDischargerForm> list = PshDischargerConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    @Override
    public Page<PshDischargerForm> searchCollectAll(
            Page<PshDischargerForm> page, PshDischargerForm form,
            Map<String, Object> map) {
        // 查询语句及参数
        StringBuffer hql = new StringBuffer("from PshDischarger ps where 1=1 and ps.parentOrgName not like '%广州市水务局%' and ps.state<>'4' ");
        StringBuffer sql = new StringBuffer("from DRI_Psh_Discharger ps where 1=1 and ps.parent_Org_Name not like '%广州市水务局%' and ps.state<>'4' ");
        Map<String, Object> values = new HashMap<String, Object>();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        // 查询条件
        if (form != null) {
            if (form.getId() != null) {//上报编号
                hql.append(" and ps.id = :id");
                sql.append(" and ps.id=:id");
                values.put("id", form.getId());
            }
            if (StringUtils.isNotBlank(form.getDischargerType1())) {//行业类别大类
                hql.append(" and ps.dischargerType1 like :dischargerType1");
                sql.append(" and ps.discharger_Type1 like :dischargerType1");
                values.put("dischargerType1", "%" + form.getDischargerType1() + "%");
            }
            if (StringUtils.isNotBlank(form.getDischargerType2())) {//行业类别小类
                hql.append(" and ps.dischargerType2 like :dischargerType2");
                sql.append(" and ps.discharger_Type2 like :dischargerType2");
                values.put("dischargerType2", "%" + form.getDischargerType2() + "%");
            }
            if (StringUtils.isNotBlank(form.getParentOrgId())) {
                hql.append(" and to_char(ps.parentOrgId) like :parentOrgId");
                sql.append(" and to_char(ps.parent_Org_Id) like :parentOrgId");
                values.put("parentOrgId", form.getParentOrgId());
            }
            if (StringUtils.isNotBlank(form.getParentOrgName())) {  //业主单位（区单位）
                hql.append(" and ps.parentOrgName like :parentOrgName");
                sql.append(" and ps.parent_Org_Name like :parentOrgName");
                values.put("parentOrgName", "%" + form.getParentOrgName() + "%");
            }
            if (StringUtils.isNotBlank(form.getArea())) {
                hql.append(" and ps.area like :area");
                sql.append(" and ps.area like :area");
                values.put("area", "%" + form.getArea() + "%");
            }
            if (StringUtils.isNotBlank(form.getTown())) {
                hql.append(" and ps.town like :town");
                sql.append(" and ps.town like :town");
                values.put("town", "%" + form.getTown() + "%");
            }
            if (StringUtils.isNotBlank(form.getName())) {  //挂牌编号查询
                hql.append(" and ps.name like :name");
                sql.append(" and ps.name like :name");
                values.put("name", "%" + form.getName() + "%");
            }
            if (StringUtils.isNotBlank(form.getAddr())) {
                hql.append(" and ps.addr like :addr");
                sql.append(" and ps.addr like :addr");
                values.put("addr", "%" + form.getAddr() + "%");
            }
            if (StringUtils.isNotBlank(form.getState())) {
                hql.append(" and ps.state = :state");
//				sql.append(" and ps.state = :state");
                values.put("state", form.getState());
            }
            if (StringUtils.isNotBlank(form.getParentOrgName())) {
                hql.append(" and ps.parentOrgName like :parentOrgName");
                sql.append(" and ps.parent_Org_Name like :parentOrgName");
                values.put("parentOrgName", "%" + form.getParentOrgName() + "%");
            }
            if (map != null) {
                if (map.containsKey("startTime")) {
                    hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') >= :startTime ");
                    sql.append(" and to_char(ps.mark_Time,'yyyy-MM-dd hh24:mi:ss') >= :startTime ");
                    values.put("startTime", df.format((Date) map.get("startTime")));
                }
                if (map.containsKey("endTime")) {
                    hql.append(" and to_char(ps.markTime,'yyyy-MM-dd hh24:mi:ss') <= :endTime ");
                    sql.append(" and to_char(ps.mark_Time,'yyyy-MM-dd hh24:mi:ss') <= :endTime ");
                    values.put("endTime", df.format((Date) map.get("endTime")));
                }
            }
        }

        hql.append(" order by ps.markTime desc");
        //排序
        hql.append(HqlUtils.buildOrderBy(page, "ps"));
        // 执行分页查询操作
        Page pg = pshDischargerDao.findPage(page, hql.toString(), values);

        Map<String, Object> getCheckNum = values;
        if (getCheckNum.containsKey("state")) {
            getCheckNum.remove("state");
        }
        Long noCheck = pshDischargerDao.countSqlResult(sql.toString(), getCheckNum);
        map.put("addTotal", noCheck);
        map.put("checkTotal", pg.getTotalItems() - noCheck);
        // 转换为Form对象列表并赋值到原分页对象中
        List<PshDischargerForm> list = PshDischargerConvertor.convertVoListToFormList(pg.getResult());
        PageUtils.copy(pg, list, page);
        return page;
    }

    /**
     * 本接口通用方法，得到机构信息
     */
    @Override
    public Map getUsersFrom(String loginName) {
        Map map = new HashMap();
		/*OmUserOrgForm userFrom = omUserService.getFormPsh(loginName);
		if (userFrom != null) {
			OmUserForm user = omUserService.getUser(userFrom.getUserId());
			map.put("userName",user.getUserName());
			map.put("userId",user.getUserId());
			map.put("loginName",loginName);
			List<Long> list = omOrgService.getAllParentIds(userFrom.getOrgId());
			for (Long id : list) {
				OmOrgForm omFrom = omOrgService.getOrgWithParentInfo(id);
				if (omFrom.getOrgGrade() == null)
					continue;
				if (omFrom.getOrgGrade().equals("32")) {// 区级机构
					map.put("parentOrgId",omFrom.getOrgId().toString());
					map.put("parentOrgName",omFrom.getOrgName());
				}else if(omFrom.getOrgGrade().equals("33")){ //镇街单位
					map.put("teamOrgId",omFrom.getOrgId().toString());
					map.put("teamOrgName",omFrom.getOrgName());
				}else if(omFrom.getOrgGrade().equals("34")){ //维管单位
					map.put("directOrgId",omFrom.getOrgId().toString());
					map.put("directOrgName",omFrom.getOrgName());
				}
				if(list.size()<4 && "1".equals(omFrom.getOrgGrade())){//市级机构
					if(omFrom.getParentOrgId()==null){
						map.put("parentOrgId", omFrom.getOrgId().toString());
						map.put("parentOrgName", omFrom.getOrgName());
						map.put("top", "true");
					}
				}
			}
		}*/
        return map;
    }

    /**
     * 上报统计(移动端使用)
     */
    @Override
    public Map<String, Object> countCollect(PshDischargerForm form,
                                            Map<String, Object> map) {
        Map<String, Object> mapJson = new HashMap<>();
        StringBuffer sql = new StringBuffer("from DRI_Psh_Discharger ps where 1=1 and ps.parent_Org_Name not like '%广州市水务局%' and ps.state <>'4' ");
        Map<String, Object> maps = new HashMap<>();
        if (StringUtils.isNotBlank(form.getParentOrgName())) {
            sql.append(" and ps.parent_Org_Name like :parentOrgName");
            maps.put("parentOrgName", "%" + form.getParentOrgName() + "%");
        }
        if (StringUtils.isNotBlank(form.getDischargerType1())) {
            sql.append(" and ps.discharger_Type1 like :dischargerType1");
            maps.put("dischargerType1", "%" + map.get("dischargerType1").toString() + "%");
        }
        if (StringUtils.isNotBlank(form.getHasCert1())) {
            sql.append(" and ps.has_Cert1 = :hasCert1");
            maps.put("hasCert1", map.get("hasCert1").toString());
        }
        if (StringUtils.isNotBlank(form.getHasCert2())) {
            sql.append(" and ps.has_Cert2 = :hasCert2");
            maps.put("hasCert2", map.get("hasCert2").toString());
        }
        if (StringUtils.isNotBlank(form.getHasCert3())) {
            sql.append(" and ps.has_Cert3 = :hasCert3");
            maps.put("hasCert3", map.get("hasCert3").toString());
        }
        if (StringUtils.isNotBlank(form.getHasCert4())) {
            sql.append(" and ps.has_Cert4 = :hasCert4");
            maps.put("hasCert4", map.get("hasCert4").toString());
        }
        if (map.size() > 0 && map.containsKey("startTime") && map.containsKey("endTime")) {
            sql.append(" and ps.mark_Time between :startTime and :endTime");
            maps.put("startTime", (Date) map.get("startTime"));
            maps.put("endTime", (Date) map.get("endTime"));
        }
        Long doubtTotal = pshDischargerDao.countSqlResult(sql.toString() + " and ps.state ='3'", maps);  //疑问统计
        mapJson.put("doubtTotal", doubtTotal);
        Long passTotal = pshDischargerDao.countSqlResult(sql.toString() + " and ps.state ='2'", maps);  //通过统计
        mapJson.put("passTotal", passTotal);
        Long total = pshDischargerDao.countSqlResult(sql.toString(), maps);
        mapJson.put("total", total);
        return mapJson;
    }

    /**
     * 上报统计和图表
     *
     * @param "startTime" 开始时间
     * @param "endTime"   结束时间
     */
    @Override
    public List<Map<String, Object>> toPartsAndChart(Map<String, Object> map) {
        SimpleDateFormat sim = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<Map<String, Object>> listTotal = new ArrayList<>();
        StringBuffer sql = new StringBuffer("select PARENT_ORG_NAME,sum(total) as total from (" +
                "select S1.PARENT_ORG_NAME , count(*) as total from DRI_Psh_Discharger s1 where 1=1 and s1.parent_org_name not like '%广州市水务局%' and s1.state<>'4' ");

        if (map.size() > 0 && map.containsKey("startTime") && map.containsKey("endTime")) {
            String startTime = sim.format(map.get("startTime"));
            String endTime = sim.format(map.get("endTime"));
            sql.append(" and s1.mark_time between to_date('" + startTime + "','YYYY-MM-DD HH24:MI:SS')"
                    + "and to_date('" + endTime + "','YYYY-MM-DD HH24:MI:SS')");
        }
        if (map.containsKey("parentOrgName")) {
            sql.append(" and s1.parent_org_name like '%" + map.get("parentOrgName").toString() + "%'");
        }
        if (map.containsKey("dischargerType1")) {
            sql.append(" and s1.discharger_Type1 like '%" + map.get("dischargerType1").toString() + "%'");
        }

        if (map.containsKey("hasCert1")) {
            sql.append(" and s1.has_Cert1 = '" + map.get("hasCert1").toString() + "'");
        }
        if (map.containsKey("hasCert2")) {
            sql.append(" and s1.has_Cert2 = '" + map.get("hasCert2").toString() + "'");
        }
        if (map.containsKey("hasCert3")) {
            sql.append(" and s1.has_Cert3 = '" + map.get("hasCert3").toString() + "'");
        }
        if (map.containsKey("hasCert4")) {
            sql.append(" and s1.has_Cert4 = '" + map.get("hasCert4").toString() + "'");
        }

        sql.append(" GROUP BY s1.PARENT_ORG_NAME) GROUP BY PARENT_ORG_NAME  ");
        List<Object> list = pshDischargerDao.getSession().createSQLQuery(sql.toString()).list();
        for (Object obj : list) {
            Map<String, Object> maps = new HashMap<>();
            Object[] ob = (Object[]) obj;
            if (ob[0] != null && !"广州市水务局".equals(ob[0].toString())) {
                maps.put("name", ob[0]);
                maps.put("total", ob[1]);
                listTotal.add(maps);
            }
        }
        return listTotal;
    }

    /**
     * 昨天和今天区域统计
     */
    @Override
    public Map toPastNowDay(Map<String, Object> mapss) {
        Map mapJosn = new HashMap<>();
//		Map mapss = new HashMap<>();
//		if(!"null".equals(dischargerType1) && StringUtils.isNotBlank(dischargerType1)){
//			mapss.put("dischargerType1", dischargerType1);
//		}
        List<Map> toDay = new ArrayList<>();
        List<Map> yestDay = new ArrayList<>();
        List<Object> list = new ArrayList<>();
        List<Object> yestDayList = getCountDay(true, mapss);//昨天
        List<Object> toDayList = getCountDay(false, mapss);//今天
        for (Object o : toDayList) {
            Map map = new HashMap<>();
            if (o != null && ((Object[]) o).length > 0) {
                if (!((Object[]) o)[0].toString().equals("广州市水务局")) {
                    map.put("name", ((Object[]) o)[0]);
                    map.put("addCount", ((Object[]) o)[1] != null ? ((Object[]) o)[1] : 0);
//					map.put("checkCount", ((Object[])o)[2]!=null?((Object[])o)[2]:0);
                    toDay.add(map);
                }
            }
        }
        for (Object o : yestDayList) {
            Map map = new HashMap<>();
            if (o != null && ((Object[]) o).length > 0) {
                if (!((Object[]) o)[0].toString().equals("广州市水务局")) {
                    map.put("name", ((Object[]) o)[0]);
                    map.put("addCount", ((Object[]) o)[1] != null ? ((Object[]) o)[1] : 0);
//					map.put("checkCount", ((Object[])o)[2]!=null?((Object[])o)[2]:0);
                    yestDay.add(map);
                }
            }
        }
        mapJosn.put("toDay", toDay);
        mapJosn.put("yestDay", yestDay);
        return mapJosn;
    }

    /**
     * 统计昨天或者今天的校核和新增
     *
     * @param 'boolean' yestDay 是否是昨天
     */
    private List<Object> getCountDay(Boolean yestDay, Map map) {
        StringBuffer wheres = new StringBuffer();
        wheres.append(" and ps.state<>'4' ");
        if (map != null) {
            if (map.containsKey("dischargerType1")) {
                wheres.append(" and ps.discharger_Type1 like '%" + map.get("dischargerType1").toString() + "%'");
            }
            if (map.containsKey("hasCert1")) {
                wheres.append(" and ps.has_Cert1 = '" + map.get("hasCert1").toString() + "'");
            }
            if (map.containsKey("hasCert2")) {
                wheres.append(" and ps.has_Cert2 = '" + map.get("hasCert2").toString() + "'");
            }
            if (map.containsKey("hasCert3")) {
                wheres.append(" and ps.has_Cert3 = '" + map.get("hasCert3").toString() + "'");
            }
            if (map.containsKey("hasCert4")) {
                wheres.append(" and s1.has_Cert4 = '" + map.get("hasCert4").toString() + "'");
            }
        }
        String sql = "select PARENT_ORG_NAME," +
//			"wm_concat( case typess when 'check' then total else null end)checkCount, "+
                "wm_concat(case typess when 'add' then total else null end) addCount from (" +
                "select PARENT_ORG_NAME,count(*) as total,'add' as typess  from DRI_Psh_Discharger ps where 1=1  " + wheres +
                " and to_char(ps.mark_Time,'yyyyMMdd')=to_char(sysdate" + (yestDay ? "-1" : "") + ",'yyyyMMdd') GROUP BY PARENT_ORG_NAME  " +
                " )GROUP BY PARENT_ORG_NAME";
        return pshDischargerDao.getSession().createSQLQuery(sql).list();
    }

    /**
     * 根据单位Id查询排水户信息
     */
    @Override
    public PshDischargerForm getFormByUnitId(String unitId) {
        StringBuffer hql = new StringBuffer("from PshDischarger ps where 1=1 ");
        Map<String, Object> values = new HashMap<String, Object>();
        if (StringUtils.isNotBlank(unitId)) {
            hql.append(" and ps.unitId = :unitId");
            values.put("unitId", unitId);
        }
        hql.append(" order by ps.markTime desc");
        List<PshDischarger> list = pshDischargerDao.find(hql.toString(), values);
        if (list != null && list.size() > 0) {
            return PshDischargerConvertor.convertVoToForm(list.get(0));
        }
        return null;
    }

    /**
     * 根据门牌号Id查询排水户信息
     */
    @Override
    public List<PshDischargerForm> getFormBySGuid(String sGuid) {
        StringBuffer hql = new StringBuffer("from PshDischarger ps where 1=1 ");
        Map<String, Object> values = new HashMap<String, Object>();
        if (StringUtils.isNotBlank(sGuid)) {
            hql.append(" and ps.doorplateAddressCode = :sGuid");
            values.put("sGuid", sGuid);
        }
        hql.append(" order by ps.markTime desc");
        List<PshDischarger> list = pshDischargerDao.find(hql.toString(), values);
        if (list != null && list.size() > 0) {
            return PshDischargerConvertor.convertVoListToFormList(list);
        }
        return null;
    }

    /**
     * 排水户审核统计
     */
    @Override
    public String statisticsForSh(PshDischargerForm form, Map<String, Object> map) {
        JSONObject json = new JSONObject();
        List<Map> list = new ArrayList<>();
        Map valueMap = new HashMap<>();
        StringBuffer hql = new StringBuffer("select c.check_person, ");
        hql.append(" SUM(case when c.state='2' or c.state='3' then 1 else 0 end) as totalNum,");
        hql.append(" SUM(case when c.state='2' then 1 else 0 end) as pass,");
        hql.append(" SUM(case when c.state='3' then 1 else 0 end) as doubt,");
        hql.append(" SUM(case when c.shTotal='b' then 1 else 0 end) as shTotal");
        hql.append(" from ");
        hql.append(" (select a.check_person,a.state,'a' shTotal,a.check_time from  dri_psh_discharger a ");
        hql.append(" union all ");
        hql.append(" select b.check_person,'b' state,'b' shTotal,b.check_time from  dri_psh_check_record b) c");
        hql.append(" where c.check_time is not null ");
       if (map != null) {
            SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
            if (map.get("startTime") == null && map.get("endTime") == null) {
                //没有任何条件时间默认为当天
                hql.append(" and to_char(c.check_time,'yyyyMMdd') = to_char(sysdate,'yyyyMMdd') ");
            } else {
                if (map.get("startTime") != null) {
                    hql.append(" and to_char(c.check_time,'yyyy-MM-dd') >= :startTime ");
                    valueMap.put("startTime", String.valueOf(map.get("startTime")));
                }
                if (map.get("endTime") != null) {
                    hql.append(" and to_char(c.check_time,'yyyy-MM-dd') <= :endTime");
                    valueMap.put("endTime",String.valueOf(map.get("endTime")));
                    //valueMap.put("endTime", df.format((Date) map.get("endTime")));
                }
            }
        }
        hql.append(" group by c.check_person ");
        hql.append(" order by totalNum desc");
        SQLQuery query = pshDischargerDao.createSQLQuery(hql.toString(), valueMap);
        List<Object[]> resultlist = query.list();
        for (Object[] obj : resultlist) {
            Map mp = new HashMap<>();
            mp.put("shr", obj[0]);
            mp.put("total", obj[1]);
            mp.put("pass", obj[2]);
            mp.put("doubt", obj[3]);
            mp.put("shTotal", obj[4]);
            list.add(mp);
        }
        //查找全部的审核人员
		/*List<OmUserForm> omList=omUserService.getUserByroleCode("PSH_SH");
		if(omList!=null && omList.size()>0){
			boolean isExit=true;
			for(OmUserForm o:omList){
				isExit=true;//每次循环都要重置一下
				for(Object[] obj : resultlist){
					if (o.getUserName().equals(obj[0])) {
						isExit=false;
					}
				}
				if(isExit){
					Map mp = new HashMap<>();
					mp.put("shr", o.getUserName());
					mp.put("total", 0);
					mp.put("pass", 0);
					mp.put("doubt", 0);
					mp.put("shTotal",0);
					list.add(mp);
				}
			}
		}*/
        json.put("rows", list);
        json.put("total", list.size());
        json.put("code", 200);
        return json.toString();
    }

    /**
     * 上报统计
     * 按区统计
     */
    @Override
    public String statisticsForArea(OpuOmUserInfo user, PshDischargerForm form, Map<String, Object> map) {
        JSONObject json = new JSONObject();
        List<Map> list = new ArrayList<>();
        Map valueMap = new HashMap<>();
        StringBuffer hql = new StringBuffer("select max(c.parent_org_name) 单位,"
                + " SUM(case when c.lx='lack' then 1 else 0 end) as 新增总数,"
                + " SUM(case when c.sslx like '%生活%' and c.lx='lack' then 1 else 0 end) as 生活污水类,"
                + " SUM(case when c.sslx like '%餐饮%' and c.lx='lack' then 1 else 0 end) as 餐饮污水类,"
                + " SUM(case when c.sslx like '%沉淀%' and c.lx='lack' then 1 else 0 end) as 含杂物沉淀类,"
                + " SUM(case when c.sslx like '%有毒%' and c.lx='lack' then 1 else 0 end) as 有毒有害,"
                + " SUM(case when c.state='1' and c.lx='lack'  then 1 else 0 end) as 未审核,"
                + " SUM(case when c.state='2' and c.lx='lack' then 1 else 0 end) as 审核 ,"
                + " SUM(case when c.state='3' and c.lx='lack' then 1 else 0 end) as 存疑, "
                + " SUM(case when c.lx='del' then 1 else 0 end) as 删除总数,"
                + " SUM(case when c.state='1' and c.lx='del'  then 1 else 0 end) as 删除新增,"
                + " SUM(case when c.state='2' and c.lx='del' then 1 else 0 end) as 删除审核, "
                + " SUM(case when c.state='3' and c.lx='del' then 1 else 0 end) as 删除存疑 "
                + " from"
                + " (select  'lack' as lx,a.mark_time,a.parent_org_name,a.parent_org_id,a.state,a.discharger_Type1 sslx ,a.check_desription, a.addr from DRI_psh_discharger a where a.state<>'4' "
                + "union all "
                + " select  'del' as lx,d.mark_time, d.parent_org_name,d.parent_org_id,d.state,d.discharger_Type1 sslx,d.check_desription, d.addr from DRI_psh_report_delete d "
                + " ) c"
                + " where 1=1");
        if (form != null) {
            if (StringUtils.isNotBlank(form.getParentOrgName())) {
                hql.append(" and c.parent_org_name like :do");
                valueMap.put("do", "%" + form.getParentOrgName() + "%");
            }
            if (StringUtils.isNotBlank(form.getDischargerType1())) {
                String[] pcode = form.getDischargerType1().split(",");
                int i = 0;
                for (String code : pcode) {
                    if (i == 0) {
                        hql.append(" and (c.sslx = '" + code + "'");
                    } else {
                        hql.append(" or c.sslx = '" + code + "'");
                    }
                    if (i == pcode.length - 1) {
                        hql.append(" )");
                    }
                    i++;
                }
            }
            if (StringUtils.isNotBlank(form.getCheckDesription())) {
                hql.append(" and c.check_desription like :checkDesription");
                valueMap.put("checkDesription", "%" + form.getCheckDesription() + "%");
            }
            if (StringUtils.isNotBlank(form.getAddr())) {
                hql.append(" and c.addr like :addr");
                valueMap.put("addr", "%" + form.getAddr() + "%");
            }
        }
        if (map != null) {
            SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
            if (map.get("startTime") != null) {
                hql.append(" and to_char(c.mark_time,'yyyy-MM-dd') >= :startTime ");
                valueMap.put("startTime",String.valueOf(map.get("startTime")));
                //valueMap.put("startTime", df.format((Date) map.get("startTime")));
            } else {//没有任何条件时间默认为当天
                hql.append(" and to_char(c.mark_time,'yyyyMMdd') >= to_char(sysdate,'yyyyMMdd') ");
            }
            if (map.get("endTime") != null&&StringUtils.isNotBlank(map.get("endTime").toString())) {
                hql.append(" and to_char(c.mark_time,'yyyy-MM-dd') <= :endTime");
                valueMap.put("endTime",String.valueOf(map.get("endTime")));
                //valueMap.put("endTime", df.format((Date) map.get("endTime")));
            } else {//没有任何条件时间默认为当天
                hql.append(" and to_char(c.mark_time,'yyyyMMdd') <= to_char(sysdate,'yyyyMMdd') ");
            }
        }
        hql.append(" group by c.parent_org_name  ");//order by count(*) desc
        hql.append(" order by  case ");
        hql.append(" when c.parent_org_name like '%天河%' then 1");//%天河% 按特定顺序排序
        hql.append(" when c.parent_org_name like '%番禺%' then 2");//%番禺%
        hql.append(" when c.parent_org_name like '%黄埔%' then 3");//%黄埔%
        hql.append(" when c.parent_org_name like '%白云%' then 4");//%白云%
        hql.append(" when c.parent_org_name like '%南沙%' then 5");//%南沙%
        hql.append(" when c.parent_org_name like '%海珠%' then 6");//%海珠%
        hql.append(" when c.parent_org_name like '%荔湾%' then 7");//%荔湾%
        hql.append(" when c.parent_org_name like '%花都%' then 8");//%花都%
        hql.append(" when c.parent_org_name like '%越秀%' then 9");//%越秀%
        hql.append(" when c.parent_org_name like '%增城%' then 10");//%增城%
        hql.append(" when c.parent_org_name like '%从化%' then 11");//%从化%
        hql.append(" when c.parent_org_name like '%贝源检测%' then 12");//%贝源检测%
        hql.append(" end ");
        //data : ['天河','番禺','黄埔','白云','南沙','海珠', '荔湾','花都','越秀','增城','从化','净水有限公司']
        SQLQuery query = pshDischargerDao.createSQLQuery(hql.toString(), valueMap);
        List<Object[]> resultlist = query.list();
        String[] qy = new String[]{"天河", "番禺", "黄埔", "白云", "南沙", "海珠", "荔湾", "花都", "越秀", "增城", "从化", "贝源检测", "市水务局"};
        //封装成对象
        int index = 0;
        long all = 0;
        long ty1 = 0;
        long ty2 = 0;
        long ty3 = 0;
        long ty4 = 0;
        long awsh = 0;
        long aysh = 0;
        long acyw = 0;
        long allDel = 0;
        long dwsh = 0;
        long dysh = 0;
        long dcyw = 0;
        for (Object[] obj : resultlist) {
            if (obj[0].toString().indexOf(qy[index]) < 0) {
                while (index <= qy.length - 1 && obj[0].toString().indexOf(qy[index]) < 0) {
                    Map mp = new HashMap<>();
                    mp.put("orgName", qy[index]);
                    mp.put("all", 0);
                    mp.put("ty1", 0);
                    mp.put("ty2", 0);
                    mp.put("ty3", 0);
                    mp.put("ty4", 0);
                    mp.put("awsh", 0);
                    mp.put("aysh", 0);
                    mp.put("acyw", 0);
                    mp.put("allDel", 0);
                    mp.put("dwsh", 0);
                    mp.put("dysh", 0);
                    mp.put("dcyw", 0);
                    list.add(mp);
                    index++;
                }
            }
            Map mp = new HashMap<>();
            mp.put("orgName", obj[0]);
            mp.put("all", obj[1]);
            mp.put("ty1", obj[2]);
            mp.put("ty2", obj[3]);
            mp.put("ty3", obj[4]);
            mp.put("ty4", obj[5]);
            mp.put("awsh", obj[6]);
            mp.put("aysh", obj[7]);
            mp.put("acyw", obj[8]);
            mp.put("allDel", obj[9]);
            mp.put("dwsh", obj[10]);
            mp.put("dysh", obj[11]);
            mp.put("dcyw", obj[12]);
            list.add(mp);
            index++;
            all += obj[1] == null ? 0 : Long.valueOf(obj[1].toString());
            ty1 += obj[2] == null ? 0 : Long.valueOf(obj[2].toString());
            ty2 += obj[3] == null ? 0 : Long.valueOf(obj[3].toString());
            ty3 += obj[4] == null ? 0 : Long.valueOf(obj[4].toString());
            ty4 += obj[5] == null ? 0 : Long.valueOf(obj[5].toString());
            awsh += obj[6] == null ? 0 : Long.valueOf(obj[6].toString());
            aysh += obj[7] == null ? 0 : Long.valueOf(obj[7].toString());
            acyw += obj[8] == null ? 0 : Long.valueOf(obj[8].toString());
            allDel += obj[9] == null ? 0 : Long.valueOf(obj[9].toString());
            dwsh += obj[10] == null ? 0 : Long.valueOf(obj[10].toString());
            dysh += obj[11] == null ? 0 : Long.valueOf(obj[11].toString());
            dcyw += obj[12] == null ? 0 : Long.valueOf(obj[12].toString());
        }
        if (index < qy.length) {
            while (index <= qy.length - 1) {
                Map mp = new HashMap<>();
                mp.put("orgName", qy[index]);
                mp.put("all", 0);
                mp.put("ty1", 0);
                mp.put("ty2", 0);
                mp.put("ty3", 0);
                mp.put("ty4", 0);
                mp.put("awsh", 0);
                mp.put("aysh", 0);
                mp.put("acyw", 0);
                mp.put("allDel", 0);
                mp.put("dwsh", 0);
                mp.put("dysh", 0);
                mp.put("dcyw", 0);
                list.add(mp);
                index++;
            }
        }
        Map mp = new HashMap<>();
        mp.put("orgName", "总计");
        mp.put("all", all);
        mp.put("ty1", ty1);
        mp.put("ty2", ty2);
        mp.put("ty3", ty3);
        mp.put("ty4", ty4);
        mp.put("awsh", awsh);
        mp.put("aysh", aysh);
        mp.put("acyw", acyw);
        mp.put("allDel", allDel);
        mp.put("dwsh", dwsh);
        mp.put("dysh", dysh);
        mp.put("dcyw", dcyw);
        list.add(mp);
        json.put("rows", list);
        json.put("total", list.size());
        json.put("code", 200);
        return json.toString();
    }

    /**
     * 上报统计
     * 按单位统计
     */
    @Override
    public String statisticsForUnit(OpuOmUserInfo user, PshDischargerForm form, Map<String, Object> map) {
        JSONObject json = new JSONObject();
        List<Map> list = new ArrayList<>();
        Map valueMap = new HashMap<>();
        StringBuffer hql = new StringBuffer("select max(c.parent_org_name) 单位,"
                + " SUM(case when c.lx='lack' then 1 else 0 end) as 新增总数,"
                + " SUM(case when c.sslx like '%生活%' and c.lx='lack' then 1 else 0 end) as 生活污水类,"
                + " SUM(case when c.sslx like '%餐饮%' and c.lx='lack' then 1 else 0 end) as 餐饮污水类,"
                + " SUM(case when c.sslx like '%沉淀%' and c.lx='lack' then 1 else 0 end) as 含杂物沉淀类,"
                + " SUM(case when c.sslx like '%有毒%' and c.lx='lack' then 1 else 0 end) as 有毒有害,"
                + " SUM(case when c.state='1' and c.lx='lack'  then 1 else 0 end) as 未审核,"
                + " SUM(case when c.state='2' and c.lx='lack' then 1 else 0 end) as 审核 ,"
                + " SUM(case when c.state='3' and c.lx='lack' then 1 else 0 end) as 存疑, "
                + " SUM(case when c.lx='del' then 1 else 0 end) as 删除总数,"
                + " SUM(case when c.state='1' and c.lx='del'  then 1 else 0 end) as 删除新增,"
                + " SUM(case when c.state='2' and c.lx='del' then 1 else 0 end) as 删除审核, "
                + " SUM(case when c.state='3' and c.lx='del' then 1 else 0 end) as 删除存疑 ,"
                + " c.team_org_name 镇街"
                + " from"
                + " (select  'lack' as lx,a.mark_time,a.parent_org_name,a.parent_org_id,a.state,a.discharger_Type1 sslx ,a.check_desription, a.addr,a.team_org_name from DRI_psh_discharger a where a.state<>'4' "
                + "union all "
                + " select  'del' as lx,d.mark_time, d.parent_org_name,d.parent_org_id,d.state,d.discharger_Type1 sslx,d.check_desription, d.addr,d.team_org_name from DRI_psh_report_delete d "
                + " ) c"
                + " where 1=1");
       /* if (form != null) {
            if (StringUtils.isNotBlank(form.getParentOrgName())) {
                hql.append(" and c.parent_org_name like :do");
                valueMap.put("do", "%" + form.getParentOrgName() + "%");
            }
            if (StringUtils.isNotBlank(form.getDischargerType1())) {
                String[] pcode = form.getDischargerType1().split(",");
                int i = 0;
                for (String code : pcode) {
                    if (i == 0) {
                        hql.append(" and (c.sslx = '" + code + "'");
                    } else {
                        hql.append(" or c.sslx = '" + code + "'");
                    }
                    if (i == pcode.length - 1) {
                        hql.append(" )");
                    }
                    i++;
                }
            }
            if (StringUtils.isNotBlank(form.getCheckDesription())) {
                hql.append(" and c.check_desription like :checkDesription");
                valueMap.put("checkDesription", "%" + form.getCheckDesription() + "%");
            }
            if (StringUtils.isNotBlank(form.getAddr())) {
                hql.append(" and c.addr like :addr");
                valueMap.put("addr", "%" + form.getAddr() + "%");
            }
        }
        if (map != null) {
            SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
            if (map.get("startTime") != null) {
                hql.append(" and to_char(c.mark_time,'yyyyMMdd') >= :startTime ");
                valueMap.put("startTime", df.format((Date) map.get("startTime")));
            } else {//没有任何条件时间默认为当天
                hql.append(" and to_char(c.mark_time,'yyyyMMdd') >= to_char(sysdate,'yyyyMMdd') ");
            }
            if (map.get("endTime") != null) {
                hql.append(" and to_char(c.mark_time,'yyyyMMdd') <= :endTime");
                valueMap.put("endTime", df.format((Date) map.get("endTime")));
            } else {//没有任何条件时间默认为当天
                hql.append(" and to_char(c.mark_time,'yyyyMMdd') <= to_char(sysdate,'yyyyMMdd') ");
            }
        }*/
        hql.append(" group by c.team_org_name  ");//order by count(*) desc
        hql.append(" order by  count(*) desc");
        SQLQuery query = pshDischargerDao.createSQLQuery(hql.toString(), valueMap);
        List<Object[]> resultlist = query.list();
        //封装成对象
        long all = 0;
        long ty1 = 0;
        long ty2 = 0;
        long ty3 = 0;
        long ty4 = 0;
        long awsh = 0;
        long aysh = 0;
        long acyw = 0;
        long allDel = 0;
        long dwsh = 0;
        long dysh = 0;
        long dcyw = 0;
        if (resultlist != null && resultlist.size() > 0) {
            for (Object[] obj : resultlist) {
                Map mp = new HashMap<>();
                mp.put("orgName", obj[0]);
                mp.put("all", obj[1]);
                mp.put("ty1", obj[2]);
                mp.put("ty2", obj[3]);
                mp.put("ty3", obj[4]);
                mp.put("ty4", obj[5]);
                mp.put("awsh", obj[6]);
                mp.put("aysh", obj[7]);
                mp.put("acyw", obj[8]);
                mp.put("allDel", obj[9]);
                mp.put("dwsh", obj[10]);
                mp.put("dysh", obj[11]);
                mp.put("dcyw", obj[12]);
                mp.put("teamName", obj[13]);
                list.add(mp);
                all += obj[1] == null ? 0 : Long.valueOf(obj[1].toString());
                ty1 += obj[2] == null ? 0 : Long.valueOf(obj[2].toString());
                ty2 += obj[3] == null ? 0 : Long.valueOf(obj[3].toString());
                ty3 += obj[4] == null ? 0 : Long.valueOf(obj[4].toString());
                ty4 += obj[5] == null ? 0 : Long.valueOf(obj[5].toString());
                awsh += obj[6] == null ? 0 : Long.valueOf(obj[6].toString());
                aysh += obj[7] == null ? 0 : Long.valueOf(obj[7].toString());
                acyw += obj[8] == null ? 0 : Long.valueOf(obj[8].toString());
                allDel += obj[9] == null ? 0 : Long.valueOf(obj[9].toString());
                dwsh += obj[10] == null ? 0 : Long.valueOf(obj[10].toString());
                dysh += obj[11] == null ? 0 : Long.valueOf(obj[11].toString());
                dcyw += obj[12] == null ? 0 : Long.valueOf(obj[12].toString());
            }
        }
        //获取当前区下面全部的机构，没有数据，补个0
     	/*List<OmOrgForm> orgList =null;
     	if(StringUtils.isNotBlank(form.getParentOrgName())){
			Long orgId = statisticsService.getOrgIdByOrgName(form.getParentOrgName(),"32",null);
			if(orgId != null){
				orgList = omOrgService.getChildOrgs(orgId);
			}
		}*/
     	/*if (orgList!=null) {
     		OmOrgForm omNullForm=new OmOrgForm();
     		omNullForm.setOrgName("区水务");//为空的就是直属区下面的人，要考虑进去
     		orgList.add(omNullForm);
     		for(OmOrgForm org : orgList){
     			boolean isExit=true;
     			for(Object[] obj : resultlist){
     				if((obj[13]==null?"区水务":obj[13].toString()).equals(org.getOrgName())){
     					isExit=false;//如果相等了，就表示前面已经封装了，不再封装，此时找到没有的镇街，补0上去
     				}
     			}
     			if (isExit && !"区水务".equals(org.getOrgName())) {
     				Map mp = new HashMap<>();
     				mp.put("orgName",form.getParentOrgName());
     				mp.put("all",  0);
     				mp.put("ty1",  0);
     				mp.put("ty2",  0);
     				mp.put("ty3", 0);
     				mp.put("ty4", 0);
     				mp.put("awsh", 0);
     				mp.put("aysh", 0);
     				mp.put("acyw", 0);
     				mp.put("allDel", 0);
     				mp.put("dwsh", 0);
     				mp.put("dysh", 0);
     				mp.put("dcyw", 0);
     				mp.put("teamName", org.getOrgName());
     				list.add(mp);
     			}
			}
     	}	*/
        Map mp = new HashMap<>();
        mp.put("orgName", "总计");
        mp.put("all", all);
        mp.put("ty1", ty1);
        mp.put("ty2", ty2);
        mp.put("ty3", ty3);
        mp.put("ty4", ty4);
        mp.put("awsh", awsh);
        mp.put("aysh", aysh);
        mp.put("acyw", acyw);
        mp.put("allDel", allDel);
        mp.put("dwsh", dwsh);
        mp.put("dysh", dysh);
        mp.put("dcyw", dcyw);
        list.add(mp);
        json.put("rows", list);
        json.put("total", list.size());
        json.put("code", 200);
        return json.toString();
    }

    /**
     * 上报统计
     * 按人统计
     */

    public String statisticsForPerson(OpuOmUserInfo user, PshDischargerForm form, Map<String, String> map) {
        JSONObject json = new JSONObject();
        List<Map> list = new ArrayList<>();
        Map value = new HashMap();
        StringBuffer hql = new StringBuffer("select max(c.parent_org_name) 单位,"
                + " SUM(case when c.lx='lack' then 1 else 0 end) as 新增总数,"
                + " SUM(case when c.sslx like '%生活%' and c.lx='lack' then 1 else 0 end) as 生活污水类,"
                + " SUM(case when c.sslx like '%餐饮%' and c.lx='lack' then 1 else 0 end) as 餐饮污水类,"
                + " SUM(case when c.sslx like '%沉淀%' and c.lx='lack' then 1 else 0 end) as 含杂物沉淀类,"
                + " SUM(case when c.sslx like '%有毒%' and c.lx='lack' then 1 else 0 end) as 有毒有害,"
                + " SUM(case when c.state='1' and c.lx='lack'  then 1 else 0 end) as 未审核,"
                + " SUM(case when c.state='2' and c.lx='lack' then 1 else 0 end) as 审核 ,"
                + " SUM(case when c.state='3' and c.lx='lack' then 1 else 0 end) as 存疑, "
                + " SUM(case when c.lx='del' then 1 else 0 end) as 删除总数,"
                + " SUM(case when c.state='1' and c.lx='del'  then 1 else 0 end) as 删除新增,"
                + " SUM(case when c.state='2' and c.lx='del' then 1 else 0 end) as 删除审核, "
                + " SUM(case when c.state='3' and c.lx='del' then 1 else 0 end) as 删除存疑, "
                + " mark_person 人 from"
                + " (select  'lack' as lx,a.mark_time,a.parent_org_name,a.mark_person,a.state,a.discharger_Type1 sslx ,a.check_desription, a.addr,a.team_org_name  from DRI_psh_discharger a where a.state<>'4' "
                + "union all "
                + " select  'del' as lx,d.mark_time, d.parent_org_name,d.mark_person,d.state,d.discharger_Type1 sslx,d.check_desription, d.addr,d.team_org_name  from DRI_psh_report_delete d "
                + " ) c"
                + " where 1=1"
        );
        if (form != null) {
            //在区域查询页面点击查看，就带区域过来查询
            if (StringUtils.isNotBlank(form.getParentOrgName())) {
                if (!"all".equals(form.getParentOrgName())) {
                    hql.append(" and c.parent_org_name like :ccc");
                    value.put("ccc", "%" + form.getParentOrgName() + "%");
                }
            } else {//不是区域点击的
                //当前登录人就以当前区统计为主
                Map<String,String> cmMap=installRecordService.getOrgForAppInstall(user.getLoginName());
		     	if(cmMap!=null && cmMap.size()>0){
		     		if("广州市水务局".indexOf(cmMap.get("parentOrgName"))!=-1 && cmMap.get("parentOrgName")!=null){//非市级
						hql.append(" and c.parent_org_name=:zz");
						value.put("zz",cmMap.get("parentOrgName"));
					}
		     	}
            }
            if (StringUtils.isNotBlank(form.getDirectOrgName())) {
                if ("null".equals(form.getDirectOrgName())) {
                    hql.append(" and c.direct_org_name is null ");
                } else {
                    hql.append(" and c.direct_org_name like :aa");
//					hql.append(" and (( c.direct_org_name is null and  c.team_org_name like :aa) ");
//					hql.append(" or (c.direct_org_name is not null and c.direct_org_name like :aa ))");
                    value.put("aa", "%" + form.getDirectOrgName() + "%");
                }
            }
            if (StringUtils.isNotBlank(form.getTeamOrgName())) {
                if ("null".equals(form.getTeamOrgName())) {
                    hql.append(" and c.team_org_name is null ");
                } else {
                    hql.append(" and c.team_org_name like :aa");
                    value.put("aa", "%" + form.getTeamOrgName() + "%");
                }
            }
            if (StringUtils.isNotBlank(form.getMarkPerson())) {
                hql.append(" and c.mark_person like :bb");
                value.put("bb", "%" + form.getMarkPerson() + "%");
            }
            if (StringUtils.isNotBlank(form.getDischargerType1())) {
                String[] pcode = form.getDischargerType1().split(",");
                int i = 0;
                for (String code : pcode) {
                    if (i == 0) {
                        hql.append(" and (c.sslx = '" + code + "'");
                    } else {
                        hql.append(" or c.sslx = '" + code + "'");
                    }
                    if (i == pcode.length - 1) {
                        hql.append(" )");
                    }
                    i++;
                }
            }
            if (StringUtils.isNotBlank(form.getCheckDesription())) {
                hql.append(" and c.check_desription like :checkDesription");
                value.put("checkDesription", "%" + form.getCheckDesription() + "%");
            }
            if (StringUtils.isNotBlank(form.getAddr())) {
                hql.append(" and c.addr like :road");
                value.put("road", "%" + form.getAddr() + "%");
            }
        }
        if (map != null) {
            SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
            if (map.get("startTime") != null&&StringUtils.isNotBlank(map.get("startTime"))) {
                hql.append(" and to_char(c.mark_time,'yyyy-MM-dd') >= :dd ");
                value.put("dd",String.valueOf(map.get("startTime")));
                //value.put("dd", df.format((Date) map.get("startTime")));
            } else {//没有任何条件时间默认为当天
                hql.append(" and to_char(c.mark_time,'yyyyMMdd') >= to_char(sysdate,'yyyyMMdd') ");
            }
            if (map.get("endTime") != null&&StringUtils.isNotBlank(map.get("endTime"))) {
                hql.append(" and to_char(c.mark_time,'yyyy-MM-dd') <= :ff");
                value.put("ff",String.valueOf(map.get("endTime")));
               // value.put("ff", df.format((Date) map.get("endTime")));
            } else {//没有任何条件时间默认为当天
                hql.append(" and to_char(c.mark_time,'yyyyMMdd') <= to_char(sysdate,'yyyyMMdd') ");
            }
        }
        hql.append(" group by c.mark_person  order by count(*) desc");
        SQLQuery query = pshDischargerDao.createSQLQuery(hql.toString(), value);
        List<Object[]> resultlist = query.list();
        long all = 0;
        long ty1 = 0;
        long ty2 = 0;
        long ty3 = 0;
        long ty4 = 0;
        long awsh = 0;
        long aysh = 0;
        long acyw = 0;
        long allDel = 0;
        long dwsh = 0;
        long dysh = 0;
        long dcyw = 0;
        //封装成对象
        for (Object[] obj : resultlist) {
            Map mp = new HashMap<>();
            mp.put("orgName", obj[0]);
            mp.put("all", obj[1]);
            mp.put("ty1", obj[2]);
            mp.put("ty2", obj[3]);
            mp.put("ty3", obj[4]);
            mp.put("ty4", obj[5]);
            mp.put("awsh", obj[6]);
            mp.put("aysh", obj[7]);
            mp.put("acyw", obj[8]);
            mp.put("allDel", obj[9]);
            mp.put("dwsh", obj[10]);
            mp.put("dysh", obj[11]);
            mp.put("dcyw", obj[12]);
            mp.put("markPerson", obj[13]);
            all += obj[1] == null ? 0 : Long.valueOf(obj[1].toString());
            ty1 += obj[2] == null ? 0 : Long.valueOf(obj[2].toString());
            ty2 += obj[3] == null ? 0 : Long.valueOf(obj[3].toString());
            ty3 += obj[4] == null ? 0 : Long.valueOf(obj[4].toString());
            ty4 += obj[5] == null ? 0 : Long.valueOf(obj[5].toString());
            awsh += obj[6] == null ? 0 : Long.valueOf(obj[6].toString());
            aysh += obj[7] == null ? 0 : Long.valueOf(obj[7].toString());
            acyw += obj[8] == null ? 0 : Long.valueOf(obj[8].toString());
            allDel += obj[9] == null ? 0 : Long.valueOf(obj[9].toString());
            dwsh += obj[10] == null ? 0 : Long.valueOf(obj[10].toString());
            dysh += obj[11] == null ? 0 : Long.valueOf(obj[11].toString());
            dcyw += obj[12] == null ? 0 : Long.valueOf(obj[12].toString());
            list.add(mp);
        }
        Map mp = new HashMap<>();
        mp.put("markPerson", "总计");
        mp.put("all", all);
        mp.put("ty1", ty1);
        mp.put("ty2", ty2);
        mp.put("ty3", ty3);
        mp.put("ty4", ty4);
        mp.put("awsh", awsh);
        mp.put("aysh", aysh);
        mp.put("acyw", acyw);
        mp.put("allDel", allDel);
        mp.put("dwsh", dwsh);
        mp.put("dysh", dysh);
        mp.put("dcyw", dcyw);
        list.add(mp);
        json.put("rows", list);
        json.put("total", list.size());
        json.put("code", 200);
        return json.toString();
    }

    /**
     * 修改调查状态
     */
    @Override
    public void updateDczt(PshDischargerForm pshForm) {
        String sGuid = pshForm.getDoorplateAddressCode();
        //修改调查状态
		/*if(StringUtils.isNotBlank(pshForm.getUnitId())){
			Long unitId = Long.valueOf(pshForm.getUnitId());
			ExShuiwuUnitHouseFormForm unitForm = exShuiwuUnitHouseFormService.get(unitId);
			//修改单位状态
			if(unitForm != null){
				if(1l==unitForm.getIsexist() || "1".equals(unitForm.getIsexist())){//自己新增单位删除
					exShuiwuUnitHouseFormService.delete(unitId);
				}else{//四标四实数据则修改为未调查
					unitForm.setIsrecorded(1l);//未调查
					exShuiwuUnitHouseFormService.save(unitForm);
				}
			}
			//修改门牌状态
			List<PshDischargerForm> pshList = getFormBySGuid(sGuid);
			if(pshList == null){
				PshMenpaiForm pshMenpaiForm = pshMenpaiService.getBySGuid(sGuid);
				if(pshMenpaiForm != null){
					exGongan77DzMpdyService.updateMpState(sGuid, pshForm.getMarkPersonId(), "0",1l);//未调查
				}else{
					exGongan77DzMpdyService.updateMpState(sGuid, pshForm.getMarkPersonId(), "1",1l);//未调查
				}
			}
		}*/
    }

    /**
     * 删除排水户
     */
    @Override
    public void deletePsh(String pshId, OpuOmUserInfo userForm) {
        PshDischargerForm pshForm = get(pshId);
        if (pshForm != null) {
            if (!"4".equals(pshForm.getState())) {//非暂存的记录删除才保存到删除表
                PshReportDeleteForm deleteForm = PshReportDeleteConvertor.convertVoToForm(pshForm);
                deleteForm.setDeleteTime(new Date());
                deleteForm.setDeleteUserId(userForm.getUserId() == null ? "" : userForm.getUserId().toString());
                deleteForm.setDeleteUserName(userForm.getUserName());
                deleteForm.setDeleteUserPhone(userForm.getUserMobile());
                //pshReportDeleteService.save(deleteForm);
            }
            delete(Long.parseLong(pshId));
            updateDczt(pshForm);
            //删除接驳井关联表
			/*List<PshDischargerWellForm> wellList = pshDischargerWellService.getAffList(pshId);
			if(wellList!=null && wellList.size()>0){
				Long[] beenIds = new Long[wellList.size()];
				for(int i=0;i<wellList.size();i++){
					beenIds[i] = wellList.get(i).getId();
				}
				pshDischargerWellService.deleteAndToTc(beenIds); //删除接驳井
			}*/
        }
    }

    /**
     * 排水户导入保存
     *
     * @throws Exception
     */
    @Override
    public String importSave(List<Map<String, Object>> list, OpuOmUserInfo userForm, String model) throws Exception {
        String uploadPath = ThirdUtils.getInPath() + "\\pshFile\\"; // 图片的物理路径
        File file = new File(uploadPath + "tp\\" + userForm.getLoginName() + "\\图片\\" + "3" + "\\" + "01现场");
        //图片文件夹找不到则导入失败
        if (file.exists() && file.isDirectory()) {

        } else {
            String description = "imageError";
            return description;

        }
        int index = 2, success = 0, fail = 0;
        String[] dischargerType1 = {"生活排污类", "餐饮排污类", "沉淀物排污类", "有毒有害排污类"};
        StringBuilder description = new StringBuilder("");
        for (Map<String, Object> map : list) {
            index++;
            //判断门牌是否存在
            ExGongan77DzMpdyForm mp = null;
            if ("1".equals(model)) {
                if (map.get("bsm") == null) {
                    description.append("序号为" + index + "的记录导入失败，原因是标识码为空！<br/>");
                    continue;
                } else {
                    String bsm = map.get("bsm").toString().trim();
                    //mp=exGongan77DzMpdyService.getBySGuid(bsm);
                    if (mp == null) {
                        description.append("序号为" + index + "的记录导入失败，原因是根据标识码查不到门牌！<br/>");
                        continue;
                    }
                }
            } else {
                if (map.get("bzdzdm") == null) {
                    description.append("序号为" + index + "的记录导入失败，原因是标准地址代码为空！<br/>");
                    continue;
                } else {
                    String bzdzdm = map.get("bzdzdm").toString().trim();
                    //mp=exGongan77DzMpdyService.getByDzdm(bzdzdm);
                    if (mp == null) {
                        description.append("序号为" + index + "的记录导入失败，原因是根据标准地址代码查不到门牌！<br/>");
                        continue;
                    }
                }
            }
            //判断必填字段
            if (map.get("addr") == null || "".equals(map.get("addr").toString().trim())) {
                description.append("序号为" + index + "的记录导入失败，原因是必填项“详细地址”为空！<br/>");
                continue;
            }
            if (map.get("name") == null || "".equals(map.get("name").toString().trim())) {
                description.append("序号为" + index + "的记录导入失败，原因是必填项“排水户名称”为空！<br/>");
                continue;
            }
            if (map.get("dischargerType1") == null || "".equals(map.get("dischargerType1").toString().trim())) {
                description.append("序号为" + index + "的记录导入失败，原因是必填项“行业类别大类”为空！<br/>");
                continue;
            }
            if (map.get("dischargerType2") == null || "".equals(map.get("dischargerType2").toString().trim())) {
                description.append("序号为" + index + "的记录导入失败，原因是必填项“行业类别小类”为空！<br/>");
                continue;
            }
            if ("有".equals(map.get("hasCert1"))) {
                if (map.get("cert1Code") == null || "".equals(map.get("cert1Code").toString().trim())) {
                    description.append("序号为" + index + "的记录导入失败，原因是必填项“工商执照代码”为空！<br/>");
                    continue;
                }
            }
            if ("有".equals(map.get("hasCert3"))) {
                if (map.get("cert3Code") == null || "".equals(map.get("cert3Code").toString().trim())) {
                    description.append("序号为" + index + "的记录导入失败，原因是必填项“排水许可证代码”为空！<br/>");
                    continue;
                }
            }
            if ("有".equals(map.get("hasCert4"))) {
                if (map.get("cert4Code") == null || "".equals(map.get("cert4Code").toString().trim())) {
                    description.append("序号为" + index + "的记录导入失败，原因是必填项“排污许可证代码”为空！<br/>");
                    continue;
                }
            }
            //字典项格式校验
            if (map.get("hasCert1") != null && !"".equals(map.get("hasCert1").toString().trim())) {
                if (!isSure(map.get("hasCert1").toString())) {
                    description.append("序号为" + index + "的记录导入失败，原因是字典项“是否有工商营业执照”格式不对！<br/>");
                    continue;
                }
            }
            if (map.get("hasCert2") != null && !"".equals(map.get("hasCert2").toString().trim())) {
                if (!isSure(map.get("hasCert2").toString())) {
                    description.append("序号为" + index + "的记录导入失败，原因是字典项“是否有接驳核准书”格式不对！<br/>");
                    continue;
                }
            }
            if (map.get("hasCert3") != null && !"".equals(map.get("hasCert3").toString().trim())) {
                if (!isSure(map.get("hasCert3").toString())) {
                    description.append("序号为" + index + "的记录导入失败，原因是字典项“是否有排水许可证”格式不对！<br/>");
                    continue;
                }
            }
            if (map.get("hasCert4") != null && !"".equals(map.get("hasCert4").toString().trim())) {
                if (!isSure(map.get("hasCert4").toString())) {
                    description.append("序号为" + index + "的记录导入失败，原因是字典项“是否有排污许可证”格式不对！<br/>");
                    continue;
                }
            }
            if (map.get("dischargerType1") != null && !"".equals(map.get("dischargerType1").toString().trim())) {
                boolean flag = false;
                for (int i = 0; i < dischargerType1.length; i++) {
                    if (map.get("dischargerType1").toString().equals(dischargerType1[i])) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    description.append("序号为" + index + "的记录导入失败，原因是字典项“行业类别大类”格式不对！<br/>");
                    continue;
                }
            }
            if (map.get("dischargerType2") != null && !"".equals(map.get("dischargerType2").toString().trim())) {
                if (!isType2Sure(map.get("dischargerType1").toString(), map.get("dischargerType2").toString(), dischargerType1)) {
                    description.append("序号为" + index + "的记录导入失败，原因是字典项“行业类别小类”格式不对！<br/>");
                    continue;
                }
            }
            //月均用水量如果有值，验证是否为数字
            if (map.get("volume") != null && !"".equals(map.get("volume").toString().trim())) {
                try {
                    Double.parseDouble(map.get("volume").toString().trim());
                } catch (Exception e) {
                    description.append("序号为" + index + "的记录导入失败，原因是月均用水量值不是合法数字！<br/>");
                    continue;
                }
            }
            try {
                //List<SewerageUserAttachmentForm> fileList = new ArrayList<SewerageUserAttachmentForm>();
                //保存图片到服务器
    			/*this.saveFiles("1", userForm.getLoginName(), fileList, index);
    			if("有".equals(map.get("hasCert1"))){
    				this.saveFiles("2", userForm.getLoginName(), fileList, index);
        		}
    			if("有".equals(map.get("hasCert2"))){
    				this.saveFiles("3", userForm.getLoginName(), fileList, index);
        		}
        		if("有".equals(map.get("hasCert3"))){
        			this.saveFiles("4", userForm.getLoginName(), fileList, index);
        		}
        		if("有".equals(map.get("hasCert4"))){
        			this.saveFiles("5", userForm.getLoginName(), fileList, index);
        		}*/
                //转换数据
                JSONObject formJson = JSONObject.fromObject(map);
                PshDischargerForm form = (PshDischargerForm) JsonOfForm.paramsTofromApp(formJson, PshDischargerForm.class);
                //补充数据
                if ("有".equals(map.get("hasCert1"))) {
                    form.setHasCert1("1");
                } else if ("无".equals(map.get("hasCert1"))) {
                    form.setHasCert1("0");
                }
                if ("有".equals(map.get("hasCert2"))) {
                    form.setHasCert2("1");
                } else if ("无".equals(map.get("hasCert2"))) {
                    form.setHasCert2("0");
                }
                if ("有".equals(map.get("hasCert3"))) {
                    form.setHasCert3("1");
                } else if ("无".equals(map.get("hasCert3"))) {
                    form.setHasCert3("0");
                }
                if ("有".equals(map.get("hasCert4"))) {
                    form.setHasCert4("1");
                } else if ("无".equals(map.get("hasCert4"))) {
                    form.setHasCert4("0");
                }
                form.setDoorplateAddressCode(mp.getSGuid());
        		/*ExGongan76DzJlxForm jlx= exGongan76DzJlxService.getByDm(mp.getSsjlxdm());//街路巷
        		ExGongan78DzQjwForm jwh=exGongan78DzQjwService.getByDm(mp.getSssqcjwhdm());//社区居委会
        		ExGongan79DzXzjdForm xzj=exGongan79DzXzjdService.getByDm(mp.getSsxzjddm());//乡政街
        		ExGongan80DzXzqhForm xzq=exGongan80DzXzqhService.getByDm(mp.getSsxzqhdm());//行政规划
        		form.setArea(xzq!=null?xzq.getMc():null);
        		form.setTown(xzj!=null?xzj.getMc():null);
        		form.setVillage(jwh!=null?jwh.getMc():null);
        		form.setStreet(jlx!=null?jlx.getMc():null);
        		form.setMph(mp.getMpwzhm());
        		form.setJzwcode(mp.getMpwzhm());
        		getUsersFrom(form, userForm.getLoginName());   //补充机构信息和对比用户信息*/
                //如果房屋栋或房屋套则新增
                //exShuiwuHousebuildFormService.saveIfNoBuild(form, "1");
                Date date = new Date();
                form.setMarkTime(date);
                form.setUpdateTime(date);
                form.setState("1");//新增
                form.setHouseIdFlag("0");
                form.setLoginName(userForm.getLoginName());
                if ("有".equals(form.getFac4()) && map.get("fac4Name") != null && !"".equals(map.get("fac4Name").toString().trim())) {
                    form.setFac4(map.get("fac4Name").toString().trim());
                }
                //补充空间位置信息
                String geometry = mp.getZxjd() + "," + mp.getZxwd();
                form = PshLxHttpArcgisClient.identify(form, geometry);
                this.save(form);
                //修改调查状态
                if (StringUtils.isNotBlank(form.getUnitId())) {
                    try {
    					/*Long unitId = Long.valueOf(form.getUnitId());
    					ExShuiwuUnitHouseFormForm unitForm = exShuiwuUnitHouseFormService.get(unitId);
    					unitForm.setIsrecorded(0l);//已调查
    					exShuiwuUnitHouseFormService.save(unitForm);*/
                    } catch (Exception e) {
                    }
                }
                //保存图片到数据库
    			/*if(fileList != null && fileList.size()>0){
	   				for (SewerageUserAttachmentForm attForm : fileList) {  //保存附件
   					 	attForm.setSewerageUserId(form.getId() == null ? "" : form.getId().toString());
   					 	sewerageUserAttachmentService.save(attForm);
   			        }
	   			}*/
                success++;
            } catch (Exception e) {
                description.append("序号为" + index + "的记录导入失败，原因是保存异常！<br/>");
                e.printStackTrace();
                continue;
            }

        }
        String message = "";
        if (list.size() == success) {
            message = "导入完成，总共导入" + list.size() + "条，导入成功" + success + "条，导入失败" + (list.size() - success) + "条。";
        } else {
            message = "导入完成，总共导入" + list.size() + "条，导入成功" + success + "条，导入失败" + (list.size() - success) + "条，失败详情如下！<br/>" +
                    description.toString();
        }
        return message;
    }

    /**
     * <p>Description: 判断数据字典项</p>
     * <p>Company: </p>
     *
     * @param type1
     * @param type2
     * @param dischargerType1
     * @return
     * @author xuzy
     * @date 2018年7月23日上午10:36:46
     */
    private boolean isType2Sure(String type1, String type2, String[] dischargerType1) {
        String[][] dischargerType2 = {
                {"机关企事业单位", "学校", "商场", "居民住宅", "其他"},
                {"餐饮店", "农家乐", "酒店", "大型食堂", "其他"},
                {"洗车、修车档", "沙场", "建筑工地", "养殖场", "其他"},
                {"化工", "印染", "电镀", "医疗", "其他"}
        };
        for (int i = 0; i < dischargerType1.length; i++) {
            if (type1.equals(dischargerType1[i])) {
                for (int j = 0; j < dischargerType2.length; j++) {
                    if (type2.equals(dischargerType2[i][j])) {
                        return true;
                    }
                }
                break;
            }
        }
        return false;
    }

    /**
     * <p>Description: 判断数据字典项</p>
     * <p>Company: </p>
     *
     * @param str
     * @return
     * @author xuzy
     * @date 2018年7月23日上午10:36:08
     */
    private boolean isSure(String str) {
        if ("无".equals(str) || "有".equals(str)) {
            return true;
        } else {
            return false;
        }
    }
    /**
     *
     * <p>Description: 保存图片</p>
     * <p>Company: </p>
     * @author xuzy
     * @date 2018年7月23日上午10:35:27
     * @param attType
     * @param LoginName
     * @param list
     * @param index
     * @throws Exception

    public void  saveFiles(String attType,String LoginName,List<SewerageUserAttachmentForm> list,int index) throws Exception{
    try {
    String uploadPath = ThirdUtils.getInPath() + "\\pshFile\\"; // 图片的物理路径
    String requestPath = "/img/pshFile/"; // 排水户图片的请求路径
    SimpleDateFormat formatAttName = new SimpleDateFormat(
    "yyyyMMddHHmmss");
    SimpleDateFormat formatDay = new SimpleDateFormat("yyyyMMdd"); // 天数的文件夹
    Format format = new SimpleDateFormat("yyyyMM");
    String filepaths = uploadPath + "img\\"
    + format.format(new Date()) + "\\"
    + formatDay.format(new Date());
    Thread.sleep(10);//给图片上传一个时间差，方便排序
    long code=System.currentTimeMillis();
    File file_ = new File(filepaths);//如果文件夹不存在则创建
    if (!file_.isDirectory()) {
    file_.mkdirs();
    }
    //根据图片类型获取图片路径
    String childFilePath="";
    if("1".equals(attType)){
    childFilePath="01现场";
    }else if("2".equals(attType)){
    childFilePath="02工商营业执照";
    }else if("3".equals(attType)){
    childFilePath="03接驳核准书";
    }else if("4".equals(attType)){
    childFilePath="04排水许可证";
    }else if("5".equals(attType)){
    childFilePath="05排污许可证";
    }
    //遍历图片文件夹，把图片保存到排水户图片指定路径
    File file = new File(uploadPath + "tp\\"+LoginName+"\\图片\\"+index+"\\"+childFilePath);
    if(file.exists() && file.isDirectory()){
    File[] files = file.listFiles();
    if(files.length>0){
    for(File file2 : files){
    String fileFileName=file2.getName();
    String filename = fileFileName.substring(0,fileFileName.lastIndexOf('.'));
    String fileformat = fileFileName.substring(fileFileName.lastIndexOf('.') + 1, fileFileName.length());
    String filecode = SysFileUtils.nextFileCode();
    FileUtils.copyFile(file2, new File(filepaths, filecode+"_"+code+"_"+filename+"."+fileformat));
    String filepaths2 = requestPath + "img/"
    + format.format(new Date()) + "/"
    + formatDay.format(new Date()) + "/" + filecode+"_"+code+"_"+filename+"."+fileformat;
    SewerageUserAttachmentForm fileForm = new SewerageUserAttachmentForm();
    fileForm.setAttName(code+"_"+filename+"."+fileformat);
    fileForm.setAttPath(filepaths2);
    fileForm.setAttTime(new Date());
    fileForm.setAttType(attType);
    fileForm.setMime("image/*");
    String smallUpoadPath = requestPath+"imgSmall/"+format.format(new Date())+"/"+formatDay.format(new Date())+"/"+filecode+"_"+code+"_"+filename+"."+fileformat;
    fileForm.setThumPath(smallUpoadPath);
    list.add(fileForm);
    // 缩略图 start
    // 缩略图地址
    String smallpicPath=uploadPath+"\\imgSmall\\"+format.format(new Date())+"\\"+formatDay.format(new Date());
    String picThumbnailUrl=smallpicPath+"\\"+filecode+"_"+code+"_"+filename+"."+fileformat;
    File sf = new File(smallpicPath);
    if(!sf.isDirectory()){
    sf.mkdirs();
    }
    Thumbnails.of(filepaths+"\\"+filecode+"_"+code+"_"+filename+"."+fileformat)
    .scale(0.4f)
    .toFile(picThumbnailUrl);
    // 缩略图 end
    }
    }
    }
    } catch (Exception e) {
    e.printStackTrace();
    throw e;
    }
    }*/
    /**
     * bs端排水户新增
     *
     * @throws Exception
     */
    @Override
    public void addRow(PshDischargerForm form, Map<String, String> map, List<PshDischargerWellForm> wellList, OpuOmUserInfo userForm) throws Exception {
        String isExist = null;//是否新增
        if (map.containsKey("sfdtl")) {
            if ("yes".equals(map.get("sfdtl"))) {
                isExist = "0";
            } else {
                isExist = "1";
            }

        }
        String delWellString = map.get("deletewellBeen");
        if (!"".equals(delWellString)) {
            String[] deleteBeenIds = delWellString.split(",");
            Long[] beenIds = new Long[deleteBeenIds.length];
            for (int i = 0; i < deleteBeenIds.length; i++) {
                beenIds[i] = Long.parseLong(deleteBeenIds[i]);
            }
            pshDischargerWellService.deleteAndToTc(beenIds); //删除接驳井
        }
        if (form.getId() == null) {//新增
            getUsersFrom(form, userForm.getLoginName());   //补充机构信息和对比用户信息
            //如果房屋栋或房屋套则新增
            //exShuiwuHousebuildFormService.saveIfNoBuild(form, isExist);
            Date date = new Date();
            form.setMarkTime(date);
            form.setUpdateTime(date);
            form.setState("1");//新增
            form.setHouseIdFlag("0");
            form.setLoginName(userForm.getLoginName());
            //补充空间位置信息
            String geometry = "";
            if ("0".equals(isExist)) {//新增门牌
				/*PshMenpaiForm pshMenpaiForm = pshMenpaiService.getBySGuid(form.getDoorplateAddressCode());
				if(pshMenpaiForm != null)
					geometry = pshMenpaiForm.getZxjd()+","+pshMenpaiForm.getZxwd();*/
            } else {
				/*ExGongan77DzMpdyForm mpFrom = exGongan77DzMpdyService.getBySGuid(form.getDoorplateAddressCode());
				if(mpFrom != null)
					geometry = mpFrom.getZxjd()+","+mpFrom.getZxwd();*/
            }
            form = PshLxHttpArcgisClient.identify(form, geometry);
            this.save(form);
            //修改调查状态
            if (StringUtils.isNotBlank(form.getUnitId())) {
                try {
					/*Long unitId = Long.valueOf(form.getUnitId());
					ExShuiwuUnitHouseFormForm unitForm = exShuiwuUnitHouseFormService.get(unitId);
					unitForm.setIsrecorded(0l);//已调查
					exShuiwuUnitHouseFormService.save(unitForm);*/
                } catch (Exception e) {
                }
            }
        } else {//修改
            PshDischargerForm pshForm = this.get(form.getId());
            pshForm.setName(form.getName());
            pshForm.setOperator(form.getOperator());
            if (pshForm == null) {
                throw new RuntimeException("记录不存在");
            }
            //暂存记录修改后变新增
            if ("4".equals(pshForm.getState())) {
                //如果房屋栋或房屋套则新增
                //exShuiwuHousebuildFormService.zcToSaveIfNoBuild(pshForm);
            }
            form.setHouseId(pshForm.getHouseId());
            form.setUnitId(pshForm.getUnitId());
            form.setUpdateTime(new Date());
            form.setState("1");//修改审核状态
            form.setMarkPerson(null);
            form.setMarkPersonId(null);
            form.setMarkTime(null);
            form.setLoginName(null);
            ;
            form.setParentOrgName(null);
            this.save(form);
            if (!"4".equals(pshForm.getState())) {
                //exShuiwuHousebuildFormService.saveIfNoBuild(pshForm,isExist);//同步单位
            }
            //暂存记录修改后变新增
            if ("4".equals(pshForm.getState())) {
                //修改调查状态
                if (StringUtils.isNotBlank(form.getUnitId())) {
                    try {
						/*Long unitId = Long.valueOf(form.getUnitId());
						ExShuiwuUnitHouseFormForm unitForm = exShuiwuUnitHouseFormService.get(unitId);
						unitForm.setIsrecorded(0l);//已调查
						exShuiwuUnitHouseFormService.save(unitForm);*/
                    } catch (Exception e) {
                    }
                }

            }
        }
        //保存接驳井信息
        if (wellList != null && wellList.size() > 0) {
            for (PshDischargerWellForm wellForm : wellList) {
                wellForm.setDischargeId(form.getId() == null ? "" : form.getId().toString());
                pshDischargerWellService.saveAndToTc(wellForm, form, isExist);
            }
        }

    }

    /**
     * 本接口通用方法，得到机构信息
     */
    @Override
    public void getUsersFrom(PshDischargerForm form, String loginName) throws Exception {
        OpuOmUserInfo userFrom = omUserService.getOpuOmUserInfoByLoginName(loginName);
        if (userFrom != null) {
            form.setMarkPerson(userFrom.getUserName());
            form.setMarkPersonId(userFrom.getUserId().toString());
            List<OpuOmOrg> list = omOrgService.listOpuOmOrgByUserId(userFrom.getUserId());
            for (OpuOmOrg omFrom : list) {
                if (null == omFrom.getOrgRank())
                    continue;
                if (omFrom.getOrgRank().equals("32")) {// 区级机构
                    form.setParentOrgId(omFrom.getOrgId().toString());
                    form.setParentOrgName(omFrom.getOrgName());
                } else if (omFrom.getOrgRank().equals("33")) {// 镇街
                    form.setTeamOrgId(omFrom.getOrgId().toString());
                    form.setTeamOrgName(omFrom.getOrgName());
                } else if (omFrom.getOrgRank().equals("34")) {// 维管单位
                    form.setDirectOrgId(omFrom.getOrgId().toString());
                    form.setDirectOrgName(omFrom.getOrgName());
                }
                if (list.size() < 4 && "1".equals(omFrom.getOrgRank())) {
                    if (null == form.getParentOrgId()) {
                        form.setParentOrgId(omFrom.getOrgId().toString());
                        form.setParentOrgName(omFrom.getOrgName());
                    }
                }
            }
			/*if(null==form.getDirectOrgId() && null!=form.getTeamOrgId() && omFrom!=null
					&& !"33".equals(omFrom.getOrgRank())){
				form.setDirectOrgId(omFrom.getOrgId().toString());
				form.setDirectOrgName(omFrom.getOrgName());
			}*/

        }
    }

    /**
     * 按区获取上报数据
     */
    public String getSbedByArea() {
        Map<String, Object> values = new HashMap<String, Object>();
        StringBuffer hql = new StringBuffer("select d.parent_org_name,count(*) from DRI_psh_discharger d where d.state<>'4' group by d.parent_org_name");
        List<Object[]> list = pshDischargerDao.createSQLQuery(hql.toString(), values).list();
        JSONArray jsonArray = new JSONArray();
        if (list != null && list.size() > 0) {
            for (Object[] o : list) {
                JSONObject jso = new JSONObject();
                jso.put("name", o[0] == null ? "市水务" : o[0]);
                jso.put("count", o[1]);
                jsonArray.add(jso);
            }
        }

        return jsonArray.toString();
    }
    /**
     * 设备安装统计
     */
    public String getInstalledByArea() {
        Map<String, Object> values = new HashMap<String, Object>();
        StringBuffer hql = new StringBuffer("select d.mph,count(*) from DRI_psh_discharger d where d.state<>'4' group by d.mph");
        List<Object[]> list = pshDischargerDao.createSQLQuery(hql.toString(), values).list();
        JSONArray jsonArray = new JSONArray();
        if (list != null && list.size() > 0) {
            for (Object[] o : list) {
                JSONObject jso = new JSONObject();
                jso.put("name", o[0] == null ? "市水务" : o[0]);
                jso.put("count", o[1]);
                jsonArray.add(jso);
            }
        }

        return jsonArray.toString();
    }

    /**
     * 按镇街获取上报数据
     */
    public String getSbedByUnit(String unitName) {
        JSONArray jsonArray = new JSONArray();
        Map<String, Object> values = new HashMap<String, Object>();
        StringBuffer hql = new StringBuffer("select d.team_org_name,count(*) from DRI_psh_discharger d where 1=1 and d.state<>'4' ");
        if (StringUtils.isNotBlank(unitName)) {
            hql.append(" and d.parent_org_name like :pn");
            values.put("pn", "%" + unitName + "%");
        }
        hql.append(" group by d.team_org_name ");
        List<Object[]> list = pshDischargerDao.createSQLQuery(hql.toString(), values).list();
        //获取当前区下面全部的机构，没有数据，补个0
     	/*List<OmOrgForm> orgList =null;
     	if(StringUtils.isNotBlank(unitName)){
			Long orgId = statisticsService.getOrgIdByOrgName(unitName,"32",null);
			if(orgId != null){
				orgList = omOrgService.getChildOrgs(orgId);
			}
		}

     	if (orgList!=null) {
     		for(OmOrgForm org : orgList){
     			boolean isExit=true;
     			for(Object[] o:list){
     				if((o[0]==null?"区水务":o[0].toString()).equals(org.getOrgName())){
     					isExit=false;
     					JSONObject jso = new JSONObject();
     					jso.put("name", o[0]==null?"区水务":o[0]);
     				 	jso.put("count", o[1]);
     				 	jsonArray.add(jso);
     				}
    			}
     			if (isExit) {
     				JSONObject jso = new JSONObject();
 					jso.put("name", org.getOrgName());
 				 	jso.put("count",0);
 				 	jsonArray.add(jso);
				}
			}
		}else{
			if (list!=null && list.size()>0) {
				for(Object[] o:list){
					JSONObject jso = new JSONObject();
					jso.put("name", o[0]==null?"区水务":o[0]);
				 	jso.put("count", o[1]);
				 	jsonArray.add(jso);
				}
			}
		}*/
        return jsonArray.toString();
    }

    /**
     * <p>Description: 空间统计拼接数据</p>
     * <p>Company: </p>
     *
     * @param list
     * @param listMp
     * @return
     * @author xuzy
     * @date 2018年8月17日下午2:27:41
     */
    private JSONArray appendKjTjData(List<Object[]> list, List<Object[]> listMp) {
        JSONArray jsonArray = new JSONArray();
        StringBuffer allIn = new StringBuffer("");//排水户与门牌都包含
        if (listMp != null && listMp.size() > 0 && list != null && list.size() > 0) {
            for (Object[] mp : listMp) {
                for (Object[] o : list) {
                    if (mp[0].equals(o[0])) {
                        allIn.append(mp[0] + ",");
                        JSONObject jso = new JSONObject();
                        jso.put("name", mp[0]);
                        jso.put("count", o[1]);
                        jso.put("shpw", o[2]);
                        jso.put("cypw", o[3]);
                        jso.put("cdpw", o[4]);
                        jso.put("ydyhpw", o[5]);
                        jso.put("mp", mp[1]);
                        jsonArray.add(jso);
                    }
                }
            }
        }
        if (list != null && list.size() > 0) {
            for (Object[] o : list) {
                if (allIn.indexOf(o[0].toString()) < 0) {
                    JSONObject jso = new JSONObject();
                    jso.put("name", o[0]);
                    jso.put("count", o[1]);
                    jso.put("shpw", o[2]);
                    jso.put("cypw", o[3]);
                    jso.put("cdpw", o[4]);
                    jso.put("ydyhpw", o[5]);
                    jso.put("mp", 0);
                    jsonArray.add(jso);
                }
            }
        }
        if (listMp != null && listMp.size() > 0) {
            for (Object[] o : listMp) {
                if (allIn.indexOf(o[0].toString()) < 0) {
                    JSONObject jso = new JSONObject();
                    jso.put("name", o[0]);
                    jso.put("count", 0);
                    jso.put("shpw", 0);
                    jso.put("cypw", 0);
                    jso.put("cdpw", 0);
                    jso.put("ydyhpw", 0);
                    jso.put("mp", o[1]);
                    jsonArray.add(jso);
                }
            }
        }
        return jsonArray;
    }

    /**
     * 按空间（镇街）获取统计数据
     */
    @Override
    public String getKjTjByAll() {
        Map<String, Object> values = new HashMap<String, Object>();
        //统计排水户
        StringBuffer sql = new StringBuffer("select d.kj_area,count(*) allNum,"
                + " SUM(case when d.discharger_Type1 like '%生活%'  then 1 else 0 end) as 生活污水类,"
                + " SUM(case when d.discharger_Type1 like '%餐饮%'  then 1 else 0 end) as 餐饮污水类,"
                + " SUM(case when d.discharger_Type1 like '%沉淀%'  then 1 else 0 end) as 含杂物沉淀类,"
                + " SUM(case when d.discharger_Type1 like '%有毒%'  then 1 else 0 end) as 有毒有害");
        sql.append(" from DRI_psh_discharger d where 1=1 and d.state<>'4' and d.kj_area is not null ");
        sql.append(" group by d.kj_area ");
        List<Object[]> list = pshDischargerDao.createSQLQuery(sql.toString(), values).list();
        //统计门牌
        StringBuffer mpSql = new StringBuffer("select t.area,sum(t.mpnum) from  menpai_kjtj t where 1=1 ");
        mpSql.append(" group by t.area ");
        List<Object[]> listMp = pshDischargerDao.createSQLQuery(mpSql.toString(), values).list();
        JSONArray jsonArray = appendKjTjData(list, listMp);
        return jsonArray.toString();
    }

    /**
     * 按空间（镇街）获取统计数据
     */
    @Override
    public String getKjTjByUnit(String area) {
        Map<String, Object> values = new HashMap<String, Object>();
        //统计排水户
        StringBuffer sql = new StringBuffer("select d.kj_town,count(*) allNum,"
                + " SUM(case when d.discharger_Type1 like '%生活%'  then 1 else 0 end) as 生活污水类,"
                + " SUM(case when d.discharger_Type1 like '%餐饮%'  then 1 else 0 end) as 餐饮污水类,"
                + " SUM(case when d.discharger_Type1 like '%沉淀%'  then 1 else 0 end) as 含杂物沉淀类,"
                + " SUM(case when d.discharger_Type1 like '%有毒%'  then 1 else 0 end) as 有毒有害");
        sql.append(" from DRI_psh_discharger d where 1=1 and d.state<>'4' ");
        if (StringUtils.isNotBlank(area)) {
            sql.append(" and d.kj_area like :area");
            values.put("area", "%" + area + "%");
        }
        sql.append(" group by d.kj_town ");
        List<Object[]> list = pshDischargerDao.createSQLQuery(sql.toString(), values).list();
        //统计门牌
        StringBuffer mpSql = new StringBuffer("select t.town,sum(t.mpnum) from  menpai_kjtj t where 1=1 ");
        if (StringUtils.isNotBlank(area)) {
            mpSql.append(" and t.area like :area");
        }
        mpSql.append(" group by t.town ");
        List<Object[]> listMp = pshDischargerDao.createSQLQuery(mpSql.toString(), values).list();
        JSONArray jsonArray = appendKjTjData(list, listMp);
        return jsonArray.toString();
    }

    /**
     * 按空间（社区）获取统计数据
     */
    @Override
    public String getKjTjByTown(String area, String town) {
        Map<String, Object> values = new HashMap<String, Object>();
        StringBuffer sql = new StringBuffer("select d.kj_village,count(*) allNum,"
                + " SUM(case when d.discharger_Type1 like '%生活%'  then 1 else 0 end) as 生活污水类,"
                + " SUM(case when d.discharger_Type1 like '%餐饮%'  then 1 else 0 end) as 餐饮污水类,"
                + " SUM(case when d.discharger_Type1 like '%沉淀%'  then 1 else 0 end) as 含杂物沉淀类,"
                + " SUM(case when d.discharger_Type1 like '%有毒%'  then 1 else 0 end) as 有毒有害");
        sql.append(" from DRI_psh_discharger d where 1=1 and d.state<>'4' ");
        if (StringUtils.isNotBlank(area)) {
            sql.append(" and d.kj_area like :area");
            values.put("area", "%" + area + "%");
        }
        if (StringUtils.isNotBlank(town)) {
            sql.append(" and d.kj_town like :town");
            values.put("town", "%" + town + "%");
        }
        sql.append(" group by d.kj_village ");
        List<Object[]> list = pshDischargerDao.createSQLQuery(sql.toString(), values).list();
        //统计门牌
        StringBuffer mpSql = new StringBuffer("select t.village,sum(t.mpnum) from  menpai_kjtj t where 1=1 ");
        if (StringUtils.isNotBlank(area)) {
            mpSql.append(" and t.area like :area");
        }
        if (StringUtils.isNotBlank(town)) {
            mpSql.append(" and t.town like :town");
        }
        mpSql.append(" group by t.village ");
        List<Object[]> listMp = pshDischargerDao.createSQLQuery(mpSql.toString(), values).list();
        JSONArray jsonArray = appendKjTjData(list, listMp);
        return jsonArray.toString();
    }

    /**
     * 根据Form对象的查询条件作分页查询
     */
    @Transactional(readOnly = true)
    public String getSbedInf(Page<PshDischargerForm> page, PshDischargerForm form) {
        // 查询语句及参数
        StringBuffer hql = new StringBuffer("from PshDischarger ps where 1=1 and ps.state<>'4' ");
        Map<String, Object> values = new HashMap<String, Object>();
        JSONObject json = new JSONObject();
        // 查询条件
        if (form != null) {
            if (StringUtils.isNotBlank(form.getTeamOrgName())) {
                if ("区水务".equals(form.getTeamOrgName())) {
                    hql.append(" and ps.teamOrgName is null ");
                } else {
                    hql.append(" and ps.teamOrgName= :tn ");
                    values.put("tn", form.getTeamOrgName());
                }
            }
            if (StringUtils.isNotBlank(form.getParentOrgName())) {
                hql.append(" and ps.parentOrgName like :pn ");
                values.put("pn", "%" + form.getParentOrgName() + "%");
            }
        }
        //排序
        hql.append(HqlUtils.buildOrderBy(page, "ps"));
        // 执行分页查询操作
        Page<PshDischarger> pg = pshDischargerDao.findPage(page, hql.toString(), values);
        if (pg.getResult() != null) {
            json.put("rows", pg.getResult());
            json.put("total", pg.getTotalItems());
            json.put("code", 200);
        } else {
            json.put("code", 300);
            json.put("message", "参数错误!");
        }
        return json.toString();
    }

    @Override
    public List<Object[]> getExcelData(PshDischargerForm form,
                                       Map<String, Object> map) {
        JSONObject json = new JSONObject();
        List<Map> list = new ArrayList<>();
        Map values = new HashMap();
        StringBuffer hql = new StringBuffer();
        hql.append(" select t.id 编号,t.area 行政区域,t.town 所属镇街,t.name as 排水户名称,t.mph 门牌号,t.addr 详细地址,t.owner 产权人姓名,t.owner_tele 产权人联系电话, ");
        hql.append(" t.operator 经营人姓名,t.operator_tele 经营人联系电话,(case when t.has_cert1='1' then t.cert1_code else '无' end) 工商营业执照, ");
        hql.append(" (case when t.has_cert2='1' then '有' else '无' end) 接驳核准意见书,(case when t.has_cert3='1' then t.cert3_code else '无' end) 排水许可证, ");
        hql.append(" (case when t.has_cert4='1' then t.cert4_code else '无' end) 排污许可证,t.discharger_type1 行业类别, ");
        hql.append(" w.PIPE_TYPE 管类别,w.WELL_TYPE 井类别,w.WELL_PRO 井存在问题,w.WELL_DIR 排水去向,w.DRAIN_PRO 排水存在问题, ");
        hql.append(" (case when t.fac1='有' then t.fac1_cont || '，' || t.fac1_main || '，' || t.fac1_record else '无' end) 隔油池, ");
        hql.append(" (case when t.fac2='有' then t.fac2_cont || '，' || t.fac2_main || '，' || t.fac2_record else '无' end) 格栅, ");
        hql.append(" (case when t.fac3='有' then t.fac3_cont || '，' || t.fac3_main || '，' || t.fac3_record else '无' end) 沉淀池, ");
        hql.append(" (case when t.fac4 <> '无' and t.fac4 is not null then t.fac4 || '（' || t.fac4_cont || '，' || t.fac4_main || '，' || t.fac4_record || '）' else '无' end) 其他预处理设施, ");
        hql.append(" t.description 上报说明 ");
        hql.append(" from DRI_psh_discharger t left join  ");
        hql.append(" (select * from (select a.*,ROW_NUMBER()OVER(PARTITION BY a.discharge_id ORDER BY a.id) AS code_id from DRI_psh_discharger_well a) b where b.code_id=1) w  ");
        hql.append(" on t.id=w.discharge_id  ");
        hql.append(" where 1=1 and t.state<>'4' ");

        if (form != null) {
            if (StringUtils.isNotBlank(form.getName())) {
                hql.append(" and t.name like :name");
                values.put("name", "%" + form.getName() + "%");
            }
            if (StringUtils.isNotBlank(form.getArea())) {
                hql.append(" and t.area like :area");
                values.put("area", "%" + form.getArea() + "%");
            }
            if (StringUtils.isNotBlank(form.getTown())) {
                hql.append(" and t.town like :town");
                values.put("town", "%" + form.getTown() + "%");
            }
            if (StringUtils.isNotBlank(form.getHasCert1())) {
                hql.append(" and t.has_Cert1 = :hasCert1");
                values.put("hasCert1", form.getHasCert1());
            }
            if (StringUtils.isNotBlank(form.getHasCert3())) {
                hql.append(" and t.has_Cert3 = :hasCert3");
                values.put("hasCert3", form.getHasCert3());
            }
            if (StringUtils.isNotBlank(form.getHasCert4())) {
                hql.append(" and t.has_Cert4 = :hasCert4");
                values.put("hasCert4", form.getHasCert4());
            }
            if (StringUtils.isNotBlank(form.getDischargerType1())) {
                String[] pcode = form.getDischargerType1().split(",");
                int i = 0;
                for (String code : pcode) {
                    if (i == 0) {
                        hql.append(" and (t.discharger_Type1 = '" + code + "'");
                    } else {
                        hql.append(" or t.discharger_Type1 = '" + code + "'");
                    }
                    if (i == pcode.length - 1) {
                        hql.append(" )");
                    }
                    i++;
                }

            }
/*			if(StringUtils.isNotBlank(form.getDischargerType2())){
				String[] pcode = form.getDischargerType2().split(",");
				int i=0;
				for(String code : pcode){
					if(i==0){
						hql.append(" and (ps.dischargerType2 like '%"+code+"%'");
					}else{
						hql.append(" or ps.dischargerType2 like '%"+code+"%'");
					}
					if(i==pcode.length-1){
						hql.append(" )");
					}
					i++;
				}
			}*/
        }
        if (map != null) {
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
            if (map.get("startTime") != null) {
                hql.append(" and to_char(t.mark_Time,'yyyy-MM-dd') >= :startTime ");
                values.put("startTime", df.format((Date) map.get("startTime")));
            }
            if (map.get("endTime") != null) {
                hql.append(" and to_char(t.mark_Time,'yyyy-MM-dd') <= :endTime");
                values.put("endTime", df.format((Date) map.get("endTime")));
            }
        }
        SQLQuery query = pshDischargerDao.createSQLQuery(hql.toString(), values);
        List<Object[]> resultlist = query.list();
        if (resultlist != null) {
            return resultlist;
        }
        return null;
    }

    @Override
    public List<Object[]> getExcelData(PshDischargerForm form) {
        Map<String, Object> values = new HashMap<String, Object>();
        StringBuffer sql = new StringBuffer("select ROW_NUMBER() OVER (ORDER BY d.kj_area,d.kj_town, d.kj_village desc),"
                + "case when d.kj_area is null then '暂无' else d.kj_area end,"
                + "case when d.kj_town is null then '暂无'  else d.kj_town end, "
                + "case when d.kj_village is null then '暂无'  else d.kj_village end,"
                + " 0,"//case when min(m.mpnum) is null then 0  else min(m.mpnum) end 四标四实门牌数
                + " 0,"//需要替换 新增门牌数
                + " count(distinct m2.s_guid),"//排水户已摸查门牌数
                + "count(*) 摸查户数,"
                + " SUM(case when d.discharger_Type1 like '%生活%'  then 1 else 0 end) as 生活污水类,"
                + " SUM(case when d.discharger_Type1 like '%餐饮%'  then 1 else 0 end) as 餐饮污水类,"
                + " SUM(case when d.discharger_Type1 like '%沉淀%'  then 1 else 0 end) as 含杂物沉淀类,"
                + " SUM(case when d.discharger_Type1 like '%有毒%'  then 1 else 0 end) as 有毒有害");
        sql.append(" from DRI_psh_discharger d ");
//     	sql.append(" left  join  menpai_kjtj m on m.area=d.kj_area and m.town=d.kj_town and m.village=d.kj_village ");
        sql.append(" left join sde.menpai m2 on m2.s_guid=d.doorplate_address_code  and m2.isexist=0 ");
        sql.append(" where 1=1 and d.state<>'4' ");
        if (StringUtils.isNotBlank(form.getKjArea()) && !"全市".equals(form.getKjArea())) {
            sql.append(" and d.kj_area like :area");
            values.put("area", "%" + form.getKjArea() + "%");
        }
        if (StringUtils.isNotBlank(form.getKjTown())) {
            sql.append(" and d.kj_town like :town");
            values.put("town", "%" + form.getKjTown() + "%");
        }
        sql.append(" group by d.kj_area,d.kj_town, d.kj_village order  by d.kj_area,d.kj_town, d.kj_village desc ");
        List<Object[]> list = pshDischargerDao.createSQLQuery(sql.toString(), values).list();
        //统计四标四实门牌
        StringBuffer mpSql = new StringBuffer("select "
                + "case when m3.area is null then '暂无' else m3.area end,"
                + "case when m3.town is null then '暂无'  else m3.town end, "
                + "case when m3.village is null then '暂无'  else m3.village end,"
                + "sum(m3.mpnum)  "
                + "from  menpai_kjtj m3 where 1=1");
        if (StringUtils.isNotBlank(form.getKjArea()) && !"全市".equals(form.getKjArea())) {
            mpSql.append(" and m3.area like :area");
        }
        if (StringUtils.isNotBlank(form.getKjTown())) {
            mpSql.append(" and m3.town like :town");
        }
        mpSql.append(" group by m3.area,m3.town,m3.village order by m3.area,m3.town,m3.village desc ");
        List<Object[]> listMp = pshDischargerDao.createSQLQuery(mpSql.toString(), values).list();
        list = appendTjData(list, listMp, 4);
        //统计新增门牌
        StringBuffer mpSql2 = new StringBuffer("select "
                + "case when m3.kj_area is null then '暂无' else m3.kj_area end,"
                + "case when m3.kj_town is null then '暂无'  else m3.kj_town end, "
                + "case when m3.kj_village is null then '暂无'  else m3.kj_village end,"
                + "count(*)  "
                + "from  DRI_psh_menpai m3 where 1=1");
        if (StringUtils.isNotBlank(form.getKjArea()) && !"全市".equals(form.getKjArea())) {
            mpSql2.append(" and m3.kj_area like :area");
        }
        if (StringUtils.isNotBlank(form.getKjTown())) {
            mpSql2.append(" and m3.kj_town like :town");
        }
        mpSql2.append(" group by m3.kj_area,m3.kj_town,m3.kj_village order by m3.kj_area,m3.kj_town,m3.kj_village desc ");
        List<Object[]> listMp2 = pshDischargerDao.createSQLQuery(mpSql2.toString(), values).list();
        list = appendTjData(list, listMp2, 5);
        //全市数据需要重新排序，因为有些数据是后面拼上去的，导致同是天河区，有可能隔开了
        //思路是，先循环封装到对象中，根据对象的字段进行排序，排序以后再循环封装到原object[]中返回
        if (list != null && list.size() > 0 && "全市".equals(form.getKjArea())) {
            List<PshDischargerForm> listTemp = new ArrayList<>();
            for (Object[] obj : list) {
                PshDischargerForm d = new PshDischargerForm();
                d.setKjArea(obj[1].toString());
                d.setKjTown(obj[2].toString());
                d.setKjVillage(obj[3].toString());
                d.setDirectOrgId(obj[4].toString());
                d.setDirectOrgName(obj[5].toString());
                d.setTeamOrgId(obj[6].toString());
                d.setTeamOrgName(obj[7].toString());
                d.setParentOrgId(obj[8].toString());
                d.setParentOrgName(obj[9].toString());
                d.setCheckPersonId(obj[10].toString());
                d.setCheckPerson(obj[11].toString());
                listTemp.add(d);
            }
            //开始按照这个三个字段进行排序
            //ListCompareUtils.sort(listTemp, true, "kjArea", "kjTown","kjVillage");
            //排序完毕，再还原封装，返回
            if (listTemp != null && listTemp.size() > 0) {
                List<Object[]> listTemp2 = new ArrayList<Object[]>();
                for (PshDischargerForm mp : listTemp) {
                    Object[] obj = new Object[12];
                    obj[0] = listTemp2.size() + 1;
                    obj[1] = mp.getKjArea();
                    obj[2] = mp.getKjTown();
                    obj[3] = mp.getKjVillage();
                    obj[4] = mp.getDirectOrgId();
                    obj[5] = mp.getDirectOrgName();
                    obj[6] = mp.getTeamOrgId();
                    obj[7] = mp.getTeamOrgName();
                    obj[8] = mp.getParentOrgId();
                    obj[9] = mp.getParentOrgName();
                    obj[10] = mp.getCheckPersonId();
                    obj[11] = mp.getCheckPerson();
                    listTemp2.add(obj);
                }
                return listTemp2;
            }
        }
        return list;
    }

    /**
     * <p>Description: 空间统计拼接数据</p>
     * <p>Company: </p>
     *
     * @param list
     * @param listMp
     * @return
     * @author xuzy
     * @date 2018年8月17日下午2:27:41
     */
    private List<Object[]> appendTjData(List<Object[]> list, List<Object[]> listMp, int index) {
        if (listMp != null && listMp.size() > 0 && list != null && list.size() > 0) {
            for (Object[] mp : listMp) {
                Boolean falg = true;
                for (Object[] o : list) {
                    if (mp[0].equals(o[1]) && mp[1].equals(o[2]) && mp[2].equals(o[3])) {
                        o[index] = mp[3];//如果满足同一个地方，那么就把新增的门牌数量替换进去
                        falg = false;
                    }
                }
                if (falg) {//如果有新增门牌，但是下面没有排水户
                    Object[] obj = new Object[12];
                    obj[0] = list.size() + 1;
                    obj[1] = mp[0];
                    obj[2] = mp[1];
                    obj[3] = mp[2];
                    if (index == 4) {//四标四实
                        obj[4] = mp[3];
                        obj[5] = 0;
                    }
                    if (index == 5) {//新增门牌数
                        obj[4] = 0;
                        obj[5] = mp[3];
                    }
                    obj[6] = 0;
                    obj[7] = 0;
                    obj[8] = 0;
                    obj[9] = 0;
                    obj[10] = 0;
                    obj[11] = 0;
                    list.add(obj);
                }
            }
        } else if (listMp != null && listMp.size() > 0 && (list == null || list.size() == 0)) {
            list = new ArrayList<>();//可能是排水户没有信息，但是有门牌的数据，这里需要拼接一下
            for (Object[] mp : listMp) {
                Object[] obj = new Object[12];
                obj[0] = list.size() + 1;
                obj[1] = mp[0];
                obj[2] = mp[1];
                obj[3] = mp[2];
                if (index == 4) {//四标四实
                    obj[4] = mp[3];
                    obj[5] = 0;
                }
                if (index == 5) {//新增门牌数
                    obj[4] = 0;
                    obj[5] = mp[3];
                }
                obj[6] = 0;
                obj[7] = 0;
                obj[8] = 0;
                obj[9] = 0;
                obj[10] = 0;
                obj[11] = 0;
                list.add(obj);
            }
        }
        return list;
    }
}