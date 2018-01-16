
using SmartFramework4v2.Data.SqlServer;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

/// <summary>
/// TaskNum 的摘要说明
/// </summary>
namespace Task
{
    public class TaskNum
    {
        public static int GetTaskNum(string MenuName)
        {
            using (DBConnection dbc = new DBConnection())
            {
                try
                {
                    int result = 0;
                    string sql = "";
                    if (MenuName == "待确认,approot/r/page/AuthorizeOrder/AuthorizeOrderList.html?zt=1")
                    {
                        sql = @"select count(*) from Lock_AuthorizeOrder a
                                 left join Lock_Hotel b on a.HotelId=b.ID
                                 where AuthorStatus=1 and AuthorizeBookStatus=1  and FDUsreId=" + SystemUser.CurrentUser.UserID;
                    }
                    else if (MenuName == "待审核,approot/r/page/AuthorizeOrder/AuthorizeOrderList.html?zt=2")
                    {
                        sql = @"select count(*) from Lock_AuthorizeOrder a
                                 left join Lock_Hotel b on a.HotelId=b.ID
                                 where HandlerKind=1 and OrderUserState=0 and AuthorLiveStatus=1 and FDUsreId=" + SystemUser.CurrentUser.UserID;
                    }
                    else if (MenuName == "待结算,approot/r/page/AuthorizeOrder/AuthorizeOrderList.html?zt=3")
                    {
                        sql = @"select count(*) from Lock_AuthorizeOrder a
                                 left join Lock_Hotel b on a.HotelId=b.ID
                                 where AuthorStatus=3  and AuthorLiveStatus=6 and FDUsreId=" + SystemUser.CurrentUser.UserID ;
                    }
                    else if (MenuName == "待确认,approot/r/page/System/TaskList.html?zt=1")
                    {
                        sql = @"select count(*) from Lock_ServiceApply a left join  Lock_Hotel b on a.HotelId=b.ID
                              where a.FDUserId=" + SystemUser.CurrentUser.UserID + " and a.ServiceStatus=1";
                    }
                    else if (MenuName == "待确认,approot/r/page/System/InvoiceList.html?zt=2")
                    {
                        sql = @"select count(*) from Lock_Invoice a left join  Lock_AuthorizeOrder b on a.AuthorizeNo=b.AuthorizeNo
                              where  b.FDUsreId=" + SystemUser.CurrentUser.UserID + " and a.IsHandler=2";
                    }
                    else if (MenuName == "待回复,approot/r/page/System/JudgeList.html")
                    {
                        sql = @"select count(*)
                                from Lock_JudgeList a left join Lock_JudgeList b on a.ID=b.ParentId
                                left join Lock_Hotel c on a.HotelId=c.ID
                                left join Lock_Room d on a.RoomId=d.ID
                                where a.ParentId=0 and d.UserId=" + SystemUser.CurrentUser.UserID + " and b.IsReply<>1";
                    }
                    //else if (MenuName == "账单确认,approot/r/page/Finance/FinanceConfirm.html")
                    //{
                    //    sql = @"";
                    //}
                    //else if (MenuName == "")
                    //{
                    //    sql = @"";
                    //}
                    //else if (MenuName == "")
                    //{
                    //    sql = @"";
                    //}
                    //else if (MenuName == "")
                    //{
                    //    sql = @"";
                    //}

                    if (sql != "")
                        result = Convert.ToInt32(dbc.ExecuteScalar(sql).ToString());
                    return result;
                }
                catch (Exception ex)
                {
                    string kk = MenuName;
                    throw ex;
                }
            }
        }

        public static string GetRoleName()
        {
            using (DBConnection dbc = new DBConnection())
            {
                try
                {
                    string sqlStr = @"select c.* from aspnet_Users a inner join aspnet_UsersInRoles b on a.UserId=b.UserId
  inner join aspnet_Roles c on b.RoleId=c.RoleId
  where a.UserId=" + SystemUser.CurrentUser.UserID + " order by rolename desc";

                    DataTable dt = dbc.ExecuteDataTable(sqlStr);
                    string RoleName = dt.Rows[0]["RoleName"].ToString();
                    return RoleName;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
    }
}