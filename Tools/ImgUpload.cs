using System;
using System.Web;
using System.IO;

namespace Tool
{

    public class ImgUpload : IHttpHandler
    {
        string action = "", filename = "", str = "", temsouce, newsource;
        public int imgflag = 0;
        public bool flag = false;
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            try
            {
                if (context.Request["action"] != null)
                {
                    string hz = "";
                    action = context.Request["action"].ToString();
                    string savepath = context.Request["savepath"].ToString();
                    string path = context.Server.MapPath(savepath);
                    if(!Directory.Exists(path))
                        Directory.CreateDirectory(path);
                    switch (action)
                    { 
                        case "fileupload":
                            HttpFileCollection files = context.Request.Files;
                            foreach (string key in files)
                            {
                                HttpPostedFile file = files[key];
                                hz = Path.GetExtension(file.FileName);
                                string temp=DateTime.Now.ToString("yyyyMMddHHmmssffff");
                                temsouce = temp + "_" + hz;
                                newsource = temp + hz;
                                file.SaveAs(path + temsouce);
                                flag = ImageHandle.GetPicByCutWeight(path + temsouce, path + newsource, 50);
                                if (flag && File.Exists(path + newsource))
                                {
                                    if (context.Request["imgwidth"] != null && context.Request["imgheight"] != null)
                                    {
                                        int width = Int32.Parse(context.Request["imgwidth"].ToString());
                                        int height = Int32.Parse(context.Request["imgheight"].ToString());
                                        if (width > 0 && height > 0)
                                        {
                                            flag = ImageHandle.MakeThumbnail(path + newsource, path + temsouce, width, height, "Cut");
                                            if (flag && File.Exists(path + temsouce))
                                            {
                                                FileInfo f = new FileInfo(path + temsouce);
                                                DelSource(path + newsource);
                                                f.MoveTo(path + newsource);
                                            }
                                        }
                                        else
                                            DelSource(path + temsouce);
                                    }
                                    else
                                        DelSource(path + temsouce);
                                    str = savepath + newsource;
                                }
                                else
                                    str = "";
                            }
                            break;
                        case "filedelete":
                            filename = context.Request["filename"].ToString();
                            string namepath = context.Server.MapPath(filename);
                            if (File.Exists(namepath))
                                File.Delete(namepath);
                            str = "true";
                            break;
                    }
                   
                }
            }
            catch(Exception err)
            {   
                str="";
            }
             context.Response.Write(str);
        }

        public void DelSource(string file)
        {
            try {if (File.Exists(file)) File.Delete(file); }catch(Exception err){};
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
