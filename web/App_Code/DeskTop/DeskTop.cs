using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using SmartFramework4v2.Data.SqlServer;
using System.Text;
using SmartFramework4v2.Web.WebExcutor;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

/// <summary>
/// DeskTop 的摘要说明
/// </summary>
[CSClass("DeskTop")]
public class DeskTop
{
	public DeskTop()
	{
		//
		// TODO: 在此处添加构造函数逻辑
		//
	}

    private string[] Day = new string[] { "周日", "周一", "周二", "周三", "周四", "周五", "周六" };

    [CSMethod("Tshow")]
    public string Tshow(string now_date)
    {
        using (var db = new DBConnection())
        {
            List<string> days = new List<string>();
            for (int i = 0; i < 7; i++)
                days.Add(Convert.ToDateTime(now_date).AddDays(i).ToString("yyyy-MM-dd"));

            List<string> week = new List<string>();
            for (int i = 0; i < 7; i++)
            {
                string xq = Day[Convert.ToInt32(Convert.ToDateTime(now_date).AddDays(i).DayOfWeek.ToString("d"))].ToString();
                week.Add(xq);
            }

            string sql = "SELECT ID,ParentRoomId,RoomNo,IsClose FROM Lock_Room WHERE UserId = 1701 ORDER BY ID";
            DataTable dt_room = db.ExecuteDataTable(sql);
            dt_room.Columns.Add("DAY1");
            dt_room.Columns.Add("DAY2");
            dt_room.Columns.Add("DAY3");
            dt_room.Columns.Add("DAY4");
            dt_room.Columns.Add("DAY5");
            dt_room.Columns.Add("DAY6");
            dt_room.Columns.Add("DAY7");

            for (int i = 0; i < dt_room.Rows.Count; i++)
            {
                dt_room.Rows[i]["DAY1"] = days[0];
                dt_room.Rows[i]["DAY2"] = days[1];
                dt_room.Rows[i]["DAY3"] = days[2];
                dt_room.Rows[i]["DAY4"] = days[3];
                dt_room.Rows[i]["DAY5"] = days[4];
                dt_room.Rows[i]["DAY6"] = days[5];
                dt_room.Rows[i]["DAY7"] = days[6];
            }

            string sql_order = @"SELECT a.AuthorizeNo,a.AuthorLiveStatus,a.RoomId,a.HotelId,CONVERT(varchar(10), a.LiveStartDate, 120) LiveStartDate,CONVERT(varchar(10), a.LiveEndDate, 120) LiveEndDate,
                                 a.UserId,a.RealName,a.CellPhone,case when a.PlatType = 0 then '其他平台' when a.PlatType = 1 then 'E家智宿' when a.PlatType = 2 then '美团' when a.PlatType = 3 then '线下' end PlatType,
                                 b.RoomGuidNumber
                                 FROM Lock_AuthorizeOrder a 
                                 LEFT JOIN Lock_Room b on a.RoomId = b.ID
                                 WHERE a.FDUsreId = @FDUsreId AND a.AuthorLiveStatus in (0,1,2,3,4,6,16)";
            SqlCommand cmd = db.CreateCommand(sql_order);
            cmd.Parameters.AddWithValue("@FDUsreId",1701);
            DataTable dt_order = db.ExecuteDataTable(cmd);
            dt_order.Columns.Add("ISRZ");//是否入住
            dt_order.Columns.Add("ISSERVICE");//是否服务

            string sql_service = @"SELECT ID,AuthorizeNo,ServiceStatus FROM Lock_ServiceApply WHERE AuthorizeNo IN (SELECT AuthorizeNo FROM Lock_AuthorizeOrder WHERE FDUsreId = @FDUsreId AND AuthorLiveStatus in (4,6))";
            cmd = db.CreateCommand(sql_service);
            cmd.Parameters.AddWithValue("@FDUsreId", 1701);
            DataTable dt_service = db.ExecuteDataTable(cmd);

            for (int i = 0; i < dt_order.Rows.Count; i++)
            {
                dt_order.Rows[i]["ISRZ"] = 0;//默认未入住
                dt_order.Rows[i]["ISSERVICE"] = 1;//默认已服务
                if (dt_order.Rows[i]["AuthorLiveStatus"].ToString() == "1" || dt_order.Rows[i]["AuthorLiveStatus"].ToString() == "2"||dt_order.Rows[i]["AuthorLiveStatus"].ToString() == "3")
                {
                    string str = DeviceAPI.DeviceAPI.CheckLiveStatus(dt_order.Rows[i]["RoomGuidNumber"].ToString(), dt_order.Rows[i]["AuthorizeNo"].ToString());
                    JObject retjobj = JsonConvert.DeserializeObject(str) as JObject;
                    if (retjobj["status"] != null && retjobj["status"].ToString().ToLower() == "ok")
                    {
                        JArray jary = retjobj["homelog_table"] as JArray;
                        dt_order.Rows[i]["ISRZ"] = jary[0]["AuthoriGatewayOrderState"].ToString();
                    }
                }
                else if (dt_order.Rows[i]["AuthorLiveStatus"].ToString() == "4" || dt_order.Rows[i]["AuthorLiveStatus"].ToString() == "6")
                {
                    DataRow[] drs = dt_service.Select("AuthorizeNo = '" + dt_order.Rows[i]["AuthorizeNo"].ToString() + "'");
                    if(drs.Length == 0)
                        dt_order.Rows[i]["ISSERVICE"] = 0;
                }
            }

            string html = SmartFramework4v2.Web.Common.SmartTemplate.RenderTemplate(HttpContext.Current.Server.MapPath("~/JS/Main/Tshow.cshtml"), new { days = days, week = week, dt_room = dt_room, dt_order = dt_order, dt_service = dt_service });

            return html;
        }
    }
}