//package com.augurit.agcom.gx;
//
//import com.frame.database.JdataBean;
//import com.frame.pageform.PageForm;
//import com.frame.pageform.RequestContext;
//
//import javax.servlet.http.HttpServletResponse;
//import java.io.OutputStream;
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.List;
//
///**
// * @author 王海锋
// * @version 1.0
// * @Title: 系统
// * @Description:
// * @Copyright: Copyright (c) 2014
// * @Company:
// * @CreatedTime:2014-3-4 上午09:11:41
// */
//
//public class GxAnalysisPage extends PageForm {
//
//    @Override
//    public String execute() throws Exception {
//        return null;
//    }
//
//    /**
//     * 功能:管线横断面分析<br>
//     * 参数:<br>
//     * 作者:王海锋<br>
//     * 时间:2014-3-4 上午10:39:18<br>
//     * 说明:<br>
//     * 变更:<br>
//     *
//     * @throws Exception
//     */
//    public String crossSectionAnalyse(String x1, String y1, String x2,
//                                      String y2, String layers) throws Exception {
//        GxAnalysisDao dao = new GxAnalysisDao();
//        if (layers != null && !"".equals(layers)) {
//            List<GxLine> gxlist = new ArrayList<GxLine>();
//            String[] lids = layers.split(",");
//            for (String lid : lids) {
//                List<GxLine> list = dao.getLineByLine(x1 + " " + y1 + "," + x2
//                        + " " + y2, lid);
//                gxlist.addAll(list);
//            }
//            getJsonObject().put("gxlines", gxlist);
//        }
//
//        return getJsonObject().toString();
//    }
//
//    /**
//     * 功能:管线纵断面分析（已废弃）<br>
//     * 参数:<br>
//     * 作者:王海锋<br>
//     * 时间:2014-3-6 上午10:36:38<br>
//     * 说明:<br>
//     * 变更:<br>
//     */
//    public String longitudinalSectionAnalyse(String ids, String layers)
//            throws Exception {
//        GxAnalysisDao dao = new GxAnalysisDao();
//        if (layers != null && !layers.equals("")) {
//            String[] lids = layers.split(",");
//            List<GxLine> gxlist = new ArrayList<GxLine>();
//            for (String lid : lids) {
//                List<GxLine> list = dao.getLineByIds(ids.split(","), lid);
//                gxlist.addAll(list);
//            }
//            getJsonObject().put("gxlines", gxlist);
//        }
//        return getJsonObject().toString();
//    }
//
//    /**
//     * 纵断面分析
//     *
//     * @param x
//     * @param y
//     * @param layers
//     * @return
//     * @throws Exception
//     */
//    public String longitudinalSectionAnalyse2(double x, double y, String layers)
//            throws Exception {
//        GxAnalysisDao dao = new GxAnalysisDao();
//        if (layers != null && !layers.equals("")) {
//            String[] lids = layers.split(",");
//            List<GxLine> gxlist = new ArrayList<GxLine>();
//            for (String lid : lids) {
//                List<GxLine> list = dao.getLineByXY(x, y, lid);
//                gxlist.addAll(list);
//            }
//            getJsonObject().put("gxlines", gxlist);
//        }
//        return getJsonObject().toString();
//    }
//
//    /**
//     * 功能:寿命分析<br>
//     * 参数:<br>
//     * 作者:王海锋<br>
//     * 时间:2014-4-24 上午09:52:50<br>
//     * 说明:<br>
//     * 变更:<br>
//     *
//     * @throws Exception
//     */
//    public String smingAnalyse() throws Exception {
//        RequestContext
//                .getContext()
//                .getRequest()
//                .setAttribute(
//                        "dlist",
//                        new GxAnalysisDao().smingAnalyseList(new String[]{
//                                "YSL_GX", "WSL_GX"}));
//        return "/project/agcomquery/analyse/gxsmfenx.jsp";
//    }
//
//    public void smingAnalyseexpxls() throws Exception {
//        ExcelOper xls = new ExcelOper();
//        xls.createWorkbook();
//        xls.createRow(0);
//        xls.addRowCells(new String[]{"唯一编号", "所在道路", "开始时间", "结束时间", "管类型",
//                "管长", "管径", "起始埋深", "终止埋深"});
//        List<JdataBean> list = new GxAnalysisDao()
//                .smingAnalyseList(new String[]{"YSL_GX", "WSL_GX"});
//        for (int r = 0; r < list.size(); r++) {
//            JdataBean data = list.get(r);
//            xls.createRow(r + 1);
//            xls.addRowCells(new String[]{
//                    data.get("usid").toString(),
//                    data.get("ownerroad") == null ? "" : data.get("ownerroad")
//                            .toString(),
//                    data.get("starttime") == null ? "" : data.get("starttime")
//                            .toString(),
//                    data.get("endtime") == null ? "" : data.get("endtime")
//                            .toString(),
//                    data.get("type") == null ? "" : data.get("type").toString(),
//                    data.get("length") == null ? "" : data.get("length")
//                            .toString(),
//                    data.get("d_s") == null ? "" : data.get("d_s").toString(),
//                    data.get("s_deep") == null ? "" : data.get("s_deep")
//                            .toString(),
//                    data.get("e_deep") == null ? "" : data.get("e_deep")
//                            .toString()});
//        }
//        HttpServletResponse response = RequestContext.getContext()
//                .getResponse();
//        String fname = "超出使用寿命的管材"
//                + new java.text.SimpleDateFormat("yyyy-MM-dd")
//                .format(new Date());
//        response.setHeader("content-disposition", "attachment; filename="
//                + new String(fname.getBytes("GBK"), "ISO-8859-1") + ".xls");// 设定输出文件头
//        response.setContentType("application/msexcel");// 定义输出类型
//        OutputStream out = response.getOutputStream();
//        xls.write(out);
//    }
//
//    public String getLayerInfo(String layerTbname) throws Exception {
//        JdataBean data = new GxAnalysisDao().getLayerInfo(layerTbname);
//        if (data != null) {
//            getJsonObject().put("proid", data.get("proid").toString());
//            getJsonObject().put("layerid", data.get("layerid").toString());
//        }
//        return getJsonObject().toString();
//    }
//
//    public String getLineBuffer(String wkt, String distance) throws Exception {
//        GxAnalysisDao dao = new GxAnalysisDao();
//        String bufferWKT = dao.getLineBuffer(wkt, distance);
//        List<String> wktList = new ArrayList<String>();
//        wktList.add(bufferWKT);
//        getJsonObject().put("bufferWKT", wktList);
//        return getJsonObject().toString();
//    }
//
//    public String getPolygonBuffer(String wkt, String distance) throws Exception {
//        GxAnalysisDao dao = new GxAnalysisDao();
//        String bufferWKT = dao.getPolygonBuffer(wkt, distance);
//        List<String> wktList = new ArrayList<String>();
//        wktList.add(bufferWKT);
//        getJsonObject().put("bufferWKT", wktList);
//        return getJsonObject().toString();
//    }
//
//    public String getRoadCross(int roadSelOID, int jckSelOID) throws Exception {
//        GxAnalysisDao dao = new GxAnalysisDao();
//        String lonlat = dao.getRoadCross(roadSelOID, jckSelOID);
//        List<String> lonlatList = new ArrayList<String>();
//        lonlatList.add(lonlat);
//        getJsonObject().put("lonlat", lonlatList);
//        return getJsonObject().toString();
//    }
//}
