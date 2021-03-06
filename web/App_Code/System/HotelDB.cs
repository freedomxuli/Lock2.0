﻿using SmartFramework4v2.Data;
using SmartFramework4v2.Data.SqlServer;
using SmartFramework4v2.Web.Common.JSON;
using SmartFramework4v2.Web.WebExcutor;
using System;
using System.Collections.Generic;
using System.Configuration;
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
                    dbc.ExecuteNonQuery("insert into Lock_HotelOffline select * from Lock_Hotel where ID=" + ID);
                    dbc.ExecuteNonQuery("delete from Lock_Hotel where ID=" + ID);
                    dbc.ExecuteNonQuery("delete from Lock_Room where HotelId=" + ID);
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
    public object SaveHotel(JSReader jsr, JSReader file, JSReader tagIds, JSReader tagValues, string imgs)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                int HotelId;
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
                int JudgeinHour = 0;
                int JudgeinMinute = 0;
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
                if (jsr["JudgeinHour"].ToString() != "")
                    JudgeinHour = jsr["JudgeinHour"].ToInteger();
                if (jsr["JudgeinMinute"].ToString() != "")
                    JudgeinMinute = jsr["JudgeinMinute"].ToInteger();
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
                drHotel["JudgeinHour"] = JudgeinHour;
                drHotel["JudgeinMinute"] = JudgeinMinute;
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
                //for (int i = 1; i < 6; i++)
                //{
                //    if (file.ToArray().Length >= i)
                //        drHotel["Image" + i] = file.ToArray()[i - 1].ToString();
                //    else
                //        drHotel["Image" + i] = "";
                //}
                if (!string.IsNullOrEmpty(imgs))
                {
                    string[] imglist = imgs.Split(new char[] { ',' });
                    for (int i = 1; i < 6; i++)
                    {
                        if (imglist.Count() >= i)
                        {
                            string newfilename = GetNewFilePath(imglist[i - 1], "~/files/Hotel/");
                            drHotel["Image" + i] = newfilename.Substring(2, newfilename.Length - 2);
                        }
                        else
                            drHotel["Image" + i] = "";
                    }

                }
                else
                {
                    for (int i = 1; i < 6; i++)
                    {
                        drHotel["Image" + i] = "";
                    }
                }
                if (ID == "")
                {
                    HotelId = Convert.ToInt16(dbc.ExecuteScalar("SELECT IDENT_CURRENT('Lock_Room') + IDENT_INCR('Lock_Room')").ToString());

                    drHotel["CreateDate"] = DateTime.Now;
                    dtHotel.Rows.Add(drHotel);
                    dbc.InsertTable(drHotel);
                }
                else
                {
                    HotelId = Convert.ToInt16(ID);
                    drHotel["ID"] = Convert.ToInt16(ID);
                    drHotel["UpdateDate"] = DateTime.Now;
                    dtHotel.Columns["ID"].ReadOnly = false;
                    dtHotel.Rows.Add(drHotel);
                    dbc.UpdateTable(dtHotel, dtt);
                }

                dbc.ExecuteNonQuery("delete from Lock_Tag where PID=" + HotelId + " and ZDLX=1");
                DataTable dtTag = dbc.GetEmptyDataTable("Lock_Tag");
                for (int i = 0; i < tagIds.ToArray().Length; i++)
                {
                    DataRow drTag = dtTag.NewRow();
                    drTag["ZDBID"] = Convert.ToInt16(tagIds.ToArray()[i].ToString());
                    drTag["ZDLX"] = 1;
                    drTag["VALUE"] = tagValues.ToArray()[i];
                    drTag["PID"] = HotelId;
                    dtTag.Rows.Add(drTag);
                }
                dbc.InsertTable(dtTag);

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

    public static string GetNewFilePath(string oldfilename, string newpath)
    {
        try
        {
            if (File.Exists(HttpContext.Current.Server.MapPath(oldfilename)))
            {
                FileInfo fileinfo = new FileInfo(HttpContext.Current.Server.MapPath(oldfilename));
                string dirfilename = HttpContext.Current.Server.MapPath(newpath) + fileinfo.Name;
                if (!Directory.Exists(HttpContext.Current.Server.MapPath(newpath)))
                    Directory.CreateDirectory(HttpContext.Current.Server.MapPath(newpath));
                if (!File.Exists(dirfilename))
                    fileinfo.CopyTo(dirfilename);
                return newpath + fileinfo.Name;
            }
            else
                return "";
        }
        catch
        {
            return "";
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

    [CSMethod("GetCleanerList")]
    public object GetCleanerList(int HotelId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = @"select a.ID,c.* from Lock_BJBelong a inner join aspnet_UsersInRoles b on a.BJUserId=b.UserId
                                  inner join aspnet_Members c on a.BJUserId=c.UserId
                                  where b.RoleId='E3EE2BCE-1041-4ABE-9245-70E088A983A2'
                                  and a.HotelId=" + HotelId + "";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetCleanerCombo")]
    public object GetCleanerCombo()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = @"select a.UserId VALUE,RealName TEXT from aspnet_Members a inner join aspnet_UsersInRoles b on a.UserId=b.UserId
                                  where b.RoleId='E3EE2BCE-1041-4ABE-9245-70E088A983A2'";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("SaveCleaner")]
    public object SaveCleaner(int BjId, int HotelId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                dbc.ExecuteNonQuery("delete from Lock_BJBelong where BJUserId=" + BjId + " and HotelId=" + HotelId);

                DataTable dt = dbc.GetEmptyDataTable("Lock_BJBelong");
                DataRow dr = dt.NewRow();
                dr["BJUserId"] = BjId;
                dr["FDUerId"] = SystemUser.CurrentUser.UserID;
                dr["HotelId"] = HotelId;
                dr["CreateTime"] = DateTime.Now;
                dt.Rows.Add(dr);
                dbc.InsertTable(dt);
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

    [CSMethod("DeleteCleaner")]
    public object DeleteCleaner(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                for (int i = 0; i < jsr.ToArray().Length; i++)
                {
                    int ID = jsr.ToArray()[i].ToInteger();

                    dbc.ExecuteNonQuery("delete from Lock_BJBelong where ID=" + ID);
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

    [CSMethod("GetOfflineHotelList")]
    public object GetOfflineHotelList(int pagnum, int pagesize, string hotelName)
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


                string str = @"select a.*,b.CellPhone,b.RealName from Lock_HotelOffline a left join aspnet_Members b on a.UserId=b.UserId 
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

    [CSMethod("GetSQM")]
    public object GetSQM()
    {
        using (var dbc = new DBConnection())
        {
            string sql = "select UserName from aspnet_Users where UserId=" + SystemUser.CurrentUser.UserID;
            string username = dbc.ExecuteScalar(sql).ToString();

            using (SmartFramework4v2.Data.MySql.DBConnection db = new SmartFramework4v2.Data.MySql.DBConnection(ConfigurationManager.ConnectionStrings["DzfConnStr"].ConnectionString))
            {
                sql = "select DealerAuthoriCode from tb_b_landlord where LoginName='" + username + "'";
                DataTable dt = db.ExecuteDataTable(sql);
                return dt;
            }
        }
    }
}