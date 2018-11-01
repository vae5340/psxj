package  com.augurit.awater.util.code;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class YjCode {

    public static List<Map<String,String>> templateGradeCodeList = new ArrayList();
    public static List<Map<String,String>> templateTypeCodeList = new ArrayList();
    public static List<Map<String,String>> AlarmSmsTypeCodeList = new ArrayList();

    static{
        Map mapGrade = new HashMap<String, String>();
        mapGrade.put("typeCode","YA_TEMPLATE_GRADE");
        mapGrade.put("itemCode","4");
        mapGrade.put("itemName","四级应急预案");
        templateGradeCodeList.add(mapGrade);
        Map mapGrade2 = new HashMap<String, String>();
        mapGrade2.put("typeCode","YA_TEMPLATE_GRADE");
        mapGrade2.put("itemCode","3");
        mapGrade2.put("itemName","三级应急预案");
        templateGradeCodeList.add(mapGrade2);
        Map mapGrade3 = new HashMap<String, String>();
        mapGrade3.put("typeCode","YA_TEMPLATE_GRADE");
        mapGrade3.put("itemCode","2");
        mapGrade3.put("itemName","二级应急预案");
        templateGradeCodeList.add(mapGrade3);
        Map mapGrade4 = new HashMap<String, String>();
        mapGrade4.put("typeCode","YA_TEMPLATE_GRADE");
        mapGrade4.put("itemCode","1");
        mapGrade4.put("itemName","一级应急预案");
        templateGradeCodeList.add(mapGrade4);

        Map mapType = new HashMap<String, String>();
        mapType.put("typeCode","YA_TEMPLATE_TYPE");
        mapType.put("itemCode","1");
        mapType.put("itemName","防涝应急预案");
        templateTypeCodeList.add(mapType);
        Map mapType2 = new HashMap<String, String>();
        mapType2.put("typeCode","YA_TEMPLATE_TYPE");
        mapType2.put("itemCode","2");
        mapType2.put("itemName","防旱应急预案");
        templateTypeCodeList.add(mapType2);

        Map mapSms = new HashMap<String, String>();
        mapSms.put("typeCode","YA_ALARM_SMS_TYPE");
        mapSms.put("itemCode","1");
        mapSms.put("itemName","启动督办通知");
        mapSms.put("itemStatus","1");
        AlarmSmsTypeCodeList.add(mapSms);
        Map mapSms2 = new HashMap<String, String>();
        mapSms2.put("typeCode","YA_ALARM_SMS_TYPE");
        mapSms2.put("itemCode","2");
        mapSms2.put("itemName","提交事中报告");
        mapSms2.put("itemStatus","1");
        AlarmSmsTypeCodeList.add(mapSms2);
        Map mapSms3 = new HashMap<String, String>();
        mapSms3.put("typeCode","YA_ALARM_SMS_TYPE");
        mapSms3.put("itemCode","3");
        mapSms3.put("itemName","结束督办通知");
        mapSms3.put("itemStatus","1");
        AlarmSmsTypeCodeList.add(mapSms3);
        Map mapSms4 = new HashMap<String, String>();
        mapSms4.put("typeCode","YA_ALARM_SMS_TYPE");
        mapSms4.put("itemCode","4");
        mapSms4.put("itemName","抢险督办通知");
        mapSms4.put("itemStatus","1");
        AlarmSmsTypeCodeList.add(mapSms4);
        Map mapSms5 = new HashMap<String, String>();
        mapSms5.put("typeCode","YA_ALARM_SMS_TYPE");
        mapSms5.put("itemCode","11");
        mapSms5.put("itemName","启动响应预警");
        mapSms5.put("itemStatus","1");
        AlarmSmsTypeCodeList.add(mapSms5);
        Map mapSms6 = new HashMap<String, String>();
        mapSms6.put("typeCode","YA_ALARM_SMS_TYPE");
        mapSms6.put("itemCode","12");
        mapSms6.put("itemName","升级应急响应预警");
        mapSms6.put("itemStatus","1");
        AlarmSmsTypeCodeList.add(mapSms6);
        Map mapSms7 = new HashMap<String, String>();
        mapSms7.put("typeCode","YA_ALARM_SMS_TYPE");
        mapSms7.put("itemCode","13");
        mapSms7.put("itemName","降级应急响应预警");
        mapSms7.put("itemStatus","1");
        AlarmSmsTypeCodeList.add(mapSms7);
        Map mapSms8 = new HashMap<String, String>();
        mapSms8.put("typeCode","YA_ALARM_SMS_TYPE");
        mapSms8.put("itemCode","14");
        mapSms8.put("itemName","解除预警");
        mapSms8.put("itemStatus","1");
        AlarmSmsTypeCodeList.add(mapSms8);
    }
}
