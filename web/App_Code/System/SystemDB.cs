using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SmartFramework4v2.Data;
using SmartFramework4v2.Data.SqlServer;
using SmartFramework4v2.Web.Common.JSON;
using SmartFramework4v2.Web.WebExcutor;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

[CSClass("SystemDB")]
public class SystemDB
{
    [CSMethod("GetJudgeList")]
    public object GetJudgeList(int pagnum, int pagesize, string AuthorizeNo, string RoomNo, int lx)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string where = "";
                if (!string.IsNullOrEmpty(AuthorizeNo))
                {
                    where += " and " + dbc.C_Like("a.AuthorizeNo", AuthorizeNo, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(RoomNo))
                {
                    where += " and " + dbc.C_Like("a.RoomNo", RoomNo, LikeStyle.LeftAndRightLike);
                }
                if (lx == 1)
                {
                    where += " and b.IsReply<>1 ";
                }
                else
                {
                    where += " and b.IsReply=1 ";
                }
                string str = @" select a.AuthorizeNo,a.ID,a.RoomNo,a.UserName,a.AddDate,a.Content,c.HotelName,b.Content RpContent,b.IsReply ,b.ReplyDate
                                from Lock_JudgeList a left join Lock_JudgeList b on a.ID=b.ParentId
                                left join Lock_Hotel c on a.HotelId=c.ID
                                left join Lock_Room d on a.RoomId=d.ID
                                where a.ParentId=0 and d.UserId=" + SystemUser.CurrentUser.UserID + where;
                str += where;
                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str + " order by a.ID", pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("GetInvoiceList")]
    public object GetInvoiceList(int pagnum, int pagesize, string AuthorizeNo, string RoomNo, int zt)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string where = "";
                if (!string.IsNullOrEmpty(AuthorizeNo))
                {
                    where += " and " + dbc.C_Like("a.AuthorizeNo", AuthorizeNo, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(RoomNo))
                {
                    where += " and " + dbc.C_Like("a.RoomNo", RoomNo, LikeStyle.LeftAndRightLike);
                }
                if (zt != 0)
                {
                    where += " and a.IsHandler=" + zt;
                }

                string str = @"select a.* from Lock_Invoice a left join  Lock_AuthorizeOrder b on a.AuthorizeNo=b.AuthorizeNo
                              where  b.FDUsreId=" + SystemUser.CurrentUser.UserID + where;
                str += where;
                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str + " order by a.ID", pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("GetTaskList")]
    public object GetTaskList(int pagnum, int pagesize, string AuthorizeNo, string RoomNo, int ServiceStatus)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string where = "";
                if (!string.IsNullOrEmpty(AuthorizeNo))
                {
                    where += " and " + dbc.C_Like("a.AuthorizeNo", AuthorizeNo, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(RoomNo))
                {
                    where += " and " + dbc.C_Like("a.RoomNo", RoomNo, LikeStyle.LeftAndRightLike);
                }
                if (ServiceStatus > 0)
                {
                    where += " and a.ServiceStatus=" + ServiceStatus;
                }

                string str = @"select a.*,b.HotelName from Lock_ServiceApply a left join  Lock_Hotel b on a.HotelId=b.ID
                              where a.FDUserId=" + SystemUser.CurrentUser.UserID + where;
                str += where;
                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str + " order by a.ID desc", pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("GetTask")]
    public object GetTask(int ID)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select * from Lock_ServiceApply where ID=" + ID;
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
    public object GetManagerList(int pagnum, int pagesize)
    {
        using (SmartFramework4v2.Data.MySql.DBConnection dbc = new SmartFramework4v2.Data.MySql.DBConnection(ConfigurationManager.ConnectionStrings["DzfConnStr"].ConnectionString))
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string UserName = GetUserName();

                string sql = "select * from tb_b_manager where UserName='" + UserName + "' and State=0";

                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }



    public string GetUserName()
    {
        using (DBConnection dbc = new DBConnection())
        {
            return dbc.ExecuteScalar("select LoweredUserName from aspnet_Users where UserId=" + SystemUser.CurrentUser.UserID).ToString();
        }
    }

