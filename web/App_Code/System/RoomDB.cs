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
/// HotelDB 的摘要说明
/// </summary>
[CSClass("RoomDB")]
public class RoomDB
{
    [CSMethod("GetRoomList")]
    public object GetRoomList(int pagnum, int pagesize, string hotelName, string roomNo, string roomKind)
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
                if (!string.IsNullOrEmpty(hotelName))
                {
                    where += " and " + dbc.C_Like("RoomNo", roomNo, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(roomKind))
                {
                    where += " and RoomKind=" + roomKind;
                }


                string str = "select a.*,b.HotelName,c.CellPhone,c.RealName from Lock_Room a left join Lock_Hotel b on a.HotelId=b.ID left join aspnet_Members c on a.UserId=c.UserId where (ParentRoomId=0 or ParentRoomId=-1)";
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

    [CSMethod("DeleteRoom")]
    public object DeleteRoom(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                for (int i = 0; i < jsr.ToArray().Length; i++)
                {
                    int ID = jsr.ToArray()[i].ToInteger();
                    dbc.ExecuteNonQuery("delete from Lock_Room where ID=" + ID + " and UserId=" + SystemUser.CurrentUser.UserID);
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
    public object UploadPicForProduct(FileData[] fds, int lx)
    {

        HttpContext context = HttpContext.Current;
        var Server = context.Server;
        string filename = DateTime.Now.ToString("yyyyMMddHHmmssffff") + "." + fds[0].FileName;
        string truepath = "";
        string fileurl = "";
        if (lx == 1)
        {
            truepath = "~/files/Room/" + filename;
            fileurl = "approot/r/files/Room/" + filename;
        }
        else
        {
            truepath = "~/files/RoomGoods/" + filename;
            fileurl = "approot/r/files/RoomGoods/" + filename;
        }
        if (!Directory.Exists(Server.MapPath("~/files")))
            Directory.CreateDirectory(Server.MapPath("~/files"));
        if (!Directory.Exists(Server.MapPath("~/files/Room")))
            Directory.CreateDirectory(Server.MapPath("~/files/Room"));
        if (!Directory.Exists(Server.MapPath("~/files/RoomGoods")))
            Directory.CreateDirectory(Server.MapPath("~/files/RoomGoods"));
        using (Stream iStream = new FileStream(Server.MapPath(truepath),
                       FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite))
        {
            iStream.Write(fds[0].FileBytes, 0, fds[0].FileBytes.Length);
        }

        return new { fileurl = fileurl, isdefault = 0 };

    }

    [CSMethod("SaveRoom")]
    public object SaveRoom(JSReader jsr, JSReader roomPic, JSReader goodsPic)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string ID = jsr["ID"].ToString();
                int RoomKind = jsr["RoomKind"].ToInteger();
                int ParentRoomId;
                if (RoomKind == 1)
                    ParentRoomId = -1;
                else
                    ParentRoomId = 0;
                int HotelId = jsr["HotelId"].ToInteger();
                string RoomNo = jsr["RoomNo"].ToString();
                int RoomCheckStatus = jsr["RoomCheckStatus"].ToInteger();
                int RoomLiveStatus = jsr["RoomLiveStatus"].ToInteger();
                int RoomStyleId;
                string RoomRemark = jsr["RoomRemark"].ToString().Trim();
                string RoomStyle = jsr["Name"].ToString().Trim();
                DataTable dtRoomStyle = dbc.ExecuteDataTable("select * from Lock_RoomStyle where Name=" + dbc.ToSqlValue(RoomStyle));
                if (dtRoomStyle.Rows.Count == 0)
                {
                    RoomStyleId = Convert.ToInt16(dbc.ExecuteScalar("SELECT IDENT_CURRENT('Lock_RoomStyle') + IDENT_INCR('Lock_RoomStyle')").ToString());
                    var dtRS = dbc.GetEmptyDataTable("Lock_RoomStyle");
                    var drRS = dtRS.NewRow();
                    drRS["Name"] = RoomStyle;
                    dtRS.Rows.Add(drRS);
                    dbc.InsertTable(dtRS);
                }
                else
                {
                    RoomStyleId = Convert.ToInt16(dtRoomStyle.Rows[0]["ID"].ToString());
                }

                var dtRoom = dbc.GetEmptyDataTable("Lock_Room");
                var drRoom = dtRoom.NewRow();
                DataTableTracker dtt = new DataTableTracker(dtRoom);
                drRoom["ParentRoomId"] = ParentRoomId;
                drRoom["HotelId"] = HotelId;
                drRoom["RoomNo"] = RoomNo;
                drRoom["RoomCheckStatus"] = RoomCheckStatus;
                drRoom["RoomLiveStatus"] = RoomLiveStatus;
                drRoom["RoomKind"] = RoomKind;
                drRoom["RoomStyleId"] = RoomStyleId;
                drRoom["RoomRemark"] = RoomRemark;
                drRoom["IsContainSubRoom"] = 0;
                drRoom["GatewayStatus"] = 0;
                drRoom["SwitchStatus"] = 0;
                drRoom["RoomSequence"] = 0;
                drRoom["LockStatus"] = 0;
                drRoom["IsClose"] = 0;

                drRoom["UserId"] = SystemUser.CurrentUser.UserID;
                drRoom["UserName"] = SystemUser.CurrentUser.UserName;
                for (int i = 1; i < 6; i++)
                {
                    if (roomPic.ToArray().Length >= i)
                        drRoom["Image" + i] = roomPic.ToArray()[i - 1].ToString();
                }
                for (int i = 1; i < 6; i++)
                {
                    if (goodsPic.ToArray().Length >= i)
                        drRoom["GoodsImage" + i] = goodsPic.ToArray()[i - 1].ToString();
                }
                if (ID == "")
                {
                    string RoomGuid = GenerateNumber(11);
                    drRoom["RoomGuid"] = RoomGuid;
                    drRoom["RoomGuidNumber"] = RoomGuid + "0";
                    drRoom["CreateDate"] = DateTime.Now;
                    dtRoom.Rows.Add(drRoom);
                    dbc.InsertTable(dtRoom);
                }
                else
                {
                    drRoom["ID"] = Convert.ToInt16(ID);
                    drRoom["UpdateDate"] = DateTime.Now;
                    dtRoom.Columns["ID"].ReadOnly = false;
                    dtRoom.Rows.Add(drRoom);
                    dbc.UpdateTable(dtRoom, dtt);
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

    [CSMethod("GetChildRoomList")]
    public object GetChildRoomList(int pagnum, int pagesize, int parentId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string str = "select a.*,b.HotelName,c.CellPhone,c.RealName from Lock_Room a left join Lock_Hotel b on a.HotelId=b.ID left join aspnet_Members c on a.UserId=c.UserId where ParentRoomId=" + parentId;

                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str + " order by a.RoomSequence", pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("SaveChildRoom")]
    public object SaveChildRoom(JSReader jsr, JSReader roomPic, JSReader goodsPic, int parentId, int hotelId, string roomGuid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string ID = jsr["ID"].ToString();
                int HotelId = hotelId;
                string RoomNo = jsr["RoomNo"].ToString();
                int RoomCheckStatus = jsr["RoomCheckStatus"].ToInteger();
                int RoomLiveStatus = jsr["RoomLiveStatus"].ToInteger();
                int RoomStyleId;
                string RoomRemark = jsr["RoomRemark"].ToString().Trim();
                string RoomStyle = jsr["Name"].ToString().Trim();
                DataTable dtRoomStyle = dbc.ExecuteDataTable("select * from Lock_RoomStyle where Name=" + dbc.ToSqlValue(RoomStyle));
                if (dtRoomStyle.Rows.Count == 0)
                {
                    RoomStyleId = Convert.ToInt16(dbc.ExecuteScalar("SELECT IDENT_CURRENT('Lock_RoomStyle') + IDENT_INCR('Lock_RoomStyle')").ToString());
                    var dtRS = dbc.GetEmptyDataTable("Lock_RoomStyle");
                    var drRS = dtRS.NewRow();
                    drRS["Name"] = RoomStyle;
                    dtRS.Rows.Add(drRS);
                    dbc.InsertTable(dtRS);
                }
                else
                {
                    RoomStyleId = Convert.ToInt16(dtRoomStyle.Rows[0]["ID"].ToString());
                }

                var dtRoom = dbc.GetEmptyDataTable("Lock_Room");
                var drRoom = dtRoom.NewRow();
                DataTableTracker dtt = new DataTableTracker(dtRoom);
                drRoom["ParentRoomId"] = parentId;
                drRoom["HotelId"] = HotelId;
                drRoom["RoomNo"] = RoomNo;
                drRoom["RoomCheckStatus"] = RoomCheckStatus;
                drRoom["RoomLiveStatus"] = RoomLiveStatus;
                drRoom["RoomKind"] = 2;
                drRoom["RoomStyleId"] = RoomStyleId;
                drRoom["RoomRemark"] = RoomRemark;
                drRoom["IsContainSubRoom"] = 0;
                drRoom["GatewayStatus"] = 0;
                drRoom["SwitchStatus"] = 0;

                drRoom["LockStatus"] = 0;
                drRoom["IsClose"] = 0;

                drRoom["UserId"] = SystemUser.CurrentUser.UserID;
                drRoom["UserName"] = SystemUser.CurrentUser.UserName;
                for (int i = 1; i < 6; i++)
                {
                    if (roomPic.ToArray().Length >= i)
                        drRoom["Image" + i] = roomPic.ToArray()[i - 1].ToString();
                }
                for (int i = 1; i < 6; i++)
                {
                    if (goodsPic.ToArray().Length >= i)
                        drRoom["GoodsImage" + i] = goodsPic.ToArray()[i - 1].ToString();
                }
                if (ID == "")
                {
                    int childCount = Convert.ToInt16(dbc.ExecuteScalar("select count(0) from Lock_Room where ParentRoomId=" + parentId));
                    drRoom["RoomSequence"] = childCount;
                    drRoom["RoomGuid"] = roomGuid;
                    drRoom["RoomGuidNumber"] = roomGuid + "" + childCount;
                    drRoom["CreateDate"] = DateTime.Now;
                    dtRoom.Rows.Add(drRoom);
                    dbc.InsertTable(dtRoom);
                }
                else
                {
                    drRoom["ID"] = Convert.ToInt16(ID);
                    drRoom["UpdateDate"] = DateTime.Now;
                    dtRoom.Columns["ID"].ReadOnly = false;
                    dtRoom.Rows.Add(drRoom);
                    dbc.UpdateTable(dtRoom, dtt);
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

    [CSMethod("GetRoomInfo")]
    public object GetRoomInfo(int ID)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select a.*,b.Name from Lock_Room a left join Lock_RoomStyle b on a.RoomStyleId=b.ID where a.ID=" + ID;
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetDevice")]
    public object GetDevice(JSReader jsr)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "GetDevice");
            parameters.Add("deviceno", jsr["DeviceNo"].ToString());
            parameters.Add("devicesn", jsr["DeviceSN"].ToString());
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;
            return new { status = json["status"].ToString(), result };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("GetHotelCombobox")]
    public object GetHotelCombobox()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select ID VALUE,HotelName TEXT from Lock_Hotel where 1=1 order by HotelName";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetRoomGoods")]
    public object GetRoomGoods(int RoomId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select * from Lock_RoomGoods where RoomId=" + RoomId + " order by Sort";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetRoomGoodsInfo")]
    public object GetRoomGoodsInfo(int ID)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select * from Lock_RoomGoods where ID=" + ID;
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("SaveRoomGoods")]
    public object SaveRoomGoods(JSReader jsr, int RoomId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                var dtRG = dbc.GetEmptyDataTable("Lock_RoomGoods");
                DataTableTracker dtt = new DataTableTracker(dtRG);
                var drRG = dtRG.NewRow();
                string ID = jsr["ID"].ToString();
                drRG["RoomId"] = RoomId;
                drRG["Name"] = jsr["Name"].ToString();
                drRG["Number"] = jsr["Number"].ToInteger();
                drRG["Money"] = jsr["Money"].ToString();
                drRG["Unit"] = jsr["Unit"].ToString();
                drRG["Sort"] = jsr["Sort"].ToInteger();
                if (ID == "")
                {
                    dtRG.Rows.Add(drRG);
                    dbc.InsertTable(dtRG);
                }
                else
                {
                    drRG["ID"] = Convert.ToInt16(ID);
                    dtRG.Rows.Add(drRG);
                    dtRG.Columns["ID"].ReadOnly = false;
                    dbc.UpdateTable(dtRG, dtt);
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

    [CSMethod("DeleteRoomGoods")]
    public object DeleteRoomGoods(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                for (int i = 0; i < jsr.ToArray().Length; i++)
                {
                    int ID = jsr.ToArray()[i].ToInteger();
                    dbc.ExecuteNonQuery("delete from Lock_RoomGoods where ID=" + ID);
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

    [CSMethod("GetRoomDevice")]
    public object GetRoomDevice(int RoomId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select a.*,b.TypeName from Lock_Device a left join Lock_DeviceType b on a.DeviceType=b.ID where RoomId=" + RoomId;
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetRoomDeviceInfo")]
    public object GetRoomDeviceInfo(int ID)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select * from Lock_Device where ID=" + ID;
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("SaveRoomDevice")]
    public object SaveRoomDevice(JSReader jsr, int RoomId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                var dtDevice = dbc.GetEmptyDataTable("Lock_Device");
                DataTableTracker dtt = new DataTableTracker(dtDevice);
                var drDevice = dtDevice.NewRow();
                string ID = jsr["ID"].ToString();
                drDevice["RoomId"] = RoomId;
                drDevice["DeviceName"] = jsr["DeviceName"].ToString();
                drDevice["DeviceNo"] = jsr["DeviceNo"].ToString();
                drDevice["DeviceSN"] = jsr["DeviceSN"].ToInteger();
                drDevice["DeviceType"] = jsr["DeviceType"].ToInteger();
                drDevice["CallBackData"] = jsr["CallBackData"].ToString();
                drDevice["BindSuccess"] = 0;
                if (ID == "")
                {
                    dtDevice.Rows.Add(drDevice);
                    dbc.InsertTable(dtDevice);
                }
                else
                {
                    drDevice["ID"] = Convert.ToInt16(ID);
                    dtDevice.Rows.Add(drDevice);
                    dtDevice.Columns["ID"].ReadOnly = false;
                    dbc.UpdateTable(dtDevice, dtt);
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

    [CSMethod("DeleteRoomDevice")]
    public object DeleteRoomDevice(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                for (int i = 0; i < jsr.ToArray().Length; i++)
                {
                    int ID = jsr.ToArray()[i].ToInteger();
                    dbc.ExecuteNonQuery("delete from Lock_Device where ID=" + ID);
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

    [CSMethod("GetDeviceTypeCombobox")]
    public object GetDeviceTypeCombobox()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select ID VALUE,TypeName TEXT from Lock_DeviceType";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    public static string GenerateNumber(int length)
    {
        string s = "";
        for (int i = 0; i < length; i++)
        {
            Random rd = new Random(Guid.NewGuid().GetHashCode());
            if (i == 0)
                s += rd.Next(1, 9);
            else
                s += rd.Next(0, 9);
        }
        return s;
    }

    [CSMethod("GetRoomPriceList")]
    public object GetRoomPriceList(int pagnum, int pagesize, int roomId, int priceType)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string str = "select * from Lock_RoomOtherDayPrice where RoomId=" + roomId + " and priceType=" + priceType + "";

                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str + "  order by EndDate desc", pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("SaveRoomPrice")]
    public object SaveRoomPrice(JSReader jsr, int roomId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                var dtPrice = dbc.GetEmptyDataTable("Lock_RoomOtherDayPrice");
                DataTableTracker dtt = new DataTableTracker(dtPrice);
                var drPrice = dtPrice.NewRow();
                string ID = jsr["ID"].ToString();
                drPrice["RoomId"] = roomId;
                drPrice["PriceType"] = jsr["PriceType"].ToInteger();
                drPrice["StartDate"] = jsr["StartDate"].ToDate();
                drPrice["EndDate"] = jsr["EndDate"].ToDate();
                drPrice["Price"] = jsr["Price"].ToSingle();
                drPrice["WeekEndPrice"] = jsr["WeekEndPrice"].ToSingle();
                if (ID == "")
                {
                    dtPrice.Rows.Add(drPrice);
                    dbc.InsertTable(dtPrice);
                }
                else
                {
                    drPrice["ID"] = Convert.ToInt16(ID);
                    dtPrice.Rows.Add(drPrice);
                    dtPrice.Columns["ID"].ReadOnly = false;
                    dbc.UpdateTable(dtPrice, dtt);
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

    [CSMethod("DeleteRoomPrice")]
    public object DeleteRoomPrice(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                for (int i = 0; i < jsr.ToArray().Length; i++)
                {
                    int ID = jsr.ToArray()[i].ToInteger();
                    dbc.ExecuteNonQuery("delete from Lock_RoomOtherDayPrice where ID=" + ID);
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


}