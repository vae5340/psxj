package com.augurit.awater.dri.psh.pshLackMark.rest.util.arcgis.form;

public class FeatureForm {
	private Long id;
	private Long objectid;
	private String mark_pid;
	private String mark_person;
	private Long mark_time;
	private Long update_time;
	private String desription;
	private String report_type;
	private String correct_type;
	private String attr_one;
	private String attr_two;
	private String attr_three;
	private String attr_four;
	private String attr_five;
	private String road;
	private String addr;
	private Double x;
	private Double y;
	private String layer_name;
	private String us_id;
	private String team_org_id;
	private String team_org_name;
	private String direct_org_id;
	private String direct_org_name;
	private String supervise_org_id;
	private String supervise_org_name;
	private String parent_org_id;
	private String parent_org_name;
	private String check_state;
	private String check_person_id;
	private String check_person;
	private Long check_time;
	private String check_desription;
	private String check_type; //数据审核时bs端默认为2
	
	private Long mark_id;
	private String origin_addr;
	private String origin_road;
	private Double orgin_x;
	private Double orgin_y;
	private String origin_attr_one;
	private String origin_attr_two;
	private String origin_attr_three;
	private String origin_attr_four;
	private String origin_attr_five;
	private String user_addr;
	private Double user_x;
	private Double user_y;
	private String user_id;
	
	private String pcode;
	private String child_code;
	private String city_village;
	private Long psh;
	
	
	public Long getPsh() {
		return psh;
	}
	public void setPsh(Long psh) {
		this.psh = psh;
	}
	public Long getObjectid() {
		return objectid;
	}
	public void setObjectid(Long objectid) {
		this.objectid = objectid;
	}
	public String getMark_pid() {
		return mark_pid;
	}
	public void setMark_pid(String mark_pid) {
		this.mark_pid = mark_pid;
	}
	public String getMark_person() {
		return mark_person;
	}
	public void setMark_person(String mark_person) {
		this.mark_person = mark_person;
	}
	
