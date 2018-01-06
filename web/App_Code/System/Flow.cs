using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;
using SmartFramework4v2.Data.MySql;

/// <summary>
/// Flow 的摘要说明
/// </summary>
public class Flow
{
    public Flow()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    public static int SetFlow(DBConnection dbc, string serviceId, string serviceType)
    {
        int flowId = Convert.ToInt16(dbc.ExecuteScalar("select AUTO_INCREMENT from INFORMATION_SCHEMA.TABLES where TABLE_NAME='tb_u_flow'").ToString());
        string sqlStr = "insert into tb_u_flow(";
        sqlStr += "SERVICEID,";
        sqlStr += "SERVICETYPE,";
        sqlStr += "STATUS";
        sqlStr += ") values(";
        sqlStr += "@SERVICEID,";
        sqlStr += "@SERVICETYPE,";
        sqlStr += "@STATUS";
        sqlStr += ")";
        MySqlCommand cmd = new MySqlCommand(sqlStr);
        cmd.Parameters.AddWithValue("@SERVICEID", serviceId);
        cmd.Parameters.AddWithValue("@SERVICETYPE", serviceType);
        cmd.Parameters.AddWithValue("@STATUS", 0);
        dbc.ExecuteNonQuery(cmd);
        return flowId;
    }

    public static void SetStep(DBConnection dbc, int flowId, int step, string STEPINFO, int TOUSERID, string ISSUEINFO)
    {

        string sqlStr = "insert into tb_u_flow_step(";
        sqlStr += "FLOWID,";
        sqlStr += "STEP,";
        sqlStr += "STEPINFO,";
        sqlStr += "FROMUSERID,";
        sqlStr += "TOUSERID,";
        sqlStr += "RESULT,";
        sqlStr += "CREATTIME,";
        sqlStr += "ISSUEINFO";
        sqlStr += ") values(";
        sqlStr += "@FLOWID,";
        sqlStr += "@STEP,";
        sqlStr += "@STEPINFO,";
        sqlStr += "@FROMUSERID,";
        sqlStr += "@TOUSERID,";
        sqlStr += "@RESULT,";
        sqlStr += "@CREATTIME,";
        sqlStr += "@ISSUEINFO";
        sqlStr += ")";
        MySqlCommand cmd = new MySqlCommand(sqlStr);
        cmd.Parameters.AddWithValue("@FLOWID", flowId);
        cmd.Parameters.AddWithValue("@STEP", step);
        cmd.Parameters.AddWithValue("@STEPINFO", STEPINFO);
        cmd.Parameters.AddWithValue("@FROMUSERID", SystemUser.CurrentUser.UserID);
        cmd.Parameters.AddWithValue("@TOUSERID", TOUSERID);
        cmd.Parameters.AddWithValue("@RESULT", 0);
        cmd.Parameters.AddWithValue("@CREATTIME", DateTime.Now);
        cmd.Parameters.AddWithValue("@ISSUEINFO", ISSUEINFO);
        dbc.ExecuteNonQuery(cmd);
    }


    public static void FinishFlow(DBConnection dbc, int flowId)
    {

        dbc.ExecuteNonQuery("update tb_u_flow set STATUS=1 where FLOWID=" + flowId);

    }


    public static void FinishStep(DBConnection dbc, int stepId, int result, string RESULTINFO)
    {
        dbc.ExecuteNonQuery("update tb_u_flow_step set RESULT=" + result + ",RESULTINFO=" + dbc.ToSqlValue(RESULTINFO) + ",FINISHTIME=sysdate() where STEPID=" + stepId);
    }
}