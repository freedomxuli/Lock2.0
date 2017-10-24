using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Xml;

/// <summary>
///MenuControl 的摘要说明
/// </summary>
public class MenuControl
{
    //<Tab p='Smart.SystemPrivilege.信息采集_平价商店数据.不符合要求的数据统计表' Name='不符合要求的数据统计表'>approot/r/page/jkpt/BFHYQTable.html</Tab>

    //<Tab p='Smart.SystemPrivilege.考核评分_网络监督考核.显示屏联网考核' Name='显示屏联网考核'>approot/r/page/LhKh/XspShow.html</Tab>

    public static String xmlMenu = @"
        <MainMenu>
        
            <Menu Name='系统设置'>            
                <Item Name='门店管理'>
                   <Tab p='' Name='门店管理'>approot/r/page/Hotel/HotelManage.html</Tab>
                </Item>
               <Item Name='房间管理'>
                   <Tab p='' Name='房间管理'>approot/r/page/Hotel/RoomManage.html</Tab>
                </Item>
               <Item Name='订单管理'>
                   <Tab p='' Name='订单管理'>approot/r/page/Hotel/RoomManage.html</Tab>
                </Item>
               <Item Name='子店管理'>
                   <Tab p='' Name='子店管理'>approot/r/page/Hotel/RoomManage.html</Tab>
                </Item>
            </Menu>
          
        </MainMenu>
    ";




    public static string GenerateMenuByPrivilege()
    {
        System.Xml.XmlDocument doc = new System.Xml.XmlDocument();
        doc.LoadXml(xmlMenu);
        StringBuilder sb = new StringBuilder();
        int num = 0;

        var cu = SystemUser.CurrentUser;

        sb.Append("[");
        foreach (System.Xml.XmlElement MenuEL in doc.SelectNodes("/MainMenu/Menu"))
        {
            if (num > 0)
            {
                sb.Append(",");
            }
            num++;

            string title = MenuEL.GetAttribute("Name").ToString().Trim();



            string lis = "";
            foreach (System.Xml.XmlElement ItemEl in MenuEL.SelectNodes("Item"))
            {
                string secname = ItemEl.GetAttribute("Name");
                string msg = "";
                foreach (XmlElement TabEl in ItemEl.SelectNodes("Tab"))
                {
                    string p = TabEl.GetAttribute("p").ToString().Trim();
                    if (cu.CheckPrivilegeString(p))
                    {
                        string pantitle = TabEl.GetAttribute("Name").ToString().Trim();
                        string src = TabEl.InnerText;
                        if (msg == "")
                        {
                            msg += pantitle + "," + src;
                        }
                        else
                        {
                            msg += "|" + pantitle + "," + src;
                        }
                    }
                }
                if (msg != "")
                {
                    lis += "+ '<li class=\"fore\"><a class=\"MenuItem\" href=\"page/TabMenu.html?msg=" + msg + "\" target=\"mainframe\"><img height=16 width=16 align=\"absmiddle\" style=\"border:0\" src=\"../CSS/images/application.png\" />　" + secname + "</a></li>'";

                }
            }

            if (lis != "")
            {
                sb.Append("{");
                sb.Append("xtype: 'panel',");
                sb.Append("collapsed: false,");
                sb.Append("iconCls: 'cf',");
                sb.Append("title: '" + title + "',");
                sb.Append("html: '<ul class=\"MenuHolder\">'");
                sb.Append(lis);
                sb.Append("+ '</ul>'");
                sb.Append("}");
            }
        }
        sb.Append("]");
        return sb.ToString();
    }
}
