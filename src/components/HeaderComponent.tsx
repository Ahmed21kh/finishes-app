import { Button, ColorPicker, Layout } from "antd";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { MenuFoldOutlined, MenuUnfoldOutlined, MoonFilled, SunFilled } from "@ant-design/icons";

const { Header } = Layout;
const HeaderComponent = () => {
    const { collapsed , setCollapsed , setThemeMode , setprimaryColor , primaryColor , themeMode } = useContext(AppContext);
    const handleChangeDarkMode = (theme:string) => {
      setThemeMode(theme)
      localStorage.setItem("theme", theme)
    };
    const handleChangeColor = (color:string) => {
      setprimaryColor(color)
      localStorage.setItem("primaryColor", color)
    };
  return (
    <Header style={{ padding: 0}} className=" border-b-2 border-solid border-[#6969691f]">
    <div className=" flex items-center justify-between pl-4">
    <Button
      type="text"
      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={() => setCollapsed(!collapsed)}
      style={{
        fontSize: '16px',
        width: 64,
        height: 64,
      }}
    />
    <div className=" flex gap-3 items-center ">
    <ColorPicker size="small" value={primaryColor} onChange={(_,color)=>handleChangeColor(color)}/>

     {themeMode == 'light'? <MoonFilled className=" text-lg cursor-pointer" onClick={()=>handleChangeDarkMode('dark')}/> : <SunFilled className=" text-lg cursor-pointer" onClick={()=>handleChangeDarkMode('light')}/>}
    </div>
    </div>
  </Header>
  )
}

export default HeaderComponent