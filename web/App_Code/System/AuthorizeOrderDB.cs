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

    [CSMethod("GetAuthorizeOrderByNo")]
    public object GetAuthorizeOrderByNo(string AuthorizeNo)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select a.*,b.HotelName from Lock_AuthorizeOrder a left join Lock_Hotel b on a.HotelId=b.ID where a.AuthorizeNo=" + AuthorizeNo;
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

    [CSMethod("GetLockRecord")]
    public object GetLockRecord(int roomid)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "GetLockRecord");
            parameters.Add("roomid", roomid.ToString());
            parameters.Add("start", "");
            parameters.Add("end", "");
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;
            JSReader jsr = JSReader.ParseJSON(json["Info"].ToString());
            DataTable dt = new DataTable();
            dt.Columns.Add("date");
            dt.Columns.Add("type");
            for (int i = 0; i < jsr.Count(); i++)
            {
                DataRow dr = dt.NewRow();
                dr["date"] = jsr[i]["ActionTime"].ToString();
                dr["type"] = jsr[i]["Action"].ToString();
                dt.Rows.Add(dr);
            }

            DataView dv = dt.DefaultView;
            dv.Sort = "date desc";
            DataTable dt2 = dv.ToTable();

            return new { status = json["Status"].ToString(), dt = dt2 };
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


    [CSMethod("GetMemberInfoByNo")]
    public object GetMemberInfoByNo(string AuthorizeNo)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select a.IDCard,b.* from Lock_AuthorizeOrder a left join aspnet_Members b on a.UserId=b.UserId where a.AuthorizeNo=" + AuthorizeNo;
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
                sqlStr = "select * from Lock_ServiceApply where RoomId=" + RoomId + " and IsDamage=1 order by FinishTime desc";
                DataTable dt4 = dbc.ExecuteDataTable(sqlStr);
                sqlStr = "select a.*,b.TypeName from Lock_Device a left join Lock_DeviceType b on a.DeviceType=b.ID where RoomId=" + RoomId;
                DataTable dt5 = dbc.ExecuteDataTable(sqlStr);
                return new { dt1 = dt1, dt2 = dt2, dt3 = dt3, dt4 = dt4, dt5 = dt5 };
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

                sql = "select ID VALUE,HotelName TEXT,* from Lock_Hotel where ID = (select HotelId from Lock_Room where ID = '" + RoomId + "')";
                DataTable dt_hotel = db.ExecuteDataTable(sql);

                DataTable dt_hour = new DataTable();
                dt_hour.Columns.Add("VALUE");
                dt_hour.Columns.Add("TEXT");
                if (dt_hotel.Rows[0]["HourRoomTimeLong"].ToString() != "0")
                {
                    DataRow dr = dt_hour.NewRow();
                    dr["TEXT"] = dt_hotel.Rows[0]["HourRoomTimeLong"].ToString() + "小时";
                    dr["VALUE"] = dt_hotel.Rows[0]["HourRoomTimeLong"].ToString();
                    dt_hour.Rows.Add(dr);
                }
                if (dt_hotel.Rows[0]["HourRoomTimeLong2"].ToString() != "0")
                {
                    DataRow dr = dt_hour.NewRow();
                    dr["TEXT"] = dt_hotel.Rows[0]["HourRoomTimeLong2"].ToString() + "小时";
                    dr["VALUE"] = dt_hotel.Rows[0]["HourRoomTimeLong2"].ToString();
                    dt_hour.Rows.Add(dr);
                }
                if (dt_hotel.Rows[0]["HourRoomTimeLong3"].ToString() != "0")
                {
                    DataRow dr = dt_hour.NewRow();
                    dr["TEXT"] = dt_hotel.Rows[0]["HourRoomTimeLong3"].ToString() + "小时";
                    dr["VALUE"] = dt_hotel.Rows[0]["HourRoomTimeLong3"].ToString();
                    dt_hour.Rows.Add(dr);
                }

                return new { dt_room = dt_room, dt_hotel = dt_hotel, dt_hour = dt_hour };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    public string[] Day = new string[] { "周日", "周一", "周二", "周三", "周四", "周五", "周六" };

    [CSMethod("CalculateTimeAndPrice")]
    public object CalculateTimeAndPrice(int hotelid, int roomid, string AuthorRoomStyle, string startTime, string startHour, string days, string hours, string months, decimal UnitPrice, decimal DepositPrice)
    {
        using (var db = new DBConnection())
        {
            try
            {
                string sql = "select * from Lock_Hotel where ID = '" + hotelid + "'";
                DataTable dt_hotel = db.ExecuteDataTable(sql);

                string week = Day[Convert.ToInt32(Convert.ToDateTime(startTime).DayOfWeek.ToString("d"))].ToString();

                string sql_price = "select * from Lock_RoomOtherDayPrice where RoomId = '" + roomid + "' and StartDate >= '" + Convert.ToDateTime(startTime) + "'";
                DataTable dt_price_old = db.ExecuteDataTable(sql_price);

                int IsHasWeekendPrice = Convert.ToInt32(dt_hotel.Rows[0]["IsHasWeekendPrice"].ToString());
                int WeekendConatin5 = Convert.ToInt32(dt_hotel.Rows[0]["WeekendConatin5"].ToString());
                int WeekendConatin6 = Convert.ToInt32(dt_hotel.Rows[0]["WeekendConatin6"].ToString());
                int WeekendConatin7 = Convert.ToInt32(dt_hotel.Rows[0]["WeekendConatin7"].ToString());

                DataTable dt_price = new DataTable();
                dt_price.Columns.Add("RoomId");
                dt_price.Columns.Add("TIME");
                dt_price.Columns.Add("PRICE");
                dt_price.Columns.Add("HourPrice");
                dt_price.Columns.Add("HourPrice2");
                dt_price.Columns.Add("HourPrice3");
                dt_price.Columns.Add("MonthRentPrice");
                for (int i = 0; i < dt_price_old.Rows.Count; i++)
                {
                    DataRow dr = dt_price.NewRow();
                    dr["RoomId"] = dt_price_old.Rows[i]["RoomId"];
                    string weekstr = Convert.ToDateTime(dt_price_old.Rows[i]["StartDate"]).DayOfWeek.ToString();
                    if (weekstr == "Monday" || weekstr == "Tuesday" || weekstr == "Wednesday" || weekstr == "Thursday")
                    {
                        dr["TIME"] = Convert.ToDateTime(dt_price_old.Rows[i]["StartDate"]).ToString("yyyy-MM-dd");
                        dr["PRICE"] = dt_price_old.Rows[i]["Price"];
                        dr["HourPrice"] = dt_price_old.Rows[i]["HourPrice"];
                        dr["HourPrice2"] = dt_price_old.Rows[i]["HourPrice2"];
                        dr["HourPrice3"] = dt_price_old.Rows[i]["HourPrice3"];
                        dr["MonthRentPrice"] = dt_price_old.Rows[i]["MonthRentPrice"];
                    }
                    else
                    {
                        if (IsHasWeekendPrice == 1)
                        {
                            if (WeekendConatin5 == 1 && weekstr == "Friday")
                            {
                                dr["TIME"] = Convert.ToDateTime(dt_price_old.Rows[i]["StartDate"]).ToString("yyyy-MM-dd");
                                dr["PRICE"] = dt_price_old.Rows[i]["WeekEndPrice"];
                                dr["HourPrice"] = dt_price_old.Rows[i]["HourWeekEndPrice"];
                                dr["HourPrice2"] = dt_price_old.Rows[i]["HourWeekEndPrice2"];
                                dr["HourPrice3"] = dt_price_old.Rows[i]["HourWeekEndPrice3"];
                                dr["MonthRentPrice"] = dt_price_old.Rows[i]["MonthRentPrice"];
                            }
                            else
                            {
                                if (WeekendConatin6 == 1 && weekstr == "Saturday")
                                {
                                    dr["TIME"] = Convert.ToDateTime(dt_price_old.Rows[i]["StartDate"]).ToString("yyyy-MM-dd");
                                    dr["PRICE"] = dt_price_old.Rows[i]["WeekEndPrice"];
                                    dr["HourPrice"] = dt_price_old.Rows[i]["HourWeekEndPrice"];
                                    dr["HourPrice2"] = dt_price_old.Rows[i]["HourWeekEndPrice2"];
                                    dr["HourPrice3"] = dt_price_old.Rows[i]["HourWeekEndPrice3"];
                                    dr["MonthRentPrice"] = dt_price_old.Rows[i]["MonthRentPrice"];
                                }
                                else
                                {
                                    if (WeekendConatin7 == 1 && weekstr == "Sunday")
                                    {
                                        dr["TIME"] = Convert.ToDateTime(dt_price_old.Rows[i]["StartDate"]).ToString("yyyy-MM-dd");
                                        dr["PRICE"] = dt_price_old.Rows[i]["WeekEndPrice"];
                                        dr["HourPrice"] = dt_price_old.Rows[i]["HourWeekEndPrice"];
                                        dr["HourPrice2"] = dt_price_old.Rows[i]["HourWeekEndPrice2"];
                                        dr["HourPrice3"] = dt_price_old.Rows[i]["HourWeekEndPrice3"];
                                        dr["MonthRentPrice"] = dt_price_old.Rows[i]["MonthRentPrice"];
                                    }
                                    else
                                    {
                                        dr["TIME"] = Convert.ToDateTime(dt_price_old.Rows[i]["StartDate"]).ToString("yyyy-MM-dd");
                                        dr["PRICE"] = dt_price_old.Rows[i]["Price"];
                                        dr["HourPrice"] = dt_price_old.Rows[i]["HourPrice"];
                                        dr["HourPrice2"] = dt_price_old.Rows[i]["HourPrice2"];
                                        dr["HourPrice3"] = dt_price_old.Rows[i]["HourPrice3"];
                                        dr["MonthRentPrice"] = dt_price_old.Rows[i]["MonthRentPrice"];
                                    }
                                }
                            }
                        }
                        else
                        {
                            dr["TIME"] = Convert.ToDateTime(dt_price_old.Rows[i]["StartDate"]).ToString("yyyy-MM-dd");
                            dr["PRICE"] = dt_price_old.Rows[i]["Price"];
                            dr["HourPrice"] = dt_price_old.Rows[i]["HourPrice"];
                            dr["HourPrice2"] = dt_price_old.Rows[i]["HourPrice2"];
                            dr["HourPrice3"] = dt_price_old.Rows[i]["HourPrice3"];
                            dr["MonthRentPrice"] = dt_price_old.Rows[i]["MonthRentPrice"];
                        }
                    }
                    dt_price.Rows.Add(dr);
                }

                DateTime LiveEndDate; //结束时间
                DateTime EarliestDate;//预计保留时间（当前时间）
                DateTime LatestDate;//最晚到店时间（结束前一小时）
                decimal LiveTotalPrice = 0;//房费总价
                decimal ActualTotalPrice;//总价

                if (AuthorRoomStyle == "1")//当为全天房时
                {
                    //计算结束时间
                    LiveEndDate = GetLiveDayEndTime(startTime, startHour, Int32.Parse(days), 6, 0);//写死每天6点为开始时间
                    EarliestDate = DateTime.Now;
                    LatestDate = LiveEndDate;
                    //计算金额
                    for (int i = 0; i < Int32.Parse(days); i++)
                    {
                        DataRow[] drs = dt_price.Select("TIME = '" + Convert.ToDateTime(startTime).AddDays(i).ToString("yyyy-MM-dd") + "'");
                        if (drs.Length > 0)
                            LiveTotalPrice += Convert.ToDecimal(drs[0]["PRICE"]);
                    }
                    ActualTotalPrice = LiveTotalPrice + DepositPrice;

                    return new { LiveEndDate = LiveEndDate, EarliestDate = EarliestDate, LatestDate = LatestDate, UnitPrice = UnitPrice, DepositPrice = DepositPrice, LiveTotalPrice = LiveTotalPrice, ActualTotalPrice = ActualTotalPrice };
                }
                else if (AuthorRoomStyle == "2")
                {
                    LiveEndDate = Convert.ToDateTime(Convert.ToDateTime(startTime).ToString("yyyy-MM-dd") + " " + startHour).AddHours(Int32.Parse(hours));
                    string LiveEndDateHour = LiveEndDate.ToString("HH:mm");
                    EarliestDate = DateTime.Now;
                    LatestDate = LiveEndDate.AddHours(-1);
                    string LatestDateHour = LatestDate.ToString("HH:mm");

                    //计算金额
                    DataRow[] drs = dt_price.Select("TIME = '" + Convert.ToDateTime(startTime).ToString("yyyy-MM-dd") + "'");

                    if (dt_hotel.Rows[0]["HourRoomTimeLong"].ToString() == hours.ToString())
                    {
                        UnitPrice = (drs.Length > 0 && !string.IsNullOrEmpty(drs[0]["HourPrice"].ToString())) ? Convert.ToDecimal(drs[0]["HourPrice"].ToString()) : 0;
                    }
                    else if (dt_hotel.Rows[0]["HourRoomTimeLong2"].ToString() == hours.ToString())
                    {
                        UnitPrice = (drs.Length > 0 && !string.IsNullOrEmpty(drs[0]["HourPrice2"].ToString())) ? Convert.ToDecimal(drs[0]["HourPrice2"].ToString()) : 0;
                    }
                    else if (dt_hotel.Rows[0]["HourRoomTimeLong3"].ToString() == hours.ToString())
                    {
                        UnitPrice = (drs.Length > 0 && !string.IsNullOrEmpty(drs[0]["HourPrice3"].ToString())) ? Convert.ToDecimal(drs[0]["HourPrice3"].ToString()) : 0;
                    }

                    if (DepositPrice == 0)
                        DepositPrice = string.IsNullOrEmpty(dt_hotel.Rows[0]["DepositPrice"].ToString()) ? 0 : Convert.ToDecimal(dt_hotel.Rows[0]["DepositPrice"].ToString());
                    LiveTotalPrice = UnitPrice;
                    ActualTotalPrice = LiveTotalPrice + DepositPrice;

                    return new { LiveEndDate = LiveEndDate, LiveEndDateHour = LiveEndDateHour, EarliestDate = EarliestDate, LatestDate = LatestDate, LatestDateHour = LatestDateHour, UnitPrice = UnitPrice, DepositPrice = DepositPrice, LiveTotalPrice = LiveTotalPrice, ActualTotalPrice = ActualTotalPrice };
                }
                else
                {
                    //计算结束时间
                    LiveEndDate = GetLiveMonthEndTime(startTime, startHour, Int32.Parse(months), 6, 0);//写死每天6点为开始时间
                    EarliestDate = DateTime.Now;
                    LatestDate = LiveEndDate;
                    //计算金额
                    if (UnitPrice == 0)
                    {
                        DataRow[] drs = dt_price.Select("TIME = '" + Convert.ToDateTime(startTime).ToString("yyyy-MM-dd") + "'");
                        UnitPrice = (drs.Length > 0 && !string.IsNullOrEmpty(drs[0]["MonthRentPrice"].ToString())) ? Convert.ToDecimal(dt_price.Rows[0]["MonthRentPrice"].ToString()) : 0;
                    }
                    if (DepositPrice == 0)
                        DepositPrice = string.IsNullOrEmpty(dt_hotel.Rows[0]["DepositPrice"].ToString()) ? 0 : Convert.ToDecimal(dt_hotel.Rows[0]["DepositPrice"].ToString());
                    LiveTotalPrice = UnitPrice * Int32.Parse(months);
                    ActualTotalPrice = LiveTotalPrice + DepositPrice;

                    return new { LiveEndDate = LiveEndDate, EarliestDate = EarliestDate, LatestDate = LatestDate, UnitPrice = UnitPrice, DepositPrice = DepositPrice, LiveTotalPrice = LiveTotalPrice, ActualTotalPrice = ActualTotalPrice };
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    public DateTime GetLiveDayEndTime(string startTime, string startHour, int days, int checkout_hour, int checkout_minu)
    {
        string[] hours = startHour.Split(':');
        if (Int32.Parse(hours[0]) < checkout_hour)
        {
            days -= 1;
        }
        else if (Int32.Parse(hours[0]) < checkout_hour)
        {
            if (Int32.Parse(hours[1]) < checkout_minu)
                days -= 1;
        }

        DateTime LiveEndDate = Convert.ToDateTime(startTime).AddDays(days);
        return LiveEndDate;
    }

    public DateTime GetLiveMonthEndTime(string startTime, string startHour, int months, int checkout_hour, int checkout_minu)
    {
        string[] hours = startHour.Split(':');
        if (Int32.Parse(hours[0]) < checkout_hour)
        {
            months -= 1;
        }
        else if (Int32.Parse(hours[0]) < checkout_hour)
        {
            if (Int32.Parse(hours[1]) < checkout_minu)
                months -= 1;
        }

        DateTime LiveEndDate = Convert.ToDateTime(startTime).AddMonths(months);
        return LiveEndDate;
    }

    [CSMethod("GetRealNameByCellPhone")]
    public string GetRealNameByCellPhone(string CellPhone)
    {
        using (var dbc = new DBConnection())
        {
            string sql = "select RealName from aspnet_Members where CellPhone = '" + CellPhone + "'";
            DataTable dt = dbc.ExecuteDataTable(sql);
            if (dt.Rows.Count > 0)
                return dt.Rows[0]["RealName"].ToString();
            else
                return "";
        }
    }
}