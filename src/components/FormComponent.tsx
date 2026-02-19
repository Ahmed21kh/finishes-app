/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Flex, Row } from "antd";
import React, { useEffect } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FormProps,
} from "react-hook-form";
import ButtonComponent from "./ButtonComponent";
import { DeleteFilled } from "@ant-design/icons";

interface FormCompProps extends FormProps<any> {
  inputsArr: any[];
  onSubmit: React.FormEventHandler<HTMLFormElement> | any;
  control: Control<any>;
  errors?: FieldErrors<any> | any;
  onCancel?: any;
  okText?: string;
  loading?:boolean
  cancelText?: string;
  onAdd?: any;
  hideButtons?: boolean;
  [key: string]: any;
}
const FormComponent = ({
  inputsArr,
  onCancel,
  control,
  onSubmit,
  errors,
  okText,
  cancelText,
  loading= false,
  hideButtons,
}: FormCompProps) => {
  useEffect(() => {
    console.log(errors);
    // console.log(errors['items']);
    
  }, [errors])

  const getErrorMessage = (name:any , childName:any , index:number) => {
    if (errors && errors![name]) {
      if (errors![name]![index]) {
        return errors![name]![index]![childName]?.message;
      }
      return null;
    }
    return null;
  }
  return (
    <form dir="rtl" onSubmit={onSubmit}>
      <Row dir="rtl" gutter={[24, 24]}>
        {inputsArr.map((data, i) => (
          data?.isArray ? (
            <Col key={i} dir="rtl" xs={data.xs||24} lg={data.lg || 24} order={data.order} className={`${data.className}`}>
              <Flex justify={'space-between'}>
               <p className=" text-lg pb-1 mb-2 w-full">{data.label}</p>
              </Flex>
             { data?.fields.map((field:any, index:any) => (
            <Row dir="rtl" gutter={[24, 24]} key={field?.id} align={'middle'} className=" mb-3">
              {data?.children?.map((child:any, i:any) =>
              <Col key={i} dir="rtl" xs={child.xs||24} lg={child.lg || 24} order={child.order}>
              {/* <p className=" text-md pb-1 mb-1">{child.label}</p> */}
              <Controller
                name={`${data?.name}.${index}.${child.name}`}
                control={control}
                render={({ field }) => child.render(field,index)}
              />
              <p style={{ color: "red" }} className=" absolute ">
                {/* {JSON.stringify(errors)} */}
                {errors && errors![`${data?.name}`] ? getErrorMessage(data?.name,child.name,index) : null}
              </p>
            </Col>
              
              )}
            <Col>
            <ButtonComponent type="primary" danger  icon={<DeleteFilled/>} onClick={()=>data?.onRemove(index)}/>
            </Col>
            </Row>
              ))}
            </Col>

          )
          :
          <Col key={i} dir="rtl" xs={data.xs||24} lg={data.lg || 24} order={data.order}>
            <p className=" text-md pb-1 mb-1">{data.label}</p>
            <Controller
              name={data.name}
              control={control}
              render={({ field }) => data.render(field)}
            />
            <p style={{ color: "red" }} className=" absolute ">
              {errors ? errors[data.name]?.message : null}
            </p>
          </Col>
        ))}
       {!hideButtons && 
        <Col dir="rtl" xs={24} className=" flex justify-end items-center gap-3 my-5">
          <ButtonComponent htmlType="submit" text={okText} className=" text-lg" type="primary" loading={loading}/>
          <ButtonComponent text={cancelText} className=" text-lg" onClick={onCancel} />
        </Col>
       }
      </Row>
    </form>
  );
};

export default FormComponent;
