/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm } from "react-hook-form"
import { Card, Input, InputNumber } from "antd"
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormComponent from "../../components/FormComponent";
import {  useNavigate, useParams } from "react-router-dom";
import {useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { addapartmentApi, getapartmentCodeApi, getOneapartmentApi, updateapartmentApi } from "../../apis/ApartmentsApi";
import { toast } from "react-toastify";
const AddEditApartment = () => {
    const mainRoute = `/account-statement`
    const  navigate = useNavigate();
    const apartmentSchema = yup.object().shape({
      address: yup.string().required("اسم الشقة مطلوب"),
      code: yup.number().required("كود الشقة مطلوب"),
    });
    const {
      handleSubmit,
      formState: { errors: errors },
      setValue,
      reset,
      control,
    } = useForm({
      resolver: yupResolver(apartmentSchema),
    });
    const {apartmentId , id} = useParams()
    const {data} = useQuery('apartmentCode',  { queryFn:() => getapartmentCodeApi({clientId:id}) , enabled: !!id && !apartmentId});
     const {data:apartment} = useQuery('apartment',  { queryFn:()=>getOneapartmentApi(apartmentId), enabled:!!apartmentId});
     
    const {isLoading:loadingAdd , mutate:addapartment} = useMutation(addapartmentApi,{
      onSuccess(data, _variables, _context) {
        console.log(data);
        toast.success(data?.message)
        navigate(`${mainRoute}/${id}`);
        },
        onError(error, _variables, _context) {
          toast.error(!error)
        },
    })
  
    const {isLoading:loadingEdit , mutate:updateapartment} = useMutation({
      mutationFn:(body) => updateapartmentApi(apartmentId ,body),
      onSuccess(data, _variables, _context) {
        console.log(data);
        toast.success(data?.message)
        navigate(`${mainRoute}/${id}`);
        },
        onError(error, _variables, _context) {
          toast.error(!error)
        },
    })
  
    useEffect(() => {
      console.log(data);
      if (!apartmentId && data) {
        setValue('code',data?.apartmentCode);
      } else if (apartmentId && apartment) {
        console.log(apartmentId);
        console.log(apartment);
      setValue('code',apartment?.code)
      setValue('address',apartment?.address)
      }

    }, [data , apartment])
    const onSubmit = (data:any) => {
      console.log(data);
      const payload = {...data, client:id}
      if (apartmentId) {
        updateapartment(payload);
      } else {
        addapartment(payload);
      }
       
    }
  
    const onCancel = () =>{
     reset();
      navigate(`${mainRoute}/${id}`);
    }
  
    const inputsArr = [
      {
        label: "كود الشقة",
        name: "code",
        render: (field:any)=> <InputNumber status={errors.code&&'error'} readOnly className=" w-full" size="large" placeholder="كود الشقة" {...field}/>,
        xs:12,
        lg:12
      },
      {
        label: "عنوان الشقة",
        name: "address",
        render: (field:any)=> <Input status={errors.address&&'error'}  autoFocus className="" size="large" placeholder="عنوان الشقة " {...field}/>,
        xs:12,
        lg:12
      }
    ]
    return (
      <Card title={apartmentId?'تعديل شقة':'اضافة شقة'}>
        <FormComponent onCancel={onCancel} okText={apartmentId?"تعديل":"اضافة"} cancelText="الغاء" control={control} errors={errors} onSubmit={handleSubmit(onSubmit)} inputsArr={inputsArr} loading={apartmentId?loadingEdit:loadingAdd}/>
      </Card>
    )
}

export default AddEditApartment