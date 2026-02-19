/* eslint-disable @typescript-eslint/no-explicit-any */
import { Empty, EmptyProps } from 'antd'

interface EmptyCompProps extends EmptyProps {
    [key: string]: any;
}
const EmptyComponent = ({...reset}:EmptyCompProps) => {
  return (
    <Empty {...reset}/>
  )
}

export default EmptyComponent