using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SmartFramework4v2.Data;
using SmartFramework4v2.Data.SqlServer;
using SmartFramework4v2.Web.Common.JSON;
using SmartFramework4v2.Web.WebExcutor;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;


/// <summary>
/// FinanceDB 的摘要说明
/// </summary>
[CSClass("FinanceDB")]
public class FinanceDB
{
    [CSMethod("GetHotelCombobox")]
    public object GetHotelCombobox()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                SystemUser user = SystemUser.CurrentUser;
                string sqlStr = @"  select ID,HotelName from
                                      (
                                      select ID,HotelName,UserId from [zhisuroom].[dbo].[Lock_Hotel] where UserId= '" + user.UserID + @"'
                                      UNION ALL
                                      select ID,HotelName,UserId from [zhisuroom].[dbo].[Lock_Hotel] where UserId IN (select MEUSERID from [zhisuroom].[dbo].[aspnet_FdAndMdUser] where FDUSERID = '" + user.UserID + @"' and MEUSERID != '" + user.UserID + @"')
                                      ) a order by UserId,ID";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetHotelComboboxByUserId")]
    public object GetHotelComboboxByUserId()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                SystemUser user = SystemUser.CurrentUser;
                string sqlStr = @"select ID,HotelName,UserId from [zhisuroom].[dbo].[Lock_Hotel] where UserId= '" + user.UserID + @"'";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetFinanceList")]
    public object GetFinanceList(int pagnum, int pagesize, string HotelID)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string where = "";

                where += " and f.HotelId = h.ID and f.HotelId=" + HotelID;

                string str = @"select f.*,u.UserName,m.CellPhone,m.RealName,h.HotelName from Lock_FinanceList as f left join aspnet_Users as u on f.UserId=u.UserId left join aspnet_Members as m on m.UserId=u.UserId,Lock_Hotel as h
                              where f.UserId=" + SystemUser.CurrentUser.UserID + where;
                str += where;
                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str + " order by f.ID desc", pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetFinanceDetail")]
    public DataTable GetFinanceDetail(string parentid,string hotelid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql_hotel = "select UserId from Lock_Hotel where ID = '" + hotelid + "'";
            DataTable dt_hotel = dbc.ExecuteDataTable(sql_hotel);
            string where = "";
            if (!string.IsNullOrEmpty(parentid) && Int32.Parse(parentid) > 0)
                where += " And detail.ParentFinanceID=" + parentid;
            where += " And detail.UserId=" + dt_hotel.Rows[0]["UserId"].ToString();
            string sql = "select detail.*,h.HotelName from Lock_FinanceList as list,Lock_FinanceDetail as detail,Lock_Hotel as h where list.ID=detail.ParentFinanceID and detail.HotelId=h.ID " + where + " order by detail.ID desc";
            DataTable dt = dbc.ExecuteDataTable(sql);
            return dt;
        }
    }

    [CSMethod("ConfirmFinance")]
    public object ConfirmFinance(string ID)
    {
        string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
        IDictionary<string, string> parameters = new Dictionary<string, string>();
        parameters.Add("interface", "ConfirmFinance");
        parameters.Add("id", ID);
        string result = WebService.CallService(url, parameters);
        JObject json = JsonConvert.DeserializeObject(result) as JObject;
        return new { status = json["Status"].ToString(), result };
    }

    [CSMethod("getHotelBalance")]
    public string getHotelBalance(string ID)
    {
        using (var db = new DBConnection())
        {
            string sql = "select HotelBalance from Lock_Hotel where ID = '" + ID + "'";
            DataTable dt = db.ExecuteDataTable(sql);
            return dt.Rows[0]["HotelBalance"].ToString();
        }
    }

    [CSMethod("SubmitTXOrder")]
    public object SubmitTXOrder(string hotelid, string TxMoney, string PayType, string Remark)
    {
        string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
        IDictionary<string, string> parameters = new Dictionary<string, string>();
        parameters.Add("interface", "SubmitTXOrder");
        parameters.Add("hotelid", hotelid);
        parameters.Add("TxMoney", TxMoney);
        parameters.Add("PayType", PayType);
        parameters.Add("Remark", Remark);
        string result = WebService.CallService(url, parameters);
        JObject json = JsonConvert.DeserializeObject(result) as JObject;
        return new { status = json["Status"].ToString(), result };
    }

    [CSMethod("ApplyListNew")]
    public object ApplyListNew(int pagnum, int pagesize, int zt)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;
                SystemUser user = SystemUser.CurrentUser;

                string where = "";

                if(zt == 0)
                    where += " and tx.Status in (1,2)";
                else if(zt == 1)
                    where += " and tx.Status in (3,4,5)";

                string str = @"select tx.*,u.UserName,m.CellPhone,m.RealName,h.HotelName from Lock_HotelWithdrawals as tx left join aspnet_Users as u on tx.UserId=u.UserId left join aspnet_Members as m on m.UserId=u.UserId left join Lock_Hotel h on tx.HotelId = h.ID where 1=1 and tx.Type=0 and tx.HotelId in (
                                     select ID from
                                      (
                                      select ID,HotelName,UserId from [zhisuroom].[dbo].[Lock_Hotel] where UserId= '" + user.UserID + @"'
                                      UNION ALL
                                      select ID,HotelName,UserId from [zhisuroom].[dbo].[Lock_Hotel] where UserId IN (select MEUSERID from [zhisuroom].[dbo].[aspnet_FdAndMdUser] where FDUSERID = '" + user.UserID + @"' and MEUSERID != '" + user.UserID + @"')
                                      ) a
                               )" + where;
                str += where;
                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str + " order by tx.ID desc", pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}