﻿using Newtonsoft.Json;
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
/// FinanceDB 的摘要说明
/// </summary>
[CSClass("FinanceDB")]
public class FinanceDB
{
    [CSMethod("GetHotelCombobox")]
    public object GetHotelCombobox()
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                SystemUser user = SystemUser.CurrentUser;
                string sqlStr = @"  select ID,HotelName from
                                      (
                                      select ID,HotelName,UserId from [zhisuroom].[dbo].[Lock_Hotel] where UserId= '" + user.UserID + @"'
                                      UNION ALL
                                      select ID,HotelName,UserId from [zhisuroom].[dbo].[Lock_Hotel] where UserId IN (select MEUSERID from [zhisuroom].[dbo].[aspnet_FdAndMdUser] where FDUSERID = '" + user.UserID + @"' and MEUSERID != '" + user.UserID + @"')
                                      ) a order by UserId,ID";
                DataTable dt = dbc.ExecuteDataTable(sqlStr);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("GetFinanceList")]
    public object GetFinanceList(int pagnum, int pagesize, string HotelID)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                int cp = pagnum;
                int ac = 0;

                string where = "";

                where += " and f.HotelId = h.ID and f.HotelId=" + HotelID;

                string str = @"select f.*,u.UserName,m.CellPhone,m.RealName,h.HotelName from Lock_FinanceList as f left join aspnet_Users as u on f.UserId=u.UserId left join aspnet_Members as m on m.UserId=u.UserId,Lock_Hotel as h
                              where f.UserId=" + SystemUser.CurrentUser.UserID + where;
                str += where;
                //开始取分页数据
                System.Data.DataTable dtPage = new System.Data.DataTable();
                dtPage = dbc.GetPagedDataTable(str + " order by f.ID desc", pagesize, ref cp, out ac);

                return new { dt = dtPage, cp = cp, ac = ac };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}