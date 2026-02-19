// import { useForm } from "react-hook-form"
// import { Card, Input, InputNumber } from "antd"
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import FormComponent from "../../components/FormComponent";
// import { useNavigate, useParams } from "react-router-dom";

// import "./Customers.css"
// import React, { useEffect } from "react";
// import PhoneInputComponent from "../../components/PhoneInputComponent";
// import { useMutation, useQuery } from "react-query";
// import { toast } from "react-toastify";
const AddCustomerPage :React.FC = () => {
  // const  navigate = useNavigate();
  // const clientSchema = yup.object().shape({
  //   name: yup.string().required("اسم العميل مطلوب"),
  //   code: yup.number().required("كود العميل مطلوب"),
  //   phoneNumber:yup.string().required('رقم الهاتف مطلوب'),
  // });
  // const {
  //   handleSubmit,
  //   formState: { errors: errors },
  //   setValue,
  //   reset,
  //   control,
  // } = useForm({
  //   resolver: yupResolver(clientSchema),
  // });
  // const params = useParams()
  // const {data} = useQuery('clientCode',  { queryFn:getClientCodeApi , enabled: !params?.id});
  //  const {data:client} = useQuery('client',  { queryFn:()=>getOneClientApi(params?.id), enabled:!!params?.id});
   
  // const {isLoading:loadingAdd , mutate:addClient} = useMutation(addClientApi,{
  //   onSuccess(data, _variables, _context) {
  //     console.log(data);
  //     toast.success(data?.message)
  //     navigate("/customers");
  //     },
  //     onError(error, _variables, _context) {
  //       toast.error(!error)
  //     },
  // })

  // const {isLoading:loadingEdit , mutate:updateClient} = useMutation({
  //   mutationFn:(body) => updateClientApi(params?.id ,body),
  //   onSuccess(data, _variables, _context) {
  //     console.log(data);
  //     toast.success(data?.message)
  //     navigate("/customers");
  //     },
  //     onError(error, _variables, _context) {
  //       toast.error(!error)
  //     },
  // })

  // useEffect(() => {
  // console.log(data);
  // if (!params?.id) {
  //   setValue('code',data?.clientCode);
  // } else {
  //   console.log(params);
  //   console.log(client);
  // setValue('code',client?.code)
  // setValue('name',client?.name)
  // setValue('phoneNumber',client?.phoneNumber)
  // }
  
  
  // }, [data , client])
  // const onSubmit = (data:any) => {
  //   console.log(data);
  //   if (params?.id) {
  //     updateClient(data);
  //   } else {
  //     addClient(data);
  //   }
     
  // }

  // const onCancel = () =>{
  //  reset();
  //   navigate("/customers");
  // }

  // const inputsArr = [
  //   {
  //     label: "كود العميل",
  //     name: "code",
  //     render: (field:any)=> <InputNumber status={errors.code&&'error'} readOnly className=" w-full" size="large" placeholder="كود العميل" {...field}/>,
  //     xs:12,
  //     lg:12
  //   },
  //   {
  //     label: "اسم العميل",
  //     name: "name",
  //     render: (field:any)=> <Input status={errors.name&&'error'}  autoFocus className="" size="large" placeholder="اسم العميل " {...field}/>,
  //     xs:12,
  //     lg:12
  //   },
  //   {
  //     label: "رقم الهاتف",
  //     name: "phoneNumber",
  //     render: (field:any)=> <PhoneInputComponent field={field} errors={errors}/>,
  //     xs:12,
  //     lg:12
  //   }
  // ]
  return (
    // <Card title='اضافة عميل'>
    //   <FormComponent onCancel={onCancel} okText={params?.id?"تعديل":"اضافة"} cancelText="الغاء" control={control} errors={errors} onSubmit={handleSubmit(onSubmit)} inputsArr={inputsArr} loading={params?.id?loadingEdit:loadingAdd}/>
    // </Card>
    <></>
  )
}

export default AddCustomerPage