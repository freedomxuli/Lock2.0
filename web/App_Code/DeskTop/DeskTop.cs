using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using SmartFramework4v2.Data.SqlServer;
using System.Text;
using SmartFramework4v2.Web.WebExcutor;

/// <summary>
/// DeskTop 的摘要说明
/// </summary>
[CSClass("DeskTop")]
public class DeskTop
{
	public DeskTop()
	{
		//
		// TODO: 在此处添加构造函数逻辑
		//
	}

    [CSMethod("Tshow")]
    public string Tshow()
    {
        string html = SmartFramework4v2.Web.Common.SmartTemplate.RenderTemplate(HttpContext.Current.Server.MapPath("~/JS/Main/Tshow.cshtml"), new {  });

        return html;
    }
}