using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;
using System.Configuration;
using SendMessage;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;
using System.Data.SqlClient;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using SmartFramework4v2.Data.SqlServer;
using System.Security.Cryptography;

namespace Fun
{
    public class Fun
    {

        public bool message(string mobile, string sms)
        {
            GetUrl sendurl = new GetUrl();
            sendurl.SendMessage(mobile, sms);
            return true;
        }

        public string AddCode(string mobile)
        {
            string connString = ConfigurationManager.ConnectionStrings["DzfConnStr"].ConnectionString;
            MySqlConnection conn = new MySqlConnection(connString);
            conn.Open();
            MySqlTransaction trans = conn.BeginTransaction();
            try
            {
                System.Random Random = new System.Random();
                int CODE = Random.Next(1000, 9999);

                string sql = "INSERT INTO tb_b_message (MOBILE,CODE,TIME) values(@MOBILE,@CODE,@TIME)";
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                cmd.Parameters.AddWithValue("@MOBILE", mobile);
                cmd.Parameters.AddWithValue("@CODE", CODE);
                cmd.Parameters.AddWithValue("@TIME", DateTime.Now);
                cmd.ExecuteNonQuery();

                trans.Commit();

                return CODE.ToString();
            }
            catch (Exception ex)
            {
                trans.Rollback();
                throw ex;
            }
            finally
            {
                conn.Close();
                trans.Dispose();
                conn.Dispose();
            }
        }

        public int GetCode(string mobile, string code)
        {
            string connString = ConfigurationManager.ConnectionStrings["DzfConnStr"].ConnectionString;
            MySqlConnection conn = new MySqlConnection(connString);
            conn.Open();
            try
            {
                string sql = "SELECT * FROM tb_b_message WHERE MOBILE = @MOBILE ORDER BY TIME DESC";
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                cmd.Parameters.AddWithValue("@MOBILE", mobile);
                MySqlDataAdapter mda = new MySqlDataAdapter(cmd);
                DataSet myDataSet = new DataSet();
                mda.Fill(myDataSet);
                DataTable dt = myDataSet.Tables[0];
                if (dt.Rows.Count > 0)
                {
                    System.TimeSpan ts = DateTime.Now - Convert.ToDateTime(dt.Rows[0]["TIME"].ToString());
                    double getMinute = ts.TotalMinutes;
                    if (getMinute < 20)
                    {
                        if (code == dt.Rows[0]["CODE"].ToString())
                        {
                            return 0;
                        }
                        else
                        {
                            return 3;
                        }
                    }
                    else
                    {
                        return 2;
                    }
                }
                else
                {
                    return 1;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                conn.Close();
                conn.Dispose();
            }
        }

        public int CheckDatas(string mobile, string Identification)
        {
            string connString = ConfigurationManager.ConnectionStrings["DzfConnStr"].ConnectionString;
            MySqlConnection conn = new MySqlConnection(connString);
            conn.Open();
            try
            {
                string sql = "SELECT * FROM tb_b_application WHERE (Mobile = @Mobile OR IdCard = @IdCard) AND STATUS = 0 ORDER BY ID DESC";
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = sql;
                cmd.Parameters.AddWithValue("@Mobile", mobile);
                cmd.Parameters.AddWithValue("@IdCard", Identification);
                MySqlDataAdapter mda = new MySqlDataAdapter(cmd);
                DataSet myDataSet = new DataSet();
                mda.Fill(myDataSet);
                DataTable dt = myDataSet.Tables[0];
                if (dt.Rows.Count > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                conn.Close();
                conn.Dispose();
            }
        }

        public string ModifyPwd(string mobile, string pwd)
        {
            using (DBConnection dbc = new DBConnection())
            {
                try
                {
                    DataTable dtUser = dbc.ExecuteDataTable("select * from aspnet_Users where UserName=" + dbc.ToSqlValue(mobile));
                    string pws = dtUser.Rows[0]["PasswordSalt"].ToString();
                    string pwf = dtUser.Rows[0]["PasswordFormat"].ToString();
                    if (pwf == "1")
                    {
                        byte[] bytes = Encoding.Unicode.GetBytes(pwd);
                        byte[] src = Convert.FromBase64String(pws);
                        byte[] dst = new byte[src.Length + bytes.Length];
                        byte[] inArray = null;
                        Buffer.BlockCopy(src, 0, dst, 0, src.Length);
                        Buffer.BlockCopy(bytes, 0, dst, src.Length, bytes.Length);
                        inArray = HashAlgorithm.Create("SHA1").ComputeHash(dst);
                        string sqlStr = "update aspnet_Users set Password=" + dbc.ToSqlValue(Convert.ToBase64String(inArray)) + " where  UserName=" + dbc.ToSqlValue(mobile);
                        dbc.ExecuteNonQuery(sqlStr);
                    }
                    else
                    {
                        string sqlStr = "update aspnet_Users set Password=" + dbc.ToSqlValue(pwd) + " where  UserName=" + dbc.ToSqlValue(mobile);
                        dbc.ExecuteNonQuery(sqlStr);
                    }
                    return "";

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
    }
}