    public void CheckMobile(string tel)
    {
        using (DBConnection dbc = new DBConnection())
        {
            DataTable dt = dbc.ExecuteDataTable("select * from aspnet_Users where LoweredUserName=" + dbc.ToSqlValue(tel));
            if (dt.Rows.Count > 0)
                throw new Exception("该手机号码已注册，请重新输入");

        }
    }

    [CSMethod("GetMDList")]
    public object GetMDList(int pagnum, int pagesize)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string UserName = GetUserName();

                string sql = "select a.GL_ID,b.*,c.* from aspnet_FdAndMdUser a left join aspnet_Users b on a.MEUSERID=b.UserId left join aspnet_Members c on a.MEUSERID=c.UserId where FDUSERID=" + SystemUser.CurrentUser.UserID + "";

                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    //发票处理
    [CSMethod("HandlerInvoice")]
    public object HandlerInvoice(int ID, string authnom, int IsHandler)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "HandlerInvoice");
            parameters.Add("ID", ID.ToString());
            parameters.Add("AuthorizeNo", authnom);
            parameters.Add("IsHandler", IsHandler.ToString());
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;
            return new { status = json["Status"].ToString() };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }


    //发票处理
    [CSMethod("ReplyJudge")]
    public object ReplyJudge(int ID, string content)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "ReplyJudge");
            parameters.Add("parentid", ID.ToString());
            parameters.Add("content", content);
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;
            return new { status = json["Status"].ToString() };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    //获取保洁
    [CSMethod("GetHotelBJList")]
    public object GetHotelBJList(int RoomId)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "GetHotelBJList");
            parameters.Add("roomid", RoomId.ToString());
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;
            return new { status = json["Status"].ToString(), result = JSReader.ParseJSON(json["Info"].ToString()) };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    //服务指派
    [CSMethod("ApplyService")]
    public object ApplyService(JSReader jsr)
    {
        try
        {
            string url = "http://wx.zhisuroom.com/API/LockHandler.ashx";
            IDictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("interface", "ApplyService");
            parameters.Add("selroomid", jsr["RoomId"].ToString());
            parameters.Add("authno", "");
            parameters.Add("servicetype", jsr["ServiceType"].ToString());
            parameters.Add("remark", jsr["Remark"].ToString());
            parameters.Add("starttime", jsr["starttime"].ToString());
            parameters.Add("endtime", jsr["endtime"].ToString());
            parameters.Add("AssignUserId", jsr["AssignUserId"].ToString());
            string result = WebService.CallService(url, parameters);
            JObject json = JsonConvert.DeserializeObject(result) as JObject;
            return new { status = json["Status"].ToString() };
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    #region 字典表
    [CSMethod("GetZDBLXList")]
    public object GetZDBLXList(int pagnum, int pagesize)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string sql = "select * from Lock_ZDBLX where ZT=0 order by LXID";

                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("SaveZDBLX")]
    public object SaveZDBLX(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string id = jsr["LXID"].ToString();
                string LXMC = jsr["LXMC"].ToString();

                if (string.IsNullOrEmpty(id))
                {
                    DataTable dt = dbc.GetEmptyDataTable("Lock_ZDBLX");
                    DataRow dr = dt.NewRow();
                    dr["LXMC"] = LXMC;
                    //dr["LX"] = LX;
                    dr["ZT"] = 0;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    dbc.ExecuteNonQuery("update Lock_ZDBLX set LXMC=" + dbc.ToSqlValue(LXMC) + " where LXID=" + Convert.ToInt16(id));
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("DeleteZDBLX")]
    public object DeleteZDBLX(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                for (int i = 0; i < jsr.ToArray().Length; i++)
                {
                    int ID = jsr.ToArray()[i].ToInteger();
                    dbc.ExecuteNonQuery("update Lock_ZDBLX set ZT=1 where LXID=" + ID);
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

    [CSMethod("GetZDBLX")]
    public object GetZDBLX(int ID)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select * from Lock_ZDBLX where LXID=" + ID;
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetZDBList")]
    public object GetZDBList(int pagnum, int pagesize, string lx)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string where = "";
                if (!string.IsNullOrEmpty(lx))
                    where = " and LX=" + lx;

                string sql = "select * from Lock_ZDB where ZT=0 " + where + " order by XH";

                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(sql, pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("SaveZDB")]
    public object SaveZDB(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string id = jsr["ZDBID"].ToString();
                string MC = jsr["MC"].ToString();
                int LX = Convert.ToInt16(jsr["LX"].ToString());
                string XH = jsr["XH"].ToString();
                if (string.IsNullOrEmpty(id))
                {
                    DataTable dt = dbc.GetEmptyDataTable("Lock_ZDB");
                    DataRow dr = dt.NewRow();
                    dr["MC"] = MC;
                    dr["LX"] = LX;
                    dr["XH"] = XH;
                    dr["ZT"] = 0;
                    dt.Rows.Add(dr);
                    dbc.InsertTable(dt);
                }
                else
                {
                    DataTable dt = dbc.GetEmptyDataTable("Lock_ZDB");
                    dt.Columns["ZDBID"].ReadOnly = false;
                    DataTableTracker dtt = new DataTableTracker(dt);
                    DataRow dr = dt.NewRow();
                    dr["ZDBID"] = id;
                    dr["MC"] = MC;
                    dr["LX"] = LX;
                    dr["XH"] = XH;
                    dr["ZT"] = 0;
                    dt.Rows.Add(dr);
                    dbc.UpdateTable(dt, dtt);
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("DeleteZDB")]
    public object DeleteZDB(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                for (int i = 0; i < jsr.ToArray().Length; i++)
                {
                    int ID = jsr.ToArray()[i].ToInteger();
                    dbc.ExecuteNonQuery("update Lock_ZDB set ZT=1 where ZDBID=" + ID);
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

    [CSMethod("GetZDB")]
    public object GetZDB(int ID)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select * from Lock_ZDB where ZDBID=" + ID;
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetZDLXCombo")]
    public object GetZDLXCombo()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select LXID,LXMC from Lock_ZDBLX where ZT=0";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    #endregion

    [CSMethod("SaveManager")]
    public object SaveManager(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                string Mobile = jsr["CellPhone"].ToString();
                string RealName = jsr["RealName"].ToString();
                string IdCard = jsr["IdCardNo"].ToString();

                DataTable dt = dbc.ExecuteDataTable("select * from aspnet_Users where UserName=" + dbc.ToSqlValue(Mobile));
                if (dt.Rows.Count == 0)
                {
                    int FDUserId = Convert.ToInt16(SystemUser.CurrentUser.UserID);
                    int UserID = Convert.ToInt16(dbc.ExecuteScalar("SELECT IDENT_CURRENT('aspnet_Users') + IDENT_INCR('aspnet_Users')").ToString());
                    DataTable dtUser = dbc.GetEmptyDataTable("aspnet_Users");
                    DataRow drUser = dtUser.NewRow();
                    drUser["UserName"] = Mobile;
                    drUser["LoweredUserName"] = Mobile;
                    drUser["IsAnonymous"] = 0;
                    string PasswordSalt = Convert.ToBase64String(new System.Security.Cryptography.MD5CryptoServiceProvider().ComputeHash(Encoding.Default.GetBytes("123456")));
                    string Password = GetPassWord("123456", PasswordSalt);
                    drUser["PasswordFormat"] = 1;
                    drUser["PasswordSalt"] = PasswordSalt;
                    drUser["Password"] = Password;
                    // drUser["Email"] = Email;
                    //drUser["LoweredEmail"] = Email;
                    drUser["IsApproved"] = 1;
                    drUser["IsLockedOut"] = 0;
                    drUser["CreateDate"] = DateTime.Now;
                    drUser["FailedPasswordAttemptCount"] = 0;
                    drUser["FailedPasswordAnswerAttemptCount"] = 0;
                    drUser["Gender"] = 0;
                    drUser["UserRole"] = 1;
                    drUser["IdCardNo"] = IdCard;
                    drUser["CreditGrade"] = 0;
                    drUser["LastLoginDate"] = DateTime.Now;
                    drUser["LastPasswordChangedDate"] = DateTime.Now;
                    drUser["LastLockoutDate"] = DateTime.Now;
                    drUser["FailedPasswordAttemptWindowStart"] = DateTime.Now;
                    drUser["FailedPasswordAnswerAttemptWindowStart"] = DateTime.Now;
                    drUser["SessionId"] = Guid.NewGuid().ToString();
                    drUser["LastActivityDate"] = DateTime.Now;
                    dtUser.Rows.Add(drUser);

                    DataTable dtMember = dbc.GetEmptyDataTable("aspnet_Members");
                    DataRow drMember = dtMember.NewRow();
                    drMember["UserId"] = UserID;
                    drMember["GradeId"] = 13;
                    drMember["ReferralUserId"] = 0;
                    drMember["IsOpenBalance"] = 1;
                    drMember["TradePassword"] = Password;
                    drMember["TradePasswordSalt"] = PasswordSalt;
                    drMember["TradePasswordFormat"] = 1;
                    drMember["OrderNumber"] = 0;
                    drMember["Expenditure"] = 0;
                    drMember["Points"] = 0;
                    drMember["Balance"] = 0;
                    drMember["RequestBalance"] = 0;
                    drMember["RealName"] = RealName;
                    drMember["CellPhone"] = Mobile;
                    drMember["MemberShipRightId"] = 13;
                    dtMember.Rows.Add(drMember);

                    var dtRole = dbc.GetEmptyDataTable("aspnet_UsersInRoles");
                    var drRole = dtRole.NewRow();
                    drRole["UserId"] = UserID;
                    drRole["RoleId"] = "291FB826-BFDA-4DEC-8329-E63212F6AA15";
                    dtRole.Rows.Add(drRole);

                    drRole = dtRole.NewRow();
                    drRole["UserId"] = UserID;
                    drRole["RoleId"] = "E5AD331C-8CC4-4B3E-9B9D-658CB3DD5AE4";
                    dtRole.Rows.Add(drRole);

                    var dtGL = dbc.GetEmptyDataTable("aspnet_FdAndMdUser");
                    var drGL = dtGL.NewRow();
                    drGL["FDUSERID"] = FDUserId;
                    drGL["MEUSERID"] = UserID;
                    dtGL.Rows.Add(drGL);

                    dbc.InsertTable(dtUser);
                    dbc.InsertTable(dtMember);
                    dbc.InsertTable(dtRole);
                    dbc.InsertTable(dtGL);


                }
                else
                {
                    var dtGL = dbc.GetEmptyDataTable("aspnet_FdAndMdUser");
                    var drGL = dtGL.NewRow();
                    drGL["FDUSERID"] = SystemUser.CurrentUser.UserID;
                    drGL["MEUSERID"] = dt.Rows[0]["UserId"];
                    dtGL.Rows.Add(drGL);
                    dbc.InsertTable(dtGL);
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

    [CSMethod("DeleteManager")]
    public object DeleteManager(JSReader jsr)
    {
        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                for (int i = 0; i < jsr.ToArray().Length; i++)
                {
                    int ID = jsr.ToArray()[i].ToInteger();
                    dbc.ExecuteNonQuery("delete from aspnet_FdAndMdUser where GL_ID=" + ID);
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


    public void InsertYTZUser(DataTable dt)
    {
        using (SmartFramework4v2.Data.SqlServer.DBConnection dbc = new SmartFramework4v2.Data.SqlServer.DBConnection(ConfigurationManager.ConnectionStrings["LockConnStr"].ConnectionString))
        {
            dbc.BeginTransaction();
            try
            {
                string Mobile = dt.Rows[0]["Mobile"].ToString();
                string RealName = dt.Rows[0]["Name"].ToString();
                string Email = dt.Rows[0]["Email"].ToString();
                string IdCard = dt.Rows[0]["IdCard"].ToString();
                int FDUserId = Convert.ToInt16(dt.Rows[0]["UserID"].ToString());
                int UserID = Convert.ToInt16(dbc.ExecuteScalar("SELECT IDENT_CURRENT('aspnet_Users') + IDENT_INCR('aspnet_Users')").ToString());
                DataTable dtUser = dbc.GetEmptyDataTable("aspnet_Users");
                DataRow drUser = dtUser.NewRow();
                drUser["UserName"] = Mobile;
                drUser["LoweredUserName"] = Mobile;
                drUser["IsAnonymous"] = 0;
                string PasswordSalt = Convert.ToBase64String(new System.Security.Cryptography.MD5CryptoServiceProvider().ComputeHash(Encoding.Default.GetBytes("123456")));
                string Password = GetPassWord("123456", PasswordSalt);
                drUser["PasswordFormat"] = 1;
                drUser["PasswordSalt"] = PasswordSalt;
                drUser["Password"] = Password;
                drUser["Email"] = Email;
                drUser["LoweredEmail"] = Email;
                drUser["IsApproved"] = 1;
                drUser["IsLockedOut"] = 0;
                drUser["CreateDate"] = DateTime.Now;
                drUser["FailedPasswordAttemptCount"] = 0;
                drUser["FailedPasswordAnswerAttemptCount"] = 0;
                drUser["Gender"] = 0;
                drUser["UserRole"] = 1;
                drUser["IdCardNo"] = IdCard;
                drUser["CreditGrade"] = 0;
                drUser["LastLoginDate"] = DateTime.Now;
                drUser["LastPasswordChangedDate"] = DateTime.Now;
                drUser["LastLockoutDate"] = DateTime.Now;
                drUser["FailedPasswordAttemptWindowStart"] = DateTime.Now;
                drUser["FailedPasswordAnswerAttemptWindowStart"] = DateTime.Now;
                drUser["SessionId"] = Guid.NewGuid().ToString();
                drUser["LastActivityDate"] = DateTime.Now;
                dtUser.Rows.Add(drUser);

                DataTable dtMember = dbc.GetEmptyDataTable("aspnet_Members");
                DataRow drMember = dtMember.NewRow();
                drMember["UserId"] = UserID;
                drMember["GradeId"] = 13;
                drMember["ReferralUserId"] = 0;
                drMember["IsOpenBalance"] = 1;
                drMember["TradePassword"] = Password;
                drMember["TradePasswordSalt"] = PasswordSalt;
                drMember["TradePasswordFormat"] = 1;
                drMember["OrderNumber"] = 0;
                drMember["Expenditure"] = 0;
                drMember["Points"] = 0;
                drMember["Balance"] = 0;
                drMember["RequestBalance"] = 0;
                drMember["RealName"] = RealName;
                drMember["CellPhone"] = Mobile;
                drMember["MemberShipRightId"] = 13;
                dtMember.Rows.Add(drMember);

                var dtRole = dbc.GetEmptyDataTable("aspnet_UsersInRoles");
                var drRole = dtRole.NewRow();
                drRole["UserId"] = UserID;
                drRole["RoleId"] = "291FB826-BFDA-4DEC-8329-E63212F6AA15";
                dtRole.Rows.Add(drRole);

                drRole = dtRole.NewRow();
                drRole["UserId"] = UserID;
                drRole["RoleId"] = "E5AD331C-8CC4-4B3E-9B9D-658CB3DD5AE4";
                dtRole.Rows.Add(drRole);

                var dtGL = dbc.GetEmptyDataTable("aspnet_FdAndMdUser");
                var drGL = dtGL.NewRow();
                drGL["FDUSERID"] = FDUserId;
                drGL["MEUSERID"] = UserID;
                dtGL.Rows.Add(drGL);

                dbc.InsertTable(dtUser);
                dbc.InsertTable(dtMember);
                dbc.InsertTable(dtRole);
                dbc.InsertTable(dtGL);

                dbc.CommitTransaction();

            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }

    public string GetPassWord(string pw, string pws)
    {
        byte[] bytes = Encoding.Unicode.GetBytes(pw);
        byte[] src = Convert.FromBase64String(pws);
        byte[] dst = new byte[src.Length + bytes.Length];
        byte[] inArray = null;
        Buffer.BlockCopy(src, 0, dst, 0, src.Length);
        Buffer.BlockCopy(bytes, 0, dst, src.Length, bytes.Length);
        return Convert.ToBase64String(HashAlgorithm.Create("SHA1").ComputeHash(dst));
    }

    [CSMethod("GetTenantList")]
    public object GetTenantList(int pagnum, int pagesize, string phone, string name, string sdate, string edate, string roomno, string authno)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string where = "";
                if (!string.IsNullOrEmpty(phone))
                {
                    where += " and " + dbc.C_Like("CellPhone", phone, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(name))
                {
                    where += " and " + dbc.C_Like("RealName", name, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(sdate))
                {
                    where += " and LiveStartDate>='" + Convert.ToDateTime(sdate).ToShortDateString() + "'";
                }
                if (!string.IsNullOrEmpty(edate))
                {
                    where += " and LiveStartDate<='" + Convert.ToDateTime(edate).ToShortDateString() + "'";
                }
                if (!string.IsNullOrEmpty(roomno))
                {
                    where += " and " + dbc.C_Like("RoomNo", roomno, LikeStyle.LeftAndRightLike);
                }
                if (!string.IsNullOrEmpty(authno))
                {
                    where += " and " + dbc.C_Like("AuthorizeNo", authno, LikeStyle.LeftAndRightLike);
                }

                string str = @"select * from(select * from(
 SELECT *,rn=ROW_NUMBER() OVER(PARTITION BY UserId ORDER BY LiveStartDate desc) 
FROM Lock_AuthorizeOrder where HotelId in(select ID from Lock_Hotel where UserId=" + SystemUser.CurrentUser.UserID + ")" + where + @")a where rn=1) a 
                left join (select UserId,sum(GetPoints) Point from Lock_ConsumeDetail where  HotelId in(select ID from Lock_Hotel where UserId=" + SystemUser.CurrentUser.UserID + @") group by UserId) b 
                on a.UserId=b.UserId";

                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str + " order by LiveStartDate desc", pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("GetRZJL")]
    public object GetRZJL(int pagnum, int pagesize, int UserId)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                pagesize = 10000;
                int cp = pagnum;
                int ac = 0;

                string str = @"select a.*,b.context from Lock_AuthorizeOrder a left join Lock_JudgeByFDList b on a.AuthorizeNo=b.AuthorizeNo
                where a.HotelId in(select ID from Lock_Hotel where UserId=1704)
                and a.UserId=" + UserId + " and AuthorStatus>0 and AuthorStatus<=6 order by LiveStartDate desc";

                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str, pagesize, ref cp, out ac);
                dtPage.Columns.Add("tzry");

                DataTable dtUser = dbc.ExecuteDataTable("select * from Lock_OrderUser");
                foreach (DataRow dr in dtPage.Rows)
                {
                    string user = "";
                    DataRow[] drUser = dtUser.Select("AuthorizeNo='" + dr["AuthorizeNo"].ToString() + "'");
                    foreach (DataRow dr1 in drUser)
                    {
                        user += dr1["OrderName"].ToString() + "、";
                    }
                    if (user != "")
                        dr["tzry"] = user.TrimEnd('、');
                }

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

    [CSMethod("GetZDBById")]
    public object GetZDBById(int zdbid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "select * from Lock_ZDB where LX=" + zdbid + " order by XH";
                return dbc.ExecuteDataTable(sqlStr);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetTag")]
    public object GetTag(int lx, string pid)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string sqlStr = "";
                if (string.IsNullOrEmpty(pid))
                    sqlStr = "select *,'' VALUE from Lock_ZDB where LX=" + lx + " order by XH";
                else
                    sqlStr = "select a.*,b.VALUE from Lock_ZDB a left join Lock_Tag b on a.ZDBID=b.ZDBID and b.ZDLX=" + lx + " and b.PID=" + pid + " where a.LX=" + lx;
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