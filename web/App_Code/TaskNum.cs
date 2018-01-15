
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