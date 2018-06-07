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
                //if (!string.IsNullOrEmpty(hotelName))
                //{
                //    where += " and " + dbc.C_Like("HotelName", hotelName, LikeStyle.LeftAndRightLike);
                //}
                if (!string.IsNullOrEmpty(hotelName))
                {
                    where += " and a.HotelId=" + hotelName;
                }
                if (!string.IsNullOrEmpty(roomNo))
                {
                    where += " and " + dbc.C_Like("RoomNo", roomNo, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(roomKind))
                {
                    where += " and RoomKind=" + roomKind;
                }


                string str = @"select a.*,b.HotelName,c.CellPhone,c.RealName from Lock_Room a left join Lock_Hotel b on a.HotelId=b.ID left join aspnet_Members c on a.UserId=c.UserId where (ParentRoomId=0 or ParentRoomId=-1)
                      and (a.UserId in(select MEUSERID from aspnet_FdAndMdUser where FDUSERID=" + SystemUser.CurrentUser.UserID + ") or a.UserId=" + SystemUser.CurrentUser.UserID + ")";
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
                    dbc.ExecuteNonQuery("delete from Lock_Room where ID=" + ID);
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
            fileurl = "files/Room/" + filename;
        }
        else
        {
            truepath = "~/files/RoomGoods/" + filename;
            fileurl = "files/RoomGoods/" + filename;
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
    public object SaveRoom(JSReader jsr, JSReader roomPic, JSReader goodsPic, JSReader tagIds, JSReader tagValues, string imgs)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                int RoomId;
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
                string RoomAddress = jsr["RoomAddress"].ToString().Trim();
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
                drRoom["RoomAddress"] = RoomAddress;
                drRoom["IsContainSubRoom"] = 0;
                drRoom["GatewayStatus"] = 0;
                drRoom["SwitchStatus"] = 0;
                drRoom["RoomSequence"] = 0;
                drRoom["LockStatus"] = 0;
                drRoom["IsClose"] = 0;
                drRoom["IsService"] = 1;

                drRoom["UserId"] = SystemUser.CurrentUser.UserID;
                drRoom["UserName"] = SystemUser.CurrentUser.UserName;
                //for (int i = 1; i < 6; i++)
                //{
                //    if (roomPic.ToArray().Length >= i)
                //        drRoom["Image" + i] = roomPic.ToArray()[i - 1].ToString();
                //}
                //for (int i = 1; i < 6; i++)
                //{
                //    if (goodsPic.ToArray().Length >= i)
                //        drRoom["GoodsImage" + i] = goodsPic.ToArray()[i - 1].ToString();
                //}

                if (!string.IsNullOrEmpty(imgs))
                {
                    string[] imglist = imgs.Split(new char[] { ',' });
                    for (int i = 1; i < 6; i++)
                    {
                        if (imglist.Count() >= i)
                        {
                            string newfilename = GetNewFilePath(imglist[i - 1], "~/files/Room/");
                            drRoom["Image" + i] = newfilename.Substring(2, newfilename.Length - 2);
                        }
                        else
                            drRoom["Image" + i] = "";
                    }
                }
                else
                {
                    for (int i = 1; i < 6; i++)
                    {
                        drRoom["Image" + i] = "";
                    }
                }
                if (ID == "")
                {
                    string RoomGuid = GenerateNumber(11);
                    drRoom["RoomGuid"] = RoomGuid;
                    drRoom["RoomGuidNumber"] = RoomGuid + "0";
                    drRoom["CreateDate"] = DateTime.Now;
                    dtRoom.Rows.Add(drRoom);
                    dbc.InsertTable(dtRoom);

                    RoomId = Convert.ToInt16(dbc.ExecuteScalar("SELECT IDENT_CURRENT('Lock_Room') + IDENT_INCR('Lock_Room')").ToString());
                }
                else
                {
                    drRoom["ID"] = Convert.ToInt16(ID);
                    drRoom["UpdateDate"] = DateTime.Now;
                    dtRoom.Columns["ID"].ReadOnly = false;
                    dtRoom.Rows.Add(drRoom);
                    dbc.UpdateTable(dtRoom, dtt);

                    dbc.ExecuteNonQuery("delete from Lock_RoomGoodsTag where RoomId=" + Convert.ToInt16(ID));
                    RoomId = Convert.ToInt16(ID);
                }


                for (int i = 0; i < tagIds.ToArray().Length; i++)
                {
                    var dtRoomTag = dbc.GetEmptyDataTable("Lock_RoomGoodsTag");
                    var drRoomTag = dtRoomTag.NewRow();
                    drRoomTag["TagId"] = Convert.ToInt16(tagIds.ToArray()[i].ToString());
                    drRoomTag["RoomId"] = RoomId;
                    drRoomTag["TagDec"] = tagValues.ToArray()[i];
                    dtRoomTag.Rows.Add(drRoomTag);
                    dbc.InsertTable(dtRoomTag);
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

    [CSMethod("GetChildRoomList")]
    public object GetChildRoomList(int pagnum, int pagesize, int parentId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string str = @"select a.*,b.HotelName,c.CellPhone,c.RealName,d.RoomNo ParentRoonNo from Lock_Room a 
                left join Lock_Hotel b on a.HotelId=b.ID
                left join aspnet_Members c on a.UserId=c.UserId 
                left join Lock_Room d on a.ParentRoomId=d.ID
                where a.ParentRoomId=" + parentId;

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
    public object SaveChildRoom(JSReader jsr, JSReader roomPic, JSReader goodsPic, int parentId, int hotelId, string roomGuid, JSReader tagIds, JSReader tagValues, string imgs)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                int RoomId;
                string ID = jsr["ID"].ToString();
                int HotelId = hotelId;
                string RoomNo = jsr["RoomNo"].ToString();
                int RoomCheckStatus = jsr["RoomCheckStatus"].ToInteger();
                int RoomLiveStatus = jsr["RoomLiveStatus"].ToInteger();
                int RoomStyleId;
                string RoomRemark = jsr["RoomRemark"].ToString().Trim();
                string RoomAddress = jsr["RoomAddress"].ToString().Trim();
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
                drRoom["RoomAddress"] = RoomAddress;
                drRoom["RoomRemark"] = RoomRemark;
                drRoom["IsContainSubRoom"] = 0;
                drRoom["GatewayStatus"] = 0;
                drRoom["SwitchStatus"] = 0;

                drRoom["LockStatus"] = 0;
                drRoom["IsClose"] = 0;
                drRoom["IsService"] = 1;

                drRoom["UserId"] = SystemUser.CurrentUser.UserID;
                drRoom["UserName"] = SystemUser.CurrentUser.UserName;
                //for (int i = 1; i < 6; i++)
                //{
                //    if (roomPic.ToArray().Length >= i)
                //        drRoom["Image" + i] = roomPic.ToArray()[i - 1].ToString();
                //}
                //for (int i = 1; i < 6; i++)
                //{
                //    if (goodsPic.ToArray().Length >= i)
                //        drRoom["GoodsImage" + i] = goodsPic.ToArray()[i - 1].ToString();
                //}
                if (!string.IsNullOrEmpty(imgs))
                {
                    string[] imglist = imgs.Split(new char[] { ',' });
                    for (int i = 1; i < 6; i++)
                    {
                        if (imglist.Count() >= i)
                        {
                            string newfilename = GetNewFilePath(imglist[i - 1], "~/files/Room/");
                            drRoom["Image" + i] = newfilename.Substring(2, newfilename.Length - 2);
                        }
                        else
                            drRoom["Image" + i] = "";
                    }
                }
                else
                {
                    for (int i = 1; i < 6; i++)
                    {
                        drRoom["Image" + i] = "";
                    }
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

                    RoomId = Convert.ToInt16(dbc.ExecuteScalar("SELECT IDENT_CURRENT('Lock_Room') + IDENT_INCR('Lock_Room')").ToString());
                }
                else
                {
                    drRoom["ID"] = Convert.ToInt16(ID);
                    drRoom["UpdateDate"] = DateTime.Now;
                    dtRoom.Columns["ID"].ReadOnly = false;
                    dtRoom.Rows.Add(drRoom);
                    dbc.UpdateTable(dtRoom, dtt);

                    dbc.ExecuteNonQuery("delete from Lock_RoomGoodsTag where RoomId=" + Convert.ToInt16(ID));
                    RoomId = Convert.ToInt16(ID);
                }


                for (int i = 0; i < tagIds.ToArray().Length; i++)
                {
                    var dtRoomTag = dbc.GetEmptyDataTable("Lock_RoomGoodsTag");
                    var drRoomTag = dtRoomTag.NewRow();
                    drRoomTag["TagId"] = Convert.ToInt16(tagIds.ToArray()[i].ToString());
                    drRoomTag["RoomId"] = RoomId;
                    drRoomTag["TagDec"] = tagValues.ToArray()[i];
                    dtRoomTag.Rows.Add(drRoomTag);
                    dbc.InsertTable(dtRoomTag);
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
                sqlStr = "select a.*,b.TagName TagName1,b.Unit from Lock_RoomGoodsTag a inner join Lock_GoodsTag b on a.TagId=b.ID where RoomId=" + ID;
                DataTable dt1 = dbc.ExecuteDataTable(sqlStr);
                return new { dt = dt, dt1 = dt1 };
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
            bool iskg = false;
            if (json["status"].ToString() == "ok")
            {
                string equipmentpara = json["equipmentpara_table"].ToString();
                JObject json2 = JsonConvert.DeserializeObject(equipmentpara.Replace("\r\n", "").Replace("[", "").Replace("]", "")) as JObject;
                for (int i = 1; i < 6; i++)
                {
                    if (json2["EquipmentCon" + i + "Type"].ToString() != "无")
                        iskg = true;
                }
            }
            return new { status = json["status"].ToString(), result = result, iskg = iskg };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    [CSMethod("DeviceSQ")]
    public object DeviceSQ(int RoomId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            //dbc.BeginTransaction();
            try
            {
                //string RoomIds = "(";
                //for (int i = 0; i < jsr.ToArray().Length; i++)
                //{
                //    RoomIds += jsr.ToArray()[i] + ",";
                //}
                //RoomIds = RoomIds.Substring(0, RoomIds.Length - 1) + ")";

                string sqlStr = "select a.*,b.RoomGuidNumber from Lock_Device a left join Lock_Room b on a.RoomId=b.ID where RoomId=" + RoomId;
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                int wgNum = 0;
                string info = "{[";
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["DeviceType"].ToString() == "2")
                        wgNum++;
                    if (i == 0)
                        info += "{\"RoomNo\":\"" + dt.Rows[i]["RoomGuidNumber"] + "\",\"EquipmentId\":\"" + dt.Rows[i]["DeviceNo"] + "\",\"EquipmentAuthoriCode\":\"" + dt.Rows[i]["DeviceSN"] + "\"}";
                    else
                        info += ",{\"RoomNo\":\"" + dt.Rows[i]["RoomGuidNumber"] + "\",\"EquipmentId\":\"" + dt.Rows[i]["DeviceNo"] + "\",\"EquipmentAuthoriCode\":\"" + dt.Rows[i]["DeviceSN"] + "\"}";
                }
                info += "]}";

                if (wgNum == 0)
                    throw new Exception("请添加网关设备");

                string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
                IDictionary<string, string> parameters = new Dictionary<string, string>();
                parameters.Add("interface", "SaveDeviceList");
                parameters.Add("info", info);
                string result = WebService.CallService(url, parameters);
                JObject json = JsonConvert.DeserializeObject(result) as JObject;
                if (json["status"].ToString() == "ok")
                {
                    return true;
                }
                else
                {
                    return false;
                }
                // dbc.CommitTransaction();
                return true;

            }
            catch (Exception ex)
            {
                // dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    [CSMethod("DeviceChildSQ")]
    public object DeviceChildSQ(int RoomId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {

                string sqlStr = "select a.*,b.RoomGuidNumber from Lock_Device a left join Lock_Room b on a.RoomId=b.ID where RoomId=" + RoomId;
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                int wgNum = 0;
                string info = "{[";
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["DeviceType"].ToString() == "2")
                        wgNum++;
                    if (i == 0)
                        info += "{\"RoomNo\":\"" + dt.Rows[i]["RoomGuidNumber"] + "\",\"EquipmentId\":\"" + dt.Rows[i]["DeviceNo"] + "\",\"EquipmentAuthoriCode\":\"" + dt.Rows[i]["DeviceSN"] + "\"}";
                    else
                        info += ",{\"RoomNo\":\"" + dt.Rows[i]["RoomGuidNumber"] + "\",\"EquipmentId\":\"" + dt.Rows[i]["DeviceNo"] + "\",\"EquipmentAuthoriCode\":\"" + dt.Rows[i]["DeviceSN"] + "\"}";
                }
                info += "]}";

                if (wgNum == 0)
                    throw new Exception("请添加网关设备");

                string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
                IDictionary<string, string> parameters = new Dictionary<string, string>();
                parameters.Add("interface", "SaveDeviceList");
                parameters.Add("info", info);
                string result = WebService.CallService(url, parameters);
                JObject json = JsonConvert.DeserializeObject(result) as JObject;
                if (json["status"].ToString() == "ok")
                {
                    return true;
                }
                else
                {
                    return false;
                }
                // dbc.CommitTransaction();
                return true;

            }
            catch (Exception ex)
            {
                // dbc.RoolbackTransaction();
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
                string sqlStr = "select ID VALUE,HotelName TEXT from Lock_Hotel where (UserId in(select MEUSERID from aspnet_FdAndMdUser where FDUSERID=" + SystemUser.CurrentUser.UserID + ") or UserId=" + SystemUser.CurrentUser.UserID + ") order by HotelName";
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
    public object SaveRoomGoods(JSReader jsr, int RoomId, string imgs)
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
                drRG["Type"] = jsr["Type"].ToInteger();
                //  drRG["Brand"] = jsr["Brand"].ToInteger();
                drRG["BrandName"] = jsr["BrandName"].ToString();
                drRG["LossPrice"] = jsr["LossPrice"].ToString();
                drRG["Condition"] = jsr["Condition"].ToString();

                if (!string.IsNullOrEmpty(imgs))
                {
                    string[] imglist = imgs.Split(new char[] { ',' });
                    for (int i = 1; i < 2; i++)
                    {
                        if (imglist.Count() >= i)
                        {
                            string newfilename = GetNewFilePath(imglist[i - 1], "~/files/Room/");
                            drRG["Image" + i] = newfilename.Substring(2, newfilename.Length - 2);
                        }
                        else
                            drRG["Image" + i] = "";
                    }
                }
                else
                {
                    for (int i = 1; i < 2; i++)
                    {
                        drRG["Image" + i] = "";
                    }
                }

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
                string ID = jsr["ID"].ToString();
                if (jsr["DeviceType"].ToInteger() == 2)
                {
                    if (ID == "")
                    {
                        int wgNum = Convert.ToInt16(dbc.ExecuteScalar("select count(*) from Lock_Device where RoomId=" + RoomId + " and DeviceType=2 "));
                        if (wgNum > 0)
                            throw new Exception("该房间已存在网关设备");

                    }
                    else
                    {
                        int wgNum = Convert.ToInt16(dbc.ExecuteScalar("select count(*) from Lock_Device where RoomId=" + RoomId + " and DeviceType=2 and ID<>" + ID));
                        if (wgNum > 0)
                            throw new Exception("该房间已存在网关设备");
                    }
                }

                var dtDevice = dbc.GetEmptyDataTable("Lock_Device");
                DataTableTracker dtt = new DataTableTracker(dtDevice);
                var drDevice = dtDevice.NewRow();

                drDevice["RoomId"] = RoomId;
                drDevice["DeviceName"] = jsr["DeviceName"].ToString();
                drDevice["DeviceNo"] = jsr["DeviceNo"].ToString();
                drDevice["DeviceSN"] = jsr["DeviceSN"].ToInteger();
                drDevice["DeviceType"] = jsr["DeviceType"].ToInteger();
                drDevice["CallBackData"] = jsr["CallBackData"].ToString();
                drDevice["BindSuccess"] = 0;
                JObject json = JsonConvert.DeserializeObject(jsr["CallBackData"].ToString()) as JObject;
                string equipmentpara = json["equipmentpara_table"].ToString();
                JObject json2 = JsonConvert.DeserializeObject(equipmentpara.Replace("\r\n", "").Replace("[", "").Replace("]", "")) as JObject;
                drDevice["EquipmentInfoNum"] = json2["EquipmentInfoNum"].ToString();
                drDevice["EquipmentInfo1Type"] = json2["EquipmentInfo1Type"].ToString();
                drDevice["EquipmentInfo2Type"] = json2["EquipmentInfo2Type"].ToString();
                drDevice["EquipmentInfo3Type"] = json2["EquipmentInfo3Type"].ToString();
                drDevice["EquipmentInfo4Type"] = json2["EquipmentInfo4Type"].ToString();
                drDevice["EquipmentInfo5Type"] = json2["EquipmentInfo5Type"].ToString();
                drDevice["EquipmentConNum"] = json2["EquipmentConNum"].ToString();
                drDevice["EquipmentCon1Type"] = json2["EquipmentCon1Type"].ToString();
                drDevice["EquipmentCon2Type"] = json2["EquipmentCon2Type"].ToString();
                drDevice["EquipmentCon3Type"] = json2["EquipmentCon3Type"].ToString();
                drDevice["EquipmentCon4Type"] = json2["EquipmentCon4Type"].ToString();
                drDevice["EquipmentCon5Type"] = json2["EquipmentCon5Type"].ToString();
                if (jsr["DevicePosition"].ToString() != "")
                {
                    dbc.ExecuteNonQuery("update Lock_Device set DevicePosition=null where RoomId=" + RoomId + " and DevicePosition=" + jsr["DevicePosition"].ToString());
                    drDevice["DevicePosition"] = Convert.ToInt16(jsr["DevicePosition"].ToString());
                    drDevice["SwitchName"] = jsr["SwitchName"].ToString();
                    drDevice["SwitchType"] = jsr["SwitchType"].ToString();
                }

                if (ID == "")
                {

                    dtDevice.Rows.Add(drDevice);
                    dbc.InsertTable(dtDevice);
                }
                else
                {
                    if (jsr["DevicePosition"].ToString() == "")
                    {
                        drDevice["DevicePosition"] = DBNull.Value;
                    }
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

    [CSMethod("GetDeviceControlCombobox")]
    public object GetDeviceControlCombobox()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select code VALUE,name TEXT from Lock_DeviceControl";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetMainRoomCombobox")]
    public object GetMainRoomCombobox()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = @"select a.ID VALUE,a.RoomNo TEXT  from Lock_Room a left join Lock_Hotel b on a.HotelId=b.ID left join aspnet_Members c on a.UserId=c.UserId where (ParentRoomId=-1)
                      and (a.UserId in(select MEUSERID from aspnet_FdAndMdUser where FDUSERID=" + SystemUser.CurrentUser.UserID + ") or a.UserId=" + SystemUser.CurrentUser.UserID + ")";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetChildDeviceTypeCombobox")]
    public object GetChildDeviceTypeCombobox()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select ID VALUE,TypeName TEXT from Lock_DeviceType where ID<>2";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetRoomById")]
    public object GetRoomById(int ID)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select * from Lock_Room where ID=" + ID;
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

    [CSMethod("GetRoomPrice")]
    public DataTable GetRoomPrice(int roomId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            string sql = "select * from Lock_RoomOtherDayPrice where RoomId = '" + roomId + "'";
            DataTable dt = dbc.ExecuteDataTable(sql);
            return dt;
        }
    }

    [CSMethod("GetRoomPriceList")]
    public object GetRoomPriceList(int pagnum, int pagesize, int roomId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string str = "select * from Lock_RoomOtherDayPrice where RoomId=" + roomId;

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
                //DataTable dt = dbc.ExecuteDataTable("select * from Lock_RoomOtherDayPrice where RoomId=" + roomId + " and ((StartDate>='" + jsr["StartDate"].ToString() + "' and StartDate<='" + jsr["EndDate"].ToString() + "') or (EndDate>='" + jsr["StartDate"].ToString() + "' and EndDate<='" + jsr["EndDate"].ToString() + "'))");
                //if (dt.Rows.Count > 0)
                //    throw new Exception("该时间段内有价格设置请重新选择");
                string sql = "select * from Lock_RoomOtherDayPrice where RoomId = '" + roomId + "' and StartDate >= '" + jsr["StartDate"].ToDate() + "' and StartDate <= '" + jsr["EndDate"].ToDate() + "'";
                DataTable dt_price = dbc.ExecuteDataTable(sql);
                if (dt_price.Rows.Count > 0)
                {
                    sql = "delete from Lock_RoomOtherDayPrice where RoomId = '" + roomId + "' and StartDate >= '" + jsr["StartDate"].ToDate() + "' and StartDate <= '" + jsr["EndDate"].ToDate() + "'";
                    dbc.ExecuteNonQuery(sql);
                }
                TimeSpan days = jsr["EndDate"].ToDate().Subtract(jsr["StartDate"].ToDate());
                int days_num = days.Days;
                for (int i = 0; i <= days_num; i++)
                {
                    sql = "insert into Lock_RoomOtherDayPrice values(" + roomId + ",'" + jsr["StartDate"].ToDate().AddDays(i) + "','" + jsr["StartDate"].ToDate().AddDays(i) + "','" + jsr["Price"].ToSingle() + "',null,null,'" + jsr["WeekEndPrice"].ToSingle() + "','" + jsr["HourPrice"].ToSingle() + "','" + jsr["HourWeekEndPrice"].ToSingle() + "',null,'" + jsr["HourPrice2"].ToSingle() + "','" + jsr["HourWeekEndPrice2"].ToSingle() + "','" + jsr["HourPrice3"].ToSingle() + "','" + jsr["HourWeekEndPrice3"].ToSingle() + "','" + jsr["MonthRentPrice"].ToSingle() + "',0)";
                    dbc.ExecuteNonQuery(sql);
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

    [CSMethod("GetTag")]
    public object GetTag()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select * from Lock_GoodsTag where TagType=1";
                return dbc.ExecuteDataTable(sqlStr);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetZDB")]
    public object GetZDB(int lx)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select ZDBID VALUE,MC TEXT from Lock_ZDB where LX=" + lx;
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}