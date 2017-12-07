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

[CSClass("AuthorizeOrderDB")]
public class AuthorizeOrderDB
{
    [CSMethod("GetAuthorizeOrderList")]
    public object GetAuthorizeOrderList(int pagnum, int pagesize, string mc, string no, string fjh, string bgmc, string sqzt, int type)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string mStr = "";
                if (!string.IsNullOrEmpty(mc))
                    mStr += " and " + dbc.C_Like("a.RealName", mc.Trim(), LikeStyle.LeftAndRightLike);
                if (!string.IsNullOrEmpty(no))
                    mStr += " and " + dbc.C_Like("a.AuthorizeNo", no.Trim(), LikeStyle.LeftAndRightLike);
                if (!string.IsNullOrEmpty(fjh))
                    mStr += " and " + dbc.C_Like("a.RoomNo", fjh.Trim(), LikeStyle.LeftAndRightLike);
                if (!string.IsNullOrEmpty(bgmc))
                    mStr += " and " + dbc.C_Like("a.HotelName", bgmc.Trim(), LikeStyle.LeftAndRightLike);
                if (!string.IsNullOrEmpty(bgmc))
                    mStr += " and AuthorStatus=" + sqzt;


                string sqlStr = @"select a.*,b.HotelName,b.Mobile,b.CompleteAddress from Lock_AuthorizeOrder a
                                 left join Lock_Hotel b on a.HotelId=b.ID
                                 where 1=1 " + mStr + " and FDUsreId=" + SystemUser.CurrentUser.UserID + "  order by a.ID desc";
                if (type == 1)
                {
                    sqlStr = @"select a.*,b.HotelName,b.Mobile,b.CompleteAddress from Lock_AuthorizeOrder a
                                 left join Lock_Hotel b on a.HotelId=b.ID
                                 where AuthorStatus=1 and AuthorizeBookStatus=1 " + mStr + " and FDUsreId=" + SystemUser.CurrentUser.UserID + "  order by a.ID desc";
                }
                if (type == 2)
                {
                    sqlStr = @"select a.*,b.HotelName,b.Mobile,b.CompleteAddress from Lock_AuthorizeOrder a
                                 left join Lock_Hotel b on a.HotelId=b.ID
                                 where HandlerKind=1 and OrderUserState=0 and AuthorLiveStatus=1 " + mStr + " and FDUsreId=" + SystemUser.CurrentUser.UserID + "  order by a.ID desc";
                }
                if (type == 3)
                {
                    sqlStr = @"select a.*,b.HotelName,b.Mobile,b.CompleteAddress from Lock_AuthorizeOrder a
                                 left join Lock_Hotel b on a.HotelId=b.ID
                                 where AuthorStatus=3  and AuthorLiveStatus=6 " + mStr + " and FDUsreId=" + SystemUser.CurrentUser.UserID + "  order by a.ID desc";
                }
                DataTable dtPage = dbc.GetPagedDataTable(sqlStr, pagesize, ref cp, out ac);
                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetHotelCombobox")]
    public object GetHotelCombobox()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select ID VALUE,HotelName TEXT from Lock_Hotel where UserId=" + SystemUser.CurrentUser.UserID + " order by HotelName";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetRoomCombobox")]
    public object GetRoomCombobox(int hotelId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select ID VALUE,RoomNo TEXT from Lock_Room where UserId=" + SystemUser.CurrentUser.UserID + " and HotelId=" + hotelId + " order by  RoomNo";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetAuthorizeOrderById")]
    public object GetAuthorizeOrderById(int ID)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select a.*,b.HotelName from Lock_AuthorizeOrder a left join Lock_Hotel b on a.HotelId=b.ID where a.ID=" + ID;
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("CheckIsJudge")]
    public object CheckIsJudge(string authno)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select * from Lock_JudgeByFDList where AuthorizeNo=" + dbc.ToSqlValue(authno);
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                if (dt.Rows.Count > 0)
                    return false;
                else
                    return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("SendCMDAgain")]
    public object SendCMDAgain(string authno)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "SendCMDAgain");
            parameters.Add("authno", authno);
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;
            return new { status = json["Status"].ToString(), info = json["Info"].ToString() };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("AddAuthDetail")]
    public object AddAuthDetail(JSReader jsr, string authno, int lx)
    {
        try
        {
            string timelong;
            if (lx == 2)
                timelong = jsr["ApplyDay"].ToString();
            else
                timelong = jsr["ApplyHour"].ToString();
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "AddAuthDetail");
            parameters.Add("authno", authno);
            parameters.Add("authtype", lx.ToString());
            parameters.Add("timelong", timelong);
            parameters.Add("totalprice", jsr["Money"].ToString());
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;
            return new { status = json["Status"].ToString(), info = json["Info"].ToString() };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("ReFundMoney")]
    public object ReFundMoney(string authno)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "ReFundMoney");
            parameters.Add("authno", authno);
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;

            return new { status = json["Status"].ToString(), info = JSReader.ParseJSON(json["Info"].ToString()) };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("AddRefundLive")]
    public object AddRefundLive(JSReader jsr, string authno)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "AddRefundLive");
            parameters.Add("authno", authno);
            parameters.Add("refundtime", DateTime.Now.ToString());
            parameters.Add("ActualTotalPrice", jsr["ActualTotalPrice"].ToString());
            parameters.Add("OtherPrice", jsr["OtherPrice"].ToString());
            parameters.Add("RefundPrice", jsr["RefundPrice"].ToString());
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;

            return new { status = json["Status"].ToString(), info = JSReader.ParseJSON(json["Info"].ToString()) };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("SubmitAuthorizeOrder")]
    public object SubmitAuthorizeOrder(JSReader jsr)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "SubmitAuthorizeOrder");
            parameters.Add("senddata", jsr.ToJSON());
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;

            return new { status = json["Status"].ToString(), info = JSReader.ParseJSON(json["Info"].ToString()) };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("CancelAuthorizeOrder")]
    public object CancelAuthorizeOrder(int authid, int type)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "CancelAuthorizeOrder");
            parameters.Add("type", type.ToString());
            parameters.Add("authid", authid.ToString());
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;

            return new { status = json["Status"].ToString(), info = JSReader.ParseJSON(json["Info"].ToString()) };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("ApplyFDJudge")]
    public object ApplyFDJudge(string authno, string score, string context)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "ApplyFDJudge");
            parameters.Add("authno", authno);
            parameters.Add("score", score);
            parameters.Add("context", context);
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;

            return new { status = json["Status"].ToString(), info = JSReader.ParseJSON(json["Info"].ToString()) };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("SendCMDAgainTF")]
    public object SendCMDAgainTF(string authno)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "SendCMDAgainTF");
            parameters.Add("authno", authno);
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;

            return new { status = json["Status"].ToString(), info = JSReader.ParseJSON(json["Info"].ToString()) };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("ConfirmBook2")]
    public object ConfirmBook2(string authno, int userid)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "ConfirmBook2");
            parameters.Add("authno", authno);
            parameters.Add("userid", userid.ToString());
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;

            return new { status = json["Status"].ToString(), info = JSReader.ParseJSON(json["Info"].ToString()) };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("GetMemberInfo")]
    public object GetMemberInfo(int ID)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select a.IDCard,b.* from Lock_AuthorizeOrder a left join aspnet_Members b on a.UserId=b.UserId where a.ID=" + ID;
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetRoomInfo")]
    public object GetRoomInfo(int RoomId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select a.RoomNo,b.CompleteAddress from Lock_Room a left join Lock_Hotel b on a.HotelId=b.ID where a.ID=" + RoomId;
                DataTable dt1 = dbc.ExecuteDataTable(sqlStr);
                sqlStr = "select b.*,a.TagDec from Lock_RoomGoodsTag a left join Lock_GoodsTag b on a.TagId=b.ID where a.RoomId=" + RoomId + "";
                DataTable dt2 = dbc.ExecuteDataTable(sqlStr);
                sqlStr = "select * from Lock_AuthorizeOrder where AuthorStatus>0 and AuthorStatus<=6 and RoomId=" + RoomId + " order by ID desc";
                DataTable dt3 = dbc.ExecuteDataTable(sqlStr);
                return new { dt1 = dt1, dt2 = dt2, dt3 = dt3 };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetHotelAndRoomDetails")]
    public object GetHotelAndRoomDetails(int RoomId)
    {
        using (var db = new DBConnection())
        {
            try
            {
                string sql = "select ID VALUE,RoomNo TEXT from Lock_Room where ID = '" + RoomId + "'";
                DataTable dt_room = db.ExecuteDataTable(sql);

                sql = "select ID VALUE,HotelName TEXT from Lock_Hotel where ID = (select HotelId from Lock_Room where ID = '" + RoomId + "')";
                DataTable dt_hotel = db.ExecuteDataTable(sql);

                return new { dt_room = dt_room, dt_hotel = dt_hotel };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("CalculateTimeAndPrice")]
    public object CalculateTimeAndPrice(int hotelid,int roomid,string startTime,string startHour,int days,int hours,int months)
    {
        using (var db = new DBConnection())
        {
            try
            {
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}