/* eslint-disable prefer-const */
import Sider from "antd/es/layout/Sider";
import LogoComponent from "./LogoComponent";
import { Menu } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import {
  ReconciliationOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export interface MenuInfo {
  key: string;
}
export const items: ItemType<MenuItemType>[] = [
  {
    key: "/account-statement/add-account",
    icon: <DollarCircleOutlined className=" !text-lg" />,
    label: " فتح كشف حساب",
  },
  {
    key: "/account-statement",
    icon: <ReconciliationOutlined className=" !text-lg" />,
    label: "كشف حساب العملاء",
  },
  // {
  //   key: "/categories",
  //   icon: <ProductOutlined />,
  //   label: "الاقسام",
  // },
  // {
  //   key: "/previous-works",
  //   icon: <ShopOutlined />,
  //   label: "سابقة الاعمال",
  // },
];
const SideBarComponent = () => {
  const { collapsed, location , themeMode , primaryColor} = useContext(AppContext);
  const [selectedRoute, setSelectedRoute] = useState(location.pathname);
  const navigate = useNavigate();

  const handleNavigate = (e: MenuInfo) => {
    console.log(e);
    navigate(e.key); 
    setSelectedRoute(e.key);
  };
  useEffect(() => {
    console.log(location.pathname);
    let firstItem = `${location.pathname}`
    console.log(firstItem);
    setSelectedRoute(firstItem);
  }, [location.pathname]);

  return (
    <Sider
      trigger={null}
      width={230}
      collapsible
      collapsed={collapsed}
      className=" border-l-2 border-solid border-[#fdfdfd1f]"
    >
      <div className={` h-auto w-full mb-4 ${themeMode =='light'? ' bg-gray-300':' bg-zinc-700'} border-solid border-b-2`} style={{borderColor:primaryColor}}  >
        <LogoComponent />
      </div>
      <Menu
        mode="inline"
        className=" text-[16px]"
        defaultSelectedKeys={[selectedRoute]}
        selectedKeys={[selectedRoute]}
        items={items}

        onClick={(e) => handleNavigate(e)}
      />  
    </Sider>
  );
};

export default SideBarComponent;
