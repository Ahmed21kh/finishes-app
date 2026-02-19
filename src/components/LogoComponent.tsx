import { HomeFilled } from "@ant-design/icons"
import { Typography } from "antd"
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const { Title} = Typography;
const LogoComponent = () => {
    const { collapsed } = useContext(AppContext)
  return (
    <div className=" flex gap-3 items-top py-3 pb-4 flex-nowrap justify-center  px-4">
        <Title level={2} className="!mb-0"><HomeFilled/></Title>
        <div className={`flex flex-col items-center justify-start`}>
        {!collapsed && <Title level={3} className=" !mt-0 !mb-0 text-nowrap !font-bold">شـــــــطب</Title>}
        {!collapsed &&<Title level={5} className=" !my-0"> م / حاتم الوكيل</Title>}
        </div>
    </div>
  )
}

export default LogoComponent