	public Long getMark_time() {
		return mark_time;
	}
	public void setMark_time(Long mark_time) {
		this.mark_time = mark_time;
	}
	public String getDesription() {
		return desription;
	}
	public void setDesription(String desription) {
		this.desription = desription;
	}
	public String getReport_type() {
		return report_type;
	}
	public void setReport_type(String report_type) {
		this.report_type = report_type;
	}
	public String getCorrect_type() {
		return correct_type;
	}
	public void setCorrect_type(String correct_type) {
		this.correct_type = correct_type;
	}
	public String getAttr_one() {
		return attr_one;
	}
	public void setAttr_one(String attr_one) {
		this.attr_one = attr_one;
	}
	public String getAttr_two() {
		return attr_two;
	}
	public void setAttr_two(String attr_two) {
		this.attr_two = attr_two;
	}
	public String getAttr_three() {
		return attr_three;
	}
	public void setAttr_three(String attr_three) {
		this.attr_three = attr_three;
	}
	public String getAttr_four() {
		return attr_four;
	}
	public void setAttr_four(String attr_four) {
		this.attr_four = attr_four;
	}
	public String getAttr_five() {
		return attr_five;
	}
	public void setAttr_five(String attr_five) {
		this.attr_five = attr_five;
	}
	public String getRoad() {
		return road;
	}
	public void setRoad(String road) {
		this.road = road;
	}
	public String getAddr() {
		return addr;
	}
	public void setAddr(String addr) {
		this.addr = addr;
	}
	
	
	public Double getX() {
		return x;
	}
	public void setX(Double x) {
		this.x = x;
	}
	public Double getY() {
		return y;
	}
	public void setY(Double y) {
		this.y = y;
	}
	public String getLayer_name() {
		return layer_name;
	}
	public void setLayer_name(String layer_name) {
		this.layer_name = layer_name;
	}
	public String getUs_id() {
		return us_id;
	}
	public void setUs_id(String us_id) {
		this.us_id = us_id;
	}
	public String getTeam_org_id() {
		return team_org_id;
	}
	public void setTeam_org_id(String team_org_id) {
		this.team_org_id = team_org_id;
	}
	public String getTeam_org_name() {
		return team_org_name;
	}
	public void setTeam_org_name(String team_org_name) {
		this.team_org_name = team_org_name;
	}
	public String getDirect_org_id() {
		return direct_org_id;
	}
	public void setDirect_org_id(String direct_org_id) {
		this.direct_org_id = direct_org_id;
	}
	public String getDirect_org_name() {
		return direct_org_name;
	}
	public void setDirect_org_name(String direct_org_name) {
		this.direct_org_name = direct_org_name;
	}
	public String getSupervise_org_id() {
		return supervise_org_id;
	}
	public void setSupervise_org_id(String supervise_org_id) {
		this.supervise_org_id = supervise_org_id;
	}
	public String getSupervise_org_name() {
		return supervise_org_name;
	}
	public void setSupervise_org_name(String supervise_org_name) {
		this.supervise_org_name = supervise_org_name;
	}
	public String getParent_org_id() {
		return parent_org_id;
	}
	public void setParent_org_id(String parent_org_id) {
		this.parent_org_id = parent_org_id;
	}
	public String getParent_org_name() {
		return parent_org_name;
	}
	public void setParent_org_name(String parent_org_name) {
		this.parent_org_name = parent_org_name;
	}
	public String getCheck_state() {
		return check_state;
	}
	public void setCheck_state(String check_state) {
		this.check_state = check_state;
	}
	public String getCheck_person_id() {
		return check_person_id;
	}
	public void setCheck_person_id(String check_person_id) {
		this.check_person_id = check_person_id;
	}
	public String getCheck_person() {
		return check_person;
	}
	public void setCheck_person(String check_person) {
		this.check_person = check_person;
	}
	public Long getCheck_time() {
		return check_time;
	}
	public void setCheck_time(Long check_time) {
		this.check_time = check_time;
	}
	public String getCheck_desription() {
		return check_desription;
	}
	public void setCheck_desription(String check_desription) {
		this.check_desription = check_desription;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getCheck_type() {
		return check_type;
	}
	public void setCheck_type(String check_type) {
		this.check_type = check_type;
	}
	public String getOrigin_addr() {
		return origin_addr;
	}
	public void setOrigin_addr(String origin_addr) {
		this.origin_addr = origin_addr;
	}
	public String getOrigin_road() {
		return origin_road;
	}
	public void setOrigin_road(String origin_road) {
		this.origin_road = origin_road;
	}
	public String getOrigin_attr_one() {
		return origin_attr_one;
	}
	public void setOrigin_attr_one(String origin_attr_one) {
		this.origin_attr_one = origin_attr_one;
	}
	public String getOrigin_attr_two() {
		return origin_attr_two;
	}
	public void setOrigin_attr_two(String origin_attr_two) {
		this.origin_attr_two = origin_attr_two;
	}
	public String getOrigin_attr_three() {
		return origin_attr_three;
	}
	public void setOrigin_attr_three(String origin_attr_three) {
		this.origin_attr_three = origin_attr_three;
	}
	public String getOrigin_attr_four() {
		return origin_attr_four;
	}
	public void setOrigin_attr_four(String origin_attr_four) {
		this.origin_attr_four = origin_attr_four;
	}
	public String getOrigin_attr_five() {
		return origin_attr_five;
	}
	public void setOrigin_attr_five(String origin_attr_five) {
		this.origin_attr_five = origin_attr_five;
	}
	public String getUser_addr() {
		return user_addr;
	}
	public void setUser_addr(String user_addr) {
		this.user_addr = user_addr;
	}
	public Long getMark_id() {
		return mark_id;
	}
	public void setMark_id(Long mark_id) {
		this.mark_id = mark_id;
	}
	public Double getOrgin_x() {
		return orgin_x;
	}
	public void setOrgin_x(Double orgin_x) {
		this.orgin_x = orgin_x;
	}
	public Double getOrgin_y() {
		return orgin_y;
	}
	public void setOrgin_y(Double orgin_y) {
		this.orgin_y = orgin_y;
	}
	public Double getUser_x() {
		return user_x;
	}
	public void setUser_x(Double user_x) {
		this.user_x = user_x;
	}
	public Double getUser_y() {
		return user_y;
	}
	public void setUser_y(Double user_y) {
		this.user_y = user_y;
	}
	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	public Long getUpdate_time() {
		return update_time;
	}
	public void setUpdate_time(Long update_time) {
		this.update_time = update_time;
	}
	public String getPcode() {
		return pcode;
	}
	public void setPcode(String pcode) {
		this.pcode = pcode;
	}
	public String getChild_code() {
		return child_code;
	}
	public void setChild_code(String child_code) {
		this.child_code = child_code;
	}
	public String getCity_village() {
		return city_village;
	}
	public void setCity_village(String city_village) {
		this.city_village = city_village;
	}
	
}
