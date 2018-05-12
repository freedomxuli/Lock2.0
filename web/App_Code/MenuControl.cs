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
            <Menu Name='订单管理'>            
               <Item Name='待确认'>
                   <Tab p='' Name='待确认'>approot/r/page/AuthorizeOrder/AuthorizeOrderList.html?zt=1</Tab>
                </Item>
                <Item Name='待审核'>
                   <Tab p='' Name='待审核'>approot/r/page/AuthorizeOrder/AuthorizeOrderList.html?zt=2</Tab>
                </Item>
                 <Item Name='待结算'>
                   <Tab p='' Name='待结算'>approot/r/page/AuthorizeOrder/AuthorizeOrderList.html?zt=3</Tab>
                </Item>
                
                <Item Name='所有订单'>
                   <Tab p='' Name='所有订单'>approot/r/page/AuthorizeOrder/AuthorizeOrderList.html?zt=0</Tab>
                </Item>
            </Menu>
            <Menu Name='任务管理'> 
                <Item Name='待确认'>
                   <Tab p='' Name='待确认'>approot/r/page/System/TaskList.html?zt=1</Tab>
                </Item>
                 <Item Name='处理中'>
                   <Tab p='' Name='处理中'>approot/r/page/System/TaskList.html?zt=2</Tab>
                </Item>
                 <Item Name='所有任务'>
                   <Tab p='' Name='所有任务'>approot/r/page/System/TaskList.html?zt=0</Tab>
                </Item>
            </Menu>
             <Menu Name='发票管理'> 
                <Item Name='待确认'>
                   <Tab p='' Name='待确认'>approot/r/page/System/InvoiceList.html?zt=2</Tab>
                </Item>
                 <Item Name='所有发票'>
                   <Tab p='' Name='所有发票'>approot/r/page/System/InvoiceList.html?zt=0</Tab>
                </Item>
            </Menu>
            <Menu Name='评价管理'> 
                 <Item Name='待回复'>
                   <Tab p='' Name='待回复'>approot/r/page/System/JudgeList.html</Tab>               
                </Item>
                 <Item Name='已回复'>
                   <Tab p='' Name='已回复'>approot/r/page/System/JudgeList2.html?zt=2</Tab>
                </Item>
                <Item Name='好评'>
                   <Tab p='' Name='好评'>approot/r/page/System/JudgeList2.html?zt=3</Tab>
                </Item>
                <Item Name='中评'>
                   <Tab p='' Name='中评'>approot/r/page/System/JudgeList2.html?zt=4</Tab>
                </Item>
                <Item Name='差评'>
                   <Tab p='' Name='差评'>approot/r/page/System/JudgeList2.html?zt=5</Tab>
                </Item>
            </Menu>
            <Menu Name='门店管理员'> 
                 <Item Name='门店管理员'>
                   <Tab p='' Name='门店管理员'>approot/r/page/System/ManagerList.html</Tab>
                </Item>
            </Menu>
            <Menu Name='财务管理'> 
                 <Item Name='财务查看'>
                   <Tab p='' Name='财务查看'>approot/r/page/Finance/FinanceList.html</Tab>
                 </Item>
                 <Item Name='账单确认'>
                   <Tab p='' Name='账单确认'>approot/r/page/Finance/FinanceConfirm.html</Tab>
                 </Item>
                 <Item Name='新增提现'>
                   <Tab p='' Name='新增提现'>approot/r/page/Finance/AddFinance.html</Tab>
                 </Item>
                 <Item Name='提现待处理'>
                   <Tab p='' Name='提现待处理'>approot/r/page/Finance/FinanceHandler.html</Tab>
                 </Item>
                 <Item Name='提现已完成'>
                   <Tab p='' Name='提现已完成'>approot/r/page/Finance/FinanceEnd.html</Tab>
                 </Item>
            </Menu>
            <Menu Name='系统管理'>            
                <Item Name='门店管理'>
                   <Tab p='' Name='已上线'>approot/r/page/Hotel/HotelManage.html</Tab>
                   <Tab p='' Name='待上线'>approot/r/page/Hotel/HotelApply.html</Tab>
                   <Tab p='' Name='已下线'>approot/r/page/Hotel/HotelOffline.html</Tab>
                </Item>
               <Item Name='房间管理'>
                   <Tab p='' Name='房间管理'>approot/r/page/Hotel/RoomManage.html</Tab>
                </Item>
             
 
                
               <Item Name='用户管理'>
                   <Tab p='' Name='用户管理'>approot/r/page/System/TenantList.html</Tab>
                </Item>
                <Item Name='字典管理'>
                   <Tab p='' Name='字典管理'>approot/r/page/Dictionary/zdb.html</Tab>
                   <Tab p='' Name='字典类型管理'>approot/r/page/Dictionary/zdblx.html</Tab>                 
                </Item>
               <Item Name='账户管理'>
                   <Tab p='' Name='账户管理'>approot/r/page/System/PassWordGL.html</Tab>
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
                    string RoleName = Task.TaskNum.GetRoleName();
                    if (RoleName.Equals("房东"))
                    {
                        //if (msg != "字典管理,approot/r/page/Dictionary/zdb.html|字典类型管理,approot/r/page/Dictionary/zdblx.html")
                        //{
                        string numHtml = "";
                        int TaskNum = Task.TaskNum.GetTaskNum(msg);
                        if (TaskNum > 0)
                        {
                            numHtml = "<font style=\"color:red;font-size:13px;font-weight:bold\">+" + TaskNum + "</font>";
                        }

                        lis += "+ '<li class=\"fore\"><a class=\"MenuItem\" href=\"page/TabMenu.html?msg=" + msg + "\" target=\"mainframe\"><img height=16 width=16 align=\"absmiddle\" style=\"border:0\" src=\"../CSS/images/application.png\" />　" + secname + numHtml + "</a></li>'";
                        // }
                    }
                    else if (RoleName.Equals("门店管理员"))
                    {
                        if (msg != "字典管理,approot/r/page/Dictionary/zdb.html|字典类型管理,approot/r/page/Dictionary/zdblx.html" && msg != "已上线,approot/r/page/Hotel/HotelManage.html|待上线,approot/r/page/Hotel/HotelApply.html")
                        {
                            string numHtml = "";
                            int TaskNum = Task.TaskNum.GetTaskNum(msg);
                            if (TaskNum > 0)
                            {
                                numHtml = "<font style=\"color:red;font-size:13px;font-weight:bold\">+" + TaskNum + "</font>";
                            }
                            lis += "+ '<li class=\"fore\"><a class=\"MenuItem\" href=\"page/TabMenu.html?msg=" + msg + "\" target=\"mainframe\"><img height=16 width=16 align=\"absmiddle\" style=\"border:0\" src=\"../CSS/images/application.png\" />　" + secname + numHtml + "</a></li>'";
                        }
                    }
                    else if (RoleName.Equals("SystemAdministrator"))
                    {
                        if (msg == "字典管理,approot/r/page/Dictionary/zdb.html|字典类型管理,approot/r/page/Dictionary/zdblx.html" || msg == "账户管理,approot/r/page/System/PassWordGL.html")
                        {
                            string numHtml = "";
                            int TaskNum = Task.TaskNum.GetTaskNum(msg);
                            if (TaskNum > 0)
                            {
                                numHtml = "<font style=\"color:red;font-size:13px;font-weight:bold\">+" + TaskNum + "</font>";
                            }
                            lis += "+ '<li class=\"fore\"><a class=\"MenuItem\" href=\"page/TabMenu.html?msg=" + msg + "\" target=\"mainframe\"><img height=16 width=16 align=\"absmiddle\" style=\"border:0\" src=\"../CSS/images/application.png\" />　" + secname + numHtml + "</a></li>'";
                        }
                    }

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
