using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Method
{
    /// <summary>
    /// Register 的摘要说明
    /// </summary>
    public class Register : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            if (!string.IsNullOrEmpty(context.Request.Form["Method"]))
            {

                Fun.Fun med = new Fun.Fun();
                if (context.Request.Form["Method"] == "message")
                {
                    context.Response.Write(med.message(context.Request.Form["mobile"], context.Request.Form["sms"]));
                }
                else if (context.Request.Form["Method"] == "AddCode")
                {
                    context.Response.Write(med.AddCode(context.Request.Form["mobile"]));
                }
                else if (context.Request.Form["Method"] == "GetCode")
                {
                    context.Response.Write(med.GetCode(context.Request.Form["mobile"], context.Request.Form["code"]));
                }
                else if (context.Request.Form["Method"] == "CheckDatas")
                {
                    context.Response.Write(med.CheckDatas(context.Request.Form["mobile"], context.Request.Form["Identification"]));
                }
                else if (context.Request.Form["Method"] == "ModifyPwd")
                {
                    context.Response.Write(med.ModifyPwd(context.Request.Form["mobile"], context.Request.Form["pw"]));
                }

            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}