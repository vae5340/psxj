//package com.augurit.agcom.gx;
//
//import com.augurit.agcom.dbpool.DBPoolManager;
//import  com.augurit.water.util.pipe.FieldNameHelper;
//import  com.augurit.water.util.pipe.LayerConfigHelper;
//import com.frame.database.DbOperate;
//import com.frame.database.JdataBean;
//import org.unitils.thirdparty.org.apache.commons.dbutils.DbUtils;
//
//import java.io.BufferedReader;
//import java.sql.*;
//import java.util.ArrayList;
//import java.util.List;
//
///**
// * @author 王海锋
// * @version 1.0
// * @Title: 系统
// * @Description:
// * @Copyright: Copyright (c) 2014
// * @Company:
// * @CreatedTime:2014-3-4 上午11:09:06
// */
//
//public class GxAnalysisDao {
//
//    public String getLayerTable(String layerid) throws Exception {
//        DbOperate db = DbOperate.getInstance();
//        List<JdataBean> slist = db
//                .query("select t.layer_table from ag_sup_layer t,ag_sup_project_layer p Where p.layer_id=t.id and p.id=?",
//                        new Object[]{layerid});
//        return slist.get(0).get("layer_table").toString();
//    }
//
//    public List<GxLine> getLineByLine(String lines, String layer)
//            throws Exception {
//        LayerInfo layerinfo = getDataSourceId(layer);
//        List<GxLine> glist = new ArrayList<GxLine>();
//        if (layerinfo != null) {
//            Connection conn = DBPoolManager.getConnection(layerinfo
//                    .getSourceId());
//            PreparedStatement ps = null;
//            ResultSet rs = null;
//            try {
//                String srid = getSrid(layer, layerinfo.getOwner(), conn);
//                String str = " t.SHAPE,sde.st_linestring('LINESTRING(" + lines
//                        + ")'," + srid + ")";
//                String sql = "select t.*,t.shape.len as shapelen,sde.st_X(sde.sde.st_intersection("
//                        + str
//                        + "))as x,sde.st_Y(sde.sde.st_intersection("
//                        + str
//                        + ")) as y from "
//                        + layer.toUpperCase()
//                        + " t where 1=1 and ( sde.ST_Intersects(t.SHAPE,sde.st_linestring('LINESTRING("
//                        + lines
//                        + ")',"
//                        + srid
//                        + ")) = 1  ) order by t."
//                        + layerinfo.getKeyName();
//                ps = conn.prepareStatement(sql);
//                rs = ps.executeQuery();
//
//                FieldNameHelper fieldNameHelper = new FieldNameHelper();
//
//                while (rs.next()) {
//                    GxLine line = new GxLine();
//
//                    line.setObjid(rs.getString(layerinfo.getKeyName()));
//                    line.setS_deep(new Double(rs.getObject(
//                            fieldNameHelper.S_Deep).toString()));// 单位m
//                    line.setE_deep(new Double(rs.getObject(
//                            fieldNameHelper.E_Deep).toString()));// 单位m
//                    line.setX(rs.getObject(fieldNameHelper.X) == null ? "" : rs
//                            .getObject(fieldNameHelper.X).toString());
//                    line.setY(rs.getObject(fieldNameHelper.Y) == null ? "" : rs
//                            .getObject(fieldNameHelper.Y).toString());
//                    line.setLength(rs.getObject("shapelen") == null ? "" : rs
//                            .getObject("shapelen").toString());
//                    line.setType(rs.getObject(fieldNameHelper.Type) == null ? ""
//                            : rs.getObject(fieldNameHelper.Type).toString());
//                    line.setOwnerRoad(rs.getObject(fieldNameHelper.Address) == null ? ""
//                            : rs.getObject(fieldNameHelper.Address).toString());
//                    line.setOwnerDept(rs.getObject(fieldNameHelper.Belong) == null ? ""
//                            : rs.getObject(fieldNameHelper.Belong).toString());
//                    line.setUsId(rs.getObject(fieldNameHelper.LNO) == null ? ""
//                            : rs.getObject(fieldNameHelper.LNO).toString());
//                    // line.setMaterial(rs.getObject("material")==null?"":rs.getObject("material").toString());
//                    if (rs.getObject(fieldNameHelper.PSize) != null
//                            && !"".equals(rs.getObject(fieldNameHelper.PSize)
//                            .toString())) {
//                        String psize = rs.getObject(fieldNameHelper.PSize)
//                                .toString();
//                        double r = 0;
//                        if (psize.indexOf("X") != -1) {
//                            String[] ss = psize.split("X");
//                            r = (Double.parseDouble(ss[0]) + Double
//                                    .parseDouble(ss[1])) / 2;
//                        } else
//                            r = Double.parseDouble(psize);
//                        line.setR(new Double(r));// 单位mm
//                    } else
//                        line.setR(0d);
//                    line.setLayer(layer);
//                    glist.add(line);
//                }
//            } catch (Exception e) {
//                throw e;
//            } finally {
//                DbUtils.closeQuietly(conn, ps, rs);
//            }
//        }
//        return glist;
//    }
//
//    /**
//     * 通过坐标查询管线
//     *
//     * @param x
//     * @param y
//     * @param layer
//     * @return
//     * @throws Exception
//     */
//    public List<GxLine> getLineByXY(double x, double y, String layer)
//            throws Exception {
//        LayerInfo layerinfo = getDataSourceId(layer);
//        List<GxLine> glist = new ArrayList<GxLine>();
//        if (layerinfo != null) {
//            Connection conn = DBPoolManager.getConnection(layerinfo
//                    .getSourceId());
//            PreparedStatement ps = null;
//            ResultSet rs = null;
//            try {
//                String srid = getSrid(layer, layerinfo.getOwner(), conn);
//                // 用坐标点做一个缓冲，再查询管线
//                String sql = "select t.*,t.shape.len as shapelen from "
//                        + layer.toUpperCase()
//                        + " t where 1=1 and ( sde.ST_Intersects(t.SHAPE,sde.ST_Buffer(sde.st_point("
//                        + x + "," + y + "," + srid + "),1)) = 1 ) order by t."
//                        + layerinfo.getKeyName();
//
//                ps = conn.prepareStatement(sql);
//                rs = ps.executeQuery();
//
//                FieldNameHelper fieldNameHelper = new FieldNameHelper();
//
//                while (rs.next()) {
//                    GxLine line = new GxLine();
//
//                    line.setObjid(rs.getString(layerinfo.getKeyName()));
//                    line.setS_deep(new Double(rs.getObject(
//                            fieldNameHelper.S_Deep).toString()));// 单位m
//                    line.setE_deep(new Double(rs.getObject(
//                            fieldNameHelper.E_Deep).toString()));// 单位m
//                    // line.setX(rs.getObject(fieldNameHelper.X) == null ? "" :
//                    // rs
//                    // .getObject(fieldNameHelper.X).toString());
//                    // line.setY(rs.getObject(fieldNameHelper.Y) == null ? "" :
//                    // rs
//                    // .getObject(fieldNameHelper.Y).toString());
//                    line.setLength(rs.getObject("shapelen") == null ? "" : rs
//                            .getObject("shapelen").toString());
//                    line.setType(rs.getObject(fieldNameHelper.Type) == null ? ""
//                            : rs.getObject(fieldNameHelper.Type).toString());
//                    line.setOwnerRoad(rs.getObject(fieldNameHelper.Address) == null ? ""
//                            : rs.getObject(fieldNameHelper.Address).toString());
//                    line.setOwnerDept(rs.getObject(fieldNameHelper.Belong) == null ? ""
//                            : rs.getObject(fieldNameHelper.Belong).toString());
//                    line.setUsId(rs.getObject(fieldNameHelper.LNO) == null ? ""
//                            : rs.getObject(fieldNameHelper.LNO).toString());
//                    // line.setMaterial(rs.getObject("material")==null?"":rs.getObject("material").toString());
//                    if (rs.getObject(fieldNameHelper.PSize) != null
//                            && !"".equals(rs.getObject(fieldNameHelper.PSize)
//                            .toString())) {
//                        String psize = rs.getObject(fieldNameHelper.PSize)
//                                .toString();
//                        double r = 0;
//                        if (psize.indexOf("X") != -1) {
//                            String[] ss = psize.split("X");
//                            r = (Double.parseDouble(ss[0]) + Double
//                                    .parseDouble(ss[1])) / 2;
//                        } else
//                            r = Double.parseDouble(psize);
//                        line.setR(new Double(r));// 单位mm
//                    } else
//                        line.setR(0d);
//                    line.setLayer(layer);
//                    glist.add(line);
//                }
//            } catch (Exception e) {
//                throw e;
//            } finally {
//                DbUtils.closeQuietly(conn, ps, rs);
//            }
//        }
//        return glist;
//    }
//
//    public List<GxLine> getLineByIds(String[] ids, String layer)
//            throws Exception {
//        String str = "";
//        for (String id : ids) {
//            if (!str.equals(""))
//                str += ",";
//            str += id;
//        }
//        List<GxLine> glist = new ArrayList<GxLine>();
//        LayerInfo layerinfo = getDataSourceId(layer);
//        if (layerinfo != null) {
//            Connection conn = DBPoolManager.getConnection(layerinfo
//                    .getSourceId());
//            PreparedStatement ps = null;
//            ResultSet rs = null;
//            try {
//                String sql = "select * from " + layer.toUpperCase() + " where "
//                        + layerinfo.getKeyName() + " in (" + str + ")";
//                ps = conn.prepareStatement(sql);
//                rs = ps.executeQuery();
//                while (rs.next()) {
//                    GxLine line = new GxLine();
//                    line.setObjid(rs.getString(layerinfo.getKeyName()));
//                    line.setS_deep(new Double(rs.getObject("S_deep").toString()));// 单位m
//                    line.setE_deep(new Double(rs.getObject("e_deep").toString()));// 单位m
//                    line.setLength(rs.getObject("LENGTH") == null ? "" : rs
//                            .getObject("LENGTH").toString());
//                    line.setType(rs.getObject("type") == null ? "" : rs
//                            .getObject("type").toString());
//                    line.setOwnerRoad(rs.getObject("OWNERROAD") == null ? ""
//                            : rs.getObject("OWNERROAD").toString());
//                    line.setOwnerDept(rs.getObject("OWNERDEPT") == null ? ""
//                            : rs.getObject("OWNERDEPT").toString());
//                    line.setUsId(rs.getObject("USID") == null ? "" : rs
//                            .getObject("USID").toString());
//                    line.setMaterial(rs.getObject("material") == null ? "" : rs
//                            .getObject("material").toString());
//                    if (rs.getObject("d_s") != null
//                            && !"".equals(rs.getObject("d_s").toString())) {
//                        double r = 0;
//                        if (rs.getObject("d_s").toString().indexOf("X") != -1) {
//                            String[] ss = rs.getObject("d_s").toString()
//                                    .split("X");
//                            r = (Double.parseDouble(ss[0]) + Double
//                                    .parseDouble(ss[1])) / 2;
//                        } else
//                            r = Double.parseDouble(rs.getObject("d_s")
//                                    .toString());
//                        line.setR(new Double(r));// 单位mm
//                    } else
//                        line.setR(0d);
//                    line.setLayer(layer);
//                    glist.add(line);
//                }
//            } catch (Exception e) {
//                throw e;
//            } finally {
//                DbUtils.closeQuietly(conn, ps, rs);
//            }
//        }
//        return glist;
//    }
//
//    public List<JdataBean> smingAnalyseList(String[] tbnames) throws Exception {
//        String sql = "select * from (";
//        LayerInfo sinfo = null;
//        sinfo = getDataSourceId("WSL_GX");
//        // for(int i=0;i<tbnames.length;i++){
//        // LayerInfo info=getDataSourceId(tbnames[i]);
//        // sinfo=info;
//        // if(i!=0)sql+=" union ";
//        // sql+="select "+info.getKeyName()+" objectid,usid,to_date(substr(starttime,0,8),'yyyy-MM-dd') starttime,to_date(substr(endtime,0,8),'yyyy-MM-dd') endtime,ownerroad,type,d_s,length,s_deep,e_deep,'"+info.getLayerTable()+"' tbname from "+info.getLayerTable()+" where endtime<>'99999999999999' and endtime is not null and to_date(substr(endtime,0,8),'yyyyMMdd')<=sysdate";
//        sql += "select object_ objectid,sde.st_astext(shape) wkt ,usid,to_date(substr(starttime,0,8),'yyyy-MM-dd') starttime,to_date('2014-12-1','yyyy-MM-dd') endtime,ownerroad,type,d_s,length,s_deep,e_deep,'WSL_GX' tbname from WSL_GX where  object_= 272 or object_=148";
//        // }
//        sql += ")";
//        Connection conn = DBPoolManager.getConnection(sinfo.getSourceId());
//        PreparedStatement pst = null;
//        ResultSet rs = null;
//        List<JdataBean> resultList = new ArrayList<JdataBean>();
//        try {
//            pst = conn.prepareStatement(sql);
//            rs = pst.executeQuery();
//            ResultSetMetaData rsmd = rs.getMetaData();
//
//            while (rs.next()) {
//                JdataBean bean = new JdataBean();
//                for (int i = 0; i < rsmd.getColumnCount(); i++) {
//                    // 以大写字段名保存字段键值
//                    Object obj = rs.getObject(rsmd.getColumnName(i + 1)
//                            .toUpperCase());
//                    Object value = obj;
//                    bean.put(rsmd.getColumnName(i + 1), value);
//                    Clob clob = (Clob) rs.getClob("wkt");
//                    String objv = "";
//                    BufferedReader cb = new BufferedReader(
//                            clob.getCharacterStream());
//                    String str = "";
//                    while ((str = cb.readLine()) != null) {
//                        objv = objv.concat(str); // 最后以String的形式得到
//                    }
//                    bean.put("wkt", objv);
//                }
//                resultList.add(bean);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        } finally {
//            DbUtils.closeQuietly(conn, pst, rs);
//        }
//        return resultList;
//        // return DbOperate.getInstance("gzzmyw").query(sql, null);
//    }
//
//    public JdataBean getLayerInfo(String layerTbname) throws Exception {
//        String sql = "select t.project_id,t.id from ag_sup_project_layer t,ag_sup_layer l Where t.layer_id=l.Id and l.layer_table=?";
//        List<JdataBean> list = DbOperate.getInstance().query(sql,
//                new Object[]{layerTbname.toUpperCase()});
//        if (list.size() > 0) {
//            JdataBean bean = new JdataBean();
//            for (JdataBean data : list) {
//                if (data.get("project_id").toString().equals("0"))
//                    bean.put("layerid", data.get("id").toString());
//                else
//                    bean.put("proid", data.get("project_id").toString());
//            }
//            return bean;
//        }
//        return null;
//    }
//
//    public LayerInfo getDataSourceId(String layerName) throws Exception {
//        DbOperate db = DbOperate.getInstance();
//        List<JdataBean> dlist = db
//                .query("select t.id,t.user_name,l.key_name,l.id layerid from ag_sup_datasource t,ag_sup_dataset d,ag_sup_layer l where t.ID = d.DATASOURCE_ID and d.ID = l.DATASET_ID And l.layer_table=?",
//                        new Object[]{layerName.toUpperCase()});
//        if (dlist.size() > 0) {
//            LayerInfo info = new LayerInfo();
//            JdataBean bean = dlist.get(0);
//            info.setKeyName(bean.get("key_name").toString());
//            info.setSourceId(bean.get("id").toString());
//            info.setLayerId(bean.get("layerid").toString());
//            info.setOwner(bean.get("user_name").toString());
//            info.setLayerTable(layerName);
//            return info;
//        }
//        return null;
//    }
//
//    public String getSrid(String layerName, String owner, Connection conn)
//            throws Exception {
//        PreparedStatement ps = null;
//        ResultSet rs = null;
//        String srid = "";
//        try {
//            String sql = "select * from sde.layers t where Upper(t.table_name) = '"
//                    + layerName.trim().toUpperCase()
//                    + "' and Upper(t.owner)= '"
//                    + owner.trim().toUpperCase()
//                    + "'";
//            ps = conn.prepareStatement(sql);
//            rs = ps.executeQuery();
//            String spatialColumn = "";
//            if (rs.next()) {
//                spatialColumn = rs.getString("SPATIAL_COLUMN");
//            }
//            rs.close();
//            ps.close();
//            sql = "select distinct sde.st_srid(" + spatialColumn
//                    + ") as srid from " + owner + "."
//                    + layerName.trim().toUpperCase() + " where rownum <= 1";
//            ps = conn.prepareStatement(sql);
//            rs = ps.executeQuery();
//            while (rs.next()) {
//                if ((rs.getObject("srid") != null)
//                        && (!rs.getString("srid").equals(""))) {
//                    srid = rs.getString("srid");
//                }
//            }
//            return srid;
//        } catch (Exception e) {
//            throw e;
//        } finally {
//            DbUtils.closeQuietly(conn, ps, rs);
//        }
//    }
//
//    public String getLineBuffer(String wkt, String distance) throws Exception {
//        String bufferWKT = "";
//        String sql = "";
//        double dist = (double) (Integer.parseInt(distance));
//        LayerConfigHelper layerConfigHelper = new LayerConfigHelper();
//        LayerInfo layerinfo = new GxAnalysisDao().getDataSourceId(layerConfigHelper
//                .getAllLayerBean().get(0).get_LayerName());
//        if (layerinfo != null) {
//            Connection conn = DBPoolManager.getConnection(layerinfo
//                    .getSourceId());
//            PreparedStatement ps = null;
//            ResultSet rs = null;
//            try {
//                sql = "SELECT SDE.ST_ASTEXT(BUFFER) FROM(select COUNT(*),sde.ST_Buffer(SDE.ST_LINESTRING('"
//                        + wkt + "',0),+" + dist + ") AS BUFFER from dual)";
//                ps = conn.prepareStatement(sql);
//                rs = ps.executeQuery();
//                if (rs.next()) {
//                    if ((rs.getObject("SDE.ST_ASTEXT(BUFFER)")) != null) {
//                        bufferWKT = rs.getString("SDE.ST_ASTEXT(BUFFER)");
//                    }
//                }
//            } catch (Exception e) {
//                throw e;
//            } finally {
//                DbUtils.closeQuietly(conn, ps, rs);
//            }
//        }
//        return bufferWKT;
//    }
//
//    public String getPolygonBuffer(String wkt, String distance)
//            throws Exception {
//        String bufferWKT = "";
//        String sql = "";
//        double dist = (double) (Integer.parseInt(distance));
//        LayerConfigHelper layerConfigHelper = new LayerConfigHelper();
//        LayerInfo layerinfo = new GxAnalysisDao().getDataSourceId(layerConfigHelper
//                .getAllLayerBean().get(0).get_LayerName());
//        if (layerinfo != null) {
//            Connection conn = DBPoolManager.getConnection(layerinfo
//                    .getSourceId());
//            PreparedStatement ps = null;
//            ResultSet rs = null;
//            try {
//                sql = "SELECT SDE.ST_ASTEXT(BUFFER) FROM(select COUNT(*),sde.ST_Buffer(SDE.ST_POLYGON('"
//                        + wkt
//                        + "',0),+"
//                        + dist
//                        + ") AS BUFFER from dual)";
//                ps = conn.prepareStatement(sql);
//                rs = ps.executeQuery();
//                if (rs.next()) {
//                    if ((rs.getObject("SDE.ST_ASTEXT(BUFFER)")) != null) {
//                        bufferWKT = rs.getString("SDE.ST_ASTEXT(BUFFER)");
//                    }
//                }
//            } catch (Exception e) {
//                throw e;
//            } finally {
//                DbUtils.closeQuietly(conn, ps, rs);
//            }
//        }
//        return bufferWKT;
//    }
//
//    public String getRoadCross(int roadSelOID, int jckSelOID) throws Exception {
//        String lonlat = "";
//        String layer = "LDLINE";
//        LayerInfo layerinfo = getDataSourceId(layer);
//        if (layerinfo != null) {
//            Connection conn = DBPoolManager.getConnection(layerinfo
//                    .getSourceId());
//            String srid = getSrid(layer, layerinfo.getOwner(), conn);
//            PreparedStatement ps = null;
//            ResultSet rs = null;
//            String sql = null;
//            LayerConfigHelper layerConfigHelper = new LayerConfigHelper();
//            String dlLayer = layerConfigHelper.ROAD_DLZX;
//            try {
//                sql = "select sde.st_astext(TT) from (select sde.st_intersection((select t1.shape from "
//                        + dlLayer
//                        + " t1"
//                        + " where OBJECTID = "
//                        + roadSelOID
//                        + "),(select t2.shape from "
//                        + dlLayer
//                        + " t2"
//                        + " where OBJECTID ="
//                        + jckSelOID
//                        + ")) as TT from "
//                        + layer + " where (1 = 1)) where rownum = 1";
//                ps = conn.prepareStatement(sql);
//                rs = ps.executeQuery();
//                if (rs.next()) {
//                    if ((rs.getObject("sde.st_astext(TT)")) != null) {
//                        lonlat = rs.getString("sde.st_astext(TT)");
//                    }
//
//                }
//            } catch (Exception e) {
//                throw e;
//            } finally {
//                DbUtils.closeQuietly(conn, ps, rs);
//            }
//        }
//        return lonlat;
//    }
//
//}
