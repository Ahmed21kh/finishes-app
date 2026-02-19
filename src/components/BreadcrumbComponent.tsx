/* eslint-disable @typescript-eslint/no-explicit-any */

import { Breadcrumb } from "antd"
import { BreadcrumbItemType, BreadcrumbSeparatorType, ItemType as Item } from "antd/es/breadcrumb/Breadcrumb";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { HomeFilled } from "@ant-design/icons";

const BreadcrumbComponent = () => {
    const { location } = useContext(AppContext);
    const itemObj:any = {
        'invoices':'فواتيري',
        'customers':'العملاء',
        'previous-works':'الاعمال السابقة',
        'categories':'الاقسام',
        'add-invoice':'اضافة دفعة',
        'edit-invoice':'تعديل الدفعة',
        'add-category':'اضافة قسم',
        'add-customer':'اضافة عميل',
        'edit-customer':'تعديل عميل',
        'account-statement':'كشف الحساب',
        'add-account':'اضافة كشف الحساب',
        'edit-account':'تعديل كشف الحساب',
        'add-apartment':'اضافة شقة',
        'edit-apartment':'تعديل شقة',
        'apartment':'الشقة',
        'payments-and-patches':'المصروفات و المدفوعات'
    }
    
    const routes:Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[] =[{path:'/',title:<span className="flex items-center gap-2"> <HomeFilled />{'الرئيسية'}</span>}].concat(location.pathname.trim().split('/').map((route:any)=>{ 
      const decodedRoute = decodeURIComponent(route);
      return route && {
        path:`/${decodedRoute}`,
        title:itemObj[route]?itemObj[route]: route
    }})).filter(item => item)
    console.log({routes});
    
    const  itemRender =(currentRoute:Item, _params:any, items:Item[], paths:string[]) => {
        console.log({items});
        console.log({paths});
        console.log({currentRoute});
        const isLast = currentRoute?.path === items[items.length - 1]?.path;
        return isLast || currentRoute?.path == '/edit-account' ? (
          <span>{currentRoute.title}</span>
        ) : (
          <Link to={`${paths.join("/")}`} >{currentRoute.title}</Link>
        );
      }
  return (
    <Breadcrumb
    className=" pt-4 pb-12 "
    itemRender={itemRender}
    items={routes}
  />
  )
}

export default BreadcrumbComponent