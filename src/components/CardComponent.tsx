import { Card, CardProps } from 'antd'

interface CardCompProps extends CardProps {
    [key: string]: any;
}
const CardComponent = ({children, ...reset}:CardCompProps) => {
  return (
    <Card  {...reset} >
        {children}
    </Card>
  )
}

export default CardComponent