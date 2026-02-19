import { Spin, SpinProps } from "antd"

interface SpinCompProps extends SpinProps {
    [key: string]: any;
}
const SpinComponents = ({...reset}:SpinCompProps) => {
  return (
    <Spin {...reset}/>
  )
}

export default SpinComponents