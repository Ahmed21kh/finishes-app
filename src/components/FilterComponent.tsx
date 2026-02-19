/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import React from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form';
interface FilterCompProps {
  inputsArr: any[];
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  control: Control<any>;
  errors: FieldErrors<any> | any;
  onCancel?: any;
  okText?: string;
  loading?:boolean
  cancelText?: string;
  clear?:React.FormEventHandler<HTMLFormElement> | any;
  [key: string]: any;
}
const FilterComponent = ({
    inputsArr,
    control,
    onSubmit,
    errors,
    okText,
    cancelText,
    clear
  }: FilterCompProps) => {
  return (
    <form dir="rtl" className=' w-full' onSubmit={onSubmit}>
    <Row dir="rtl" className='w-full' gutter={[24, 24]}>
      {inputsArr.map((data, i) => (
        <Col key={i} dir="rtl" xs={data.xs||24} lg={data.lg || 24} order={data.order}>
          <Controller
            name={data.name}
            control={control}
            render={({ field }) => data.render(field)}
          />
          <p style={{ color: "red" }} className=" absolute -bottom-6">
            {errors ? errors[data.name]?.message : null}
          </p>
        </Col>
      ))}
      <Col className=' flex gap-3 items-center'>
       <Button htmlType='submit' type='primary' title={okText} icon={<SearchOutlined/>} ></Button>
       <Button htmlType='button' type='default' title={cancelText} onClick={clear} icon={<DeleteOutlined/>} ></Button>
      </Col>
    </Row>
  </form>
  )
}

export default FilterComponent