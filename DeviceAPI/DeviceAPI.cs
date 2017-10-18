using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using System.Net;
using System.IO;

namespace DeviceAPI
{
    public class DeviceAPI
    {
        private static string ServiceUrl = "http://39.108.61.89:1500/Service?";
        private static string StrTemp = "type={0}&data={1}";

        public static HttpWebRequest GetWebRequest(string url, string method)
        {
            HttpWebRequest request = null;
            if (url.Contains("https"))
            {
                request = (HttpWebRequest)WebRequest.CreateDefault(new Uri(url));
            }
            else
            {
                request = (HttpWebRequest)WebRequest.Create(url);
            }
            request.Method = method;
            request.KeepAlive = true;
            request.UserAgent = "xueling";
            request.Timeout = 5000;
            return request;
        }

        public static string GetResponseAsString(HttpWebResponse rsp, Encoding encoding)
        {
            Stream responseStream = null;
            StreamReader reader = null;
            string str;
            try
            {
                responseStream = rsp.GetResponseStream();
                reader = new StreamReader(responseStream, encoding);
                str = reader.ReadToEnd();
            }
            finally
            {
                if (reader != null)
                {
                    reader.Close();
                }
                if (responseStream != null)
                {
                    responseStream.Close();
                }
                if (rsp != null)
                {
                    rsp.Close();
                }
            }
            return str;
        }

        public static string DoPost(string url, string value)
        {

            byte[] bytes = null;
            bytes = Encoding.UTF8.GetBytes(value);
            return PostData(url, bytes);
        }

        public static string PostData(string url, byte[] bytes)
        {
            HttpWebRequest webRequest = GetWebRequest(url, "POST");
            webRequest.ContentType = "application/x-www-form-urlencoded;charset=utf-8";
            webRequest.Timeout = 10000;
            Stream requestStream = webRequest.GetRequestStream();

            requestStream.Write(bytes, 0, bytes.Length);
            requestStream.Close();
            HttpWebResponse rsp = (HttpWebResponse)webRequest.GetResponse();
            return GetResponseAsString(rsp, Encoding.UTF8);
        }

        //获取指定房间入住状态
        public static string CheckLiveStatus(string homeno, string authno = "")
        {
            string data = "{HomeNo:\"" + homeno + "\",AuthoriOrderNo:\"" + authno + "\"}";
            string linkurl = string.Format(StrTemp, "checkin", data);
            string strreturn = DoPost(ServiceUrl + linkurl, "");
            return strreturn;
        }

        //获取指定房间设备采集的信息房屋管理服务器查询
        public static string GetCollectDeviceInfo(string homeno, string EquipmentId, string EquipmentAuthoriCode)
        {
            string data = "{HomeNo:\"" + homeno + "\",EquipmentId:\"" + EquipmentId + "\",EquipmentAuthoriCode:\"" + EquipmentAuthoriCode + "\"}";
            string linkurl = string.Format(StrTemp, "collection", data);
            string strreturn = DoPost(ServiceUrl + linkurl, "");
            return strreturn;
        }
    }
}
