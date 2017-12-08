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

                return new { dt_room = dt_room, dt_hotel = dt_hotel,dt_hour = dt_hour };
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

                sql = "select * from Lock_RoomOtherDayPrice where RoomId = '" + roomid + "' and StartDate <= '" + Convert.ToDateTime(startTime) + "' and EndDate > '" + Convert.ToDateTime(startTime) + "'";
                DataTable dt_price = db.ExecuteDataTable(sql);

                string week = Day[Convert.ToInt32(Convert.ToDateTime(startTime).DayOfWeek.ToString("d"))].ToString();

                //如果有周末价
                bool IsUseWeekPrice = false;//是否使用周末价（默认不使用）
                if (dt_hotel.Rows[0]["IsHasWeekendPrice"].ToString() == "1")
                {
                    if (week == "周五")
                    {
                        if (dt_hotel.Rows[0]["WeekendConatin5"].ToString() == "1")
                            IsUseWeekPrice = true;
                    }
                    else if (week == "周六")
                    {
                        if (dt_hotel.Rows[0]["WeekendConatin6"].ToString() == "1")
                            IsUseWeekPrice = true;
                    }
                    else if (week == "周日")
                    {
                        if (dt_hotel.Rows[0]["WeekendConatin7"].ToString() == "1")
                            IsUseWeekPrice = true;
                    }
                }

                DateTime LiveEndDate; //结束时间
                DateTime EarliestDate;//预计保留时间（当前时间）
                DateTime LatestDate;//最晚到店时间（结束前一小时）
                decimal LiveTotalPrice;//房费总价
                decimal ActualTotalPrice;//总价

                if (AuthorRoomStyle=="1")//当为全天房时
                {
                    //计算结束时间
                    LiveEndDate = GetLiveDayEndTime(startTime, startHour, Int32.Parse(days), 6, 0);//写死每天6点为开始时间
                    EarliestDate = DateTime.Now;
                    LatestDate = LiveEndDate;
                    //计算金额
                    if (IsUseWeekPrice)
                    {//如果是周末价
                        if (UnitPrice == 0)
                        {
                            UnitPrice = string.IsNullOrEmpty(dt_price.Rows[0]["WeekEndPrice"].ToString()) ? 0 : Convert.ToDecimal(dt_price.Rows[0]["WeekEndPrice"].ToString());
                        }
                    }
                    else
                    {//如果是平常价格
                        if (UnitPrice == 0)
                        {
                            UnitPrice = string.IsNullOrEmpty(dt_price.Rows[0]["Price"].ToString()) ? 0 : Convert.ToDecimal(dt_price.Rows[0]["Price"].ToString());
                        }
                    }
                    if (DepositPrice == 0)
                        DepositPrice = string.IsNullOrEmpty(dt_hotel.Rows[0]["DepositPrice"].ToString()) ? 0 : Convert.ToDecimal(dt_hotel.Rows[0]["DepositPrice"].ToString());
                    LiveTotalPrice = UnitPrice * Int32.Parse(days);
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
                    if (IsUseWeekPrice)
                    {//如果是周末价
                        if (UnitPrice == 0)
                        {
                            if (dt_hotel.Rows[0]["HourRoomTimeLong"].ToString() == hours.ToString())
                            {
                                UnitPrice = string.IsNullOrEmpty(dt_price.Rows[0]["HourWeekEndPrice"].ToString()) ? 0 : Convert.ToDecimal(dt_price.Rows[0]["HourWeekEndPrice"].ToString());
                            }
                            else if (dt_hotel.Rows[0]["HourRoomTimeLong2"].ToString() == hours.ToString())
                            {
                                UnitPrice = string.IsNullOrEmpty(dt_price.Rows[0]["HourWeekEndPrice2"].ToString()) ? 0 : Convert.ToDecimal(dt_price.Rows[0]["HourWeekEndPrice2"].ToString());
                            }
                            else if (dt_hotel.Rows[0]["HourRoomTimeLong3"].ToString() == hours.ToString())
                            {
                                UnitPrice = string.IsNullOrEmpty(dt_price.Rows[0]["HourWeekEndPrice3"].ToString()) ? 0 : Convert.ToDecimal(dt_price.Rows[0]["HourWeekEndPrice3"].ToString());
                            }
                        }
                    }
                    else
                    {//如果是平常价格
                        if (UnitPrice == 0)
                        {
                            if (dt_hotel.Rows[0]["HourRoomTimeLong"].ToString() == hours.ToString())
                            {
                                UnitPrice = string.IsNullOrEmpty(dt_price.Rows[0]["HourPrice"].ToString()) ? 0 : Convert.ToDecimal(dt_price.Rows[0]["HourPrice"].ToString());
                            }
                            else if (dt_hotel.Rows[0]["HourRoomTimeLong2"].ToString() == hours.ToString())
                            {
                                UnitPrice = string.IsNullOrEmpty(dt_price.Rows[0]["HourPrice2"].ToString()) ? 0 : Convert.ToDecimal(dt_price.Rows[0]["HourPrice2"].ToString());
                            }
                            else if (dt_hotel.Rows[0]["HourRoomTimeLong3"].ToString() == hours.ToString())
                            {
                                UnitPrice = string.IsNullOrEmpty(dt_price.Rows[0]["HourPrice3"].ToString()) ? 0 : Convert.ToDecimal(dt_price.Rows[0]["HourPrice3"].ToString());
                            }
                        }
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
                        UnitPrice = string.IsNullOrEmpty(dt_price.Rows[0]["MonthRentPrice"].ToString()) ? 0 : Convert.ToDecimal(dt_price.Rows[0]["MonthRentPrice"].ToString());
                    }
                    if (DepositPrice == 0)
                        DepositPrice = string.IsNullOrEmpty(dt_hotel.Rows[0]["DepositPrice"].ToString()) ? 0 : Convert.ToDecimal(dt_hotel.Rows[0]["DepositPrice"].ToString());
                    LiveTotalPrice = UnitPrice * Int32.Parse(days);
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

    public DateTime GetLiveDayEndTime(string startTime, string startHour, int days,int checkout_hour,int checkout_minu)
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