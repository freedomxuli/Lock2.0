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
/// HotelDB 的摘要说明
/// </summary>
[CSClass("HotelDB")]
public class HotelDB
{
    [CSMethod("GetHotelList")]
    public object GetHotelList(int pagnum, int pagesize, string hotelName)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string where = "";
                if (!string.IsNullOrEmpty(hotelName))
                {
                    where += " and " + dbc.C_Like("HotelName", hotelName, LikeStyle.LeftAndRightLike);
                }


                string str = @"select a.*,b.CellPhone,b.RealName from Lock_Hotel a left join aspnet_Members b on a.UserId=b.UserId 
                where (a.UserId in(select MEUSERID from aspnet_FdAndMdUser where FDUSERID=" + SystemUser.CurrentUser.UserID + ") or a.UserId=" + SystemUser.CurrentUser.UserID + ")";
                str += where;

                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str + " order by a.CreateDate desc", pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("DeleteHotel")]
    public object DeleteHotel(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                for (int i = 0; i < jsr.ToArray().Length; i++)
                {
                    int ID = jsr.ToArray()[i].ToInteger();
                    dbc.ExecuteNonQuery("delete from Lock_Hotel where ID=" + ID + " and UserId=" + SystemUser.CurrentUser.UserID);
                    dbc.ExecuteNonQuery("delete from Lock_Room where HotelId=" + ID + " and UserId=" + SystemUser.CurrentUser.UserID);
                }
                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("UploadPicForProduct", 1)]
    public object UploadPicForProduct(FileData[] fds)
    {

        HttpContext context = HttpContext.Current;
        var Server = context.Server;
        string filename = DateTime.Now.ToString("yyyyMMddHHmmssffff") + "." + fds[0].FileName;
        string truepath = "~/files/Hotel/" + filename;
        if (!Directory.Exists(Server.MapPath("~/files")))
            Directory.CreateDirectory(Server.MapPath("~/files"));
        if (!Directory.Exists(Server.MapPath("~/files/Hotel")))
            Directory.CreateDirectory(Server.MapPath("~/files/Hotel"));
        using (Stream iStream = new FileStream(Server.MapPath(truepath),
                       FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite))
        {
            iStream.Write(fds[0].FileBytes, 0, fds[0].FileBytes.Length);
        }

        return new { fileurl = "files/Hotel/" + filename, isdefault = 0 };

    }

    [CSMethod("SaveHotel")]
    public object SaveHotel(JSReader jsr, JSReader file, JSReader tagIds, JSReader tagValues)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string ID = jsr["ID"].ToString();
                string HotelName = jsr["HotelName"].ToString();
                string HotelNo = jsr["HotelNo"].ToString();
                string Mobile = jsr["Mobile"].ToString();
                string Tel = jsr["Tel"].ToString();
                string DetailAddress = jsr["DetailAddress"].ToString();
                string Province = jsr["Province"].ToString();
                string City = jsr["City"].ToString();
                string County = jsr["County"].ToString();
                string CompleteAddress = Province + City + County + DetailAddress;
                string Lat = jsr["Lat"].ToString();
                string Lng = jsr["Lng"].ToString();
                string ServiceInfo = jsr["ServiceInfo"].ToString();
                int HourRoomTimeLong = 0;
                int HourRoomTimeLong2 = 0;
                int HourRoomTimeLong3 = 0;
                int CheckinHour = 0;
                int CheckinMinute = 0;
                int CheckoutHour = 0;
                int CheckoutMinute = 0;
                float MonthRentPrice = 0;
                float DepositPriceByMonth = 0;
                int JSCycle = 0;
                string AlipayAccount = jsr["AlipayAccount"].ToString();
                string LiableAccount = jsr["LiableAccount"].ToString();
                string CleanerAccount = jsr["CleanerAccount"].ToString();
                string DecRemark = jsr["DecRemark"].ToString();
                string ConsumeRule = jsr["ConsumeRule"].ToString();
                int IsHasWeekendPrice = jsr["IsHasWeekendPrice"].ToInteger();
                int WeekendConatin5 = jsr["WeekendConatin5"].ToInteger();
                int WeekendConatin6 = jsr["WeekendConatin6"].ToInteger();
                int WeekendConatin7 = jsr["WeekendConatin7"].ToInteger();
                int IsOpenDayRent = jsr["IsOpenDayRent"].ToInteger();
                int IsOpenHourRent = jsr["IsOpenHourRent"].ToInteger();
                int IsOpenMonthRent = jsr["IsOpenMonthRent"].ToInteger();
                int ManagementMode = jsr["ManagementMode"].ToInteger();
                int IsAutoAccept = jsr["IsAutoAccept"].ToInteger();
                int HandlerKind = jsr["HandlerKind"].ToInteger();
                int JsPlatSel = jsr["JsPlatSel"].ToInteger();
                if (jsr["HourRoomTimeLong"].ToString() != "")
                    HourRoomTimeLong = jsr["HourRoomTimeLong"].ToInteger();
                if (jsr["HourRoomTimeLong2"].ToString() != "")
                    HourRoomTimeLong2 = jsr["HourRoomTimeLong2"].ToInteger();
                if (jsr["HourRoomTimeLong3"].ToString() != "")
                    HourRoomTimeLong3 = jsr["HourRoomTimeLong3"].ToInteger();
                if (jsr["CheckinHour"].ToString() != "")
                    CheckinHour = jsr["CheckinHour"].ToInteger();
                if (jsr["CheckinMinute"].ToString() != "")
                    CheckinMinute = jsr["CheckinMinute"].ToInteger();
                if (jsr["CheckoutHour"].ToString() != "")
                    CheckoutHour = jsr["CheckoutHour"].ToInteger();
                if (jsr["CheckoutMinute"].ToString() != "")
                    CheckoutMinute = jsr["CheckoutMinute"].ToInteger();
                if (jsr["MonthRentPrice"].ToString() != "")
                    MonthRentPrice = jsr["MonthRentPrice"].ToSingle();
                if (jsr["DepositPriceByMonth"].ToString() != "")
                    DepositPriceByMonth = jsr["DepositPriceByMonth"].ToSingle();
                if (jsr["JSCycle"].ToString() != "")
                    JSCycle = jsr["JSCycle"].ToInteger();
                float DepositPrice = 0;
                if (jsr["DepositPrice"].ToString() != "")
                    DepositPrice = jsr["DepositPrice"].ToSingle();

                var dtHotel = dbc.GetEmptyDataTable("Lock_Hotel");
                var drHotel = dtHotel.NewRow();
                DataTableTracker dtt = new DataTableTracker(dtHotel);
                drHotel["HotelName"] = HotelName;
                drHotel["HotelNo"] = HotelNo;
                drHotel["Mobile"] = Mobile;
                drHotel["Tel"] = Tel;
                drHotel["DetailAddress"] = DetailAddress;
                drHotel["Province"] = Province;
                drHotel["City"] = City;
                drHotel["County"] = County;
                drHotel["CompleteAddress"] = CompleteAddress;
                drHotel["Lat"] = Lat;
                drHotel["Lng"] = Lng;
                drHotel["ServiceInfo"] = ServiceInfo;
                drHotel["HourRoomTimeLong"] = HourRoomTimeLong;
                drHotel["HourRoomTimeLong2"] = HourRoomTimeLong2;
                drHotel["HourRoomTimeLong3"] = HourRoomTimeLong3;
                drHotel["CheckinHour"] = CheckinHour;
                drHotel["CheckinMinute"] = CheckinMinute;
                drHotel["CheckoutHour"] = CheckoutHour;
                drHotel["CheckoutMinute"] = CheckoutMinute;
                drHotel["MonthRentPrice"] = MonthRentPrice;
                drHotel["JSCycle"] = JSCycle;
                drHotel["AlipayAccount"] = AlipayAccount;
                drHotel["LiableAccount"] = LiableAccount;
                drHotel["CleanerAccount"] = CleanerAccount;
                drHotel["DecRemark"] = DecRemark;
                drHotel["ConsumeRule"] = ConsumeRule;
                drHotel["IsHasWeekendPrice"] = IsHasWeekendPrice;
                drHotel["WeekendConatin5"] = WeekendConatin5;
                drHotel["WeekendConatin6"] = WeekendConatin6;
                drHotel["WeekendConatin7"] = WeekendConatin7;
                drHotel["IsOpenDayRent"] = IsOpenDayRent;
                drHotel["IsOpenHourRent"] = IsOpenHourRent;
                drHotel["IsOpenMonthRent"] = IsOpenMonthRent;
                drHotel["JsPlatSel"] = JsPlatSel;
                drHotel["DepositPrice"] = DepositPrice;
                drHotel["ManagementMode"] = ManagementMode;
                drHotel["IsAutoAccept"] = IsAutoAccept;
                drHotel["HandlerKind"] = HandlerKind;
                drHotel["DepositPriceByMonth"] = DepositPriceByMonth;

                drHotel["UserId"] = SystemUser.CurrentUser.UserID;
                drHotel["UserName"] = SystemUser.CurrentUser.UserName;
                for (int i = 1; i < 6; i++)
                {
                    if (file.ToArray().Length >= i)
                        drHotel["Image" + i] = file.ToArray()[i - 1].ToString();
                    else
                        drHotel["Image" + i] = "";
                }
                if (ID == "")
                {
                    drHotel["CreateDate"] = DateTime.Now;
                    dtHotel.Rows.Add(drHotel);
                    dbc.InsertTable(drHotel);
                }
                else
                {
                    drHotel["ID"] = Convert.ToInt16(ID);
                    drHotel["UpdateDate"] = DateTime.Now;
                    dtHotel.Columns["ID"].ReadOnly = false;
                    dtHotel.Rows.Add(drHotel);
                    dbc.UpdateTable(dtHotel, dtt);
                }

                dbc.ExecuteNonQuery("update Lock_ZDB set Info='' where LX=1");
                for (int i = 0; i < tagIds.ToArray().Length; i++)
                {
                    dbc.ExecuteNonQuery("update Lock_ZDB set Info=" + dbc.ToSqlValue(tagValues.ToArray()[i]) + " where ZDBID=" + Convert.ToInt16(tagIds.ToArray()[i].ToString()));
                }

                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("GetHotelInfo")]
    public object GetHotelInfo(int ID)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select * from Lock_Hotel where ID=" + ID;
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetManagerList")]
    public object GetManagerList()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select MEUSERID VALUE,RealName TEXT from aspnet_FdAndMdUser a left join aspnet_Members b on a.MEUSERID=b.UserId where a.FDUSERID=" + SystemUser.CurrentUser.UserID;
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("UpdateHotelManager")]
    public object UpdateHotelManager(int HotelId, int UserId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                dbc.ExecuteNonQuery("update Lock_Hotel set UserId=" + UserId + " where ID=" + HotelId);
                dbc.ExecuteNonQuery("update Lock_Room set UserId=" + UserId + " where HotelId=" + HotelId);
                dbc.CommitTransaction();
                return true;
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("getUserInfo")]
    public object getUserInfo(string phone)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sql = @"select a.RealName,d.RoleName,a.CellPhone,b.IdCardNo
  from aspnet_Members a left join aspnet_Users b on a.UserId=b.UserId
  left join aspnet_UsersInRoles c on a.UserId=c.UserId
  left join aspnet_Roles d on c.RoleId=d.RoleId
  where a.CellPhone= " + dbc.ToSqlValue(phone) + "  order by d.RoleName desc";
                DataTable dt = dbc.ExecuteDataTable(sql);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }


}