/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useFieldArray, useForm } from "react-hook-form"
import { Card, DatePicker, Flex, Input, InputNumber } from "antd"
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormComponent from "../../components/FormComponent";
import {useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { addinvoiceApi, getinvoiceCodeApi, getOneinvoiceApi, updateinvoiceApi } from "../../apis/InvoicesApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import ButtonComponent from "../../components/ButtonComponent";
import { PlusOutlined } from "@ant-design/icons";

const AddEditInvocePage = () => {
    const  navigate = useNavigate();
    const apartmentSchema = yup.object().shape({
      payedPatch: yup.string().required("مبلغ الدفعة مطلوب"),
      code: yup.number().required("كود الدفعة مطلوب"),
      date: yup.date().required("تاريخ الدفعة مطلوب"),
      notes:yup.string().notRequired(),
      items: yup.array( 
        yup.object().shape({
        code: yup.number().typeError('كود الصنف مطلوب او القيمة غير صححيحة').required('كود الصنف مطلوب'),
        name: yup.string().required('اسم الصنف مطلوب'),
        price: yup.string().typeError('سعر الصنف مطلوب او القيمة غير صححيحة').required('سعر الصنف مطلوب'),
        itemNotes: yup.string().notRequired(),
        date: yup.date().required('التاريخ مطلوب')
      })).notRequired()
    });
    const {
      handleSubmit,
      formState: { errors: errors },
      setValue,
      reset,
      control,
    } = useForm({
      resolver: yupResolver(apartmentSchema),
      defaultValues:{
        // items:[
        //   {
        //     name:'',
        //     code:1,
        //     itemNotes:'',
        //     date:dayjs().toDate()
        //   }
        // ]
      }
    });
    const { fields, append, remove } = useFieldArray({
      control,
      name: "items",
    });
    const {apartmentId , id , invoiceId} = useParams()
    const {data} = useQuery('invoiceCode',  { queryFn:()=>getinvoiceCodeApi({client: id}) , enabled: !!id && !invoiceId});
     const {data:invoice} = useQuery('invoice',  { queryFn:()=>getOneinvoiceApi(invoiceId), enabled:!!invoiceId});
     
    const {isLoading:loadingAdd , mutate:addinvoice} = useMutation(addinvoiceApi,{
      onSuccess(data, _variables, _context) {
        console.log(data);
        toast.success(data?.message)
              navigate(-1);
        },
        onError(error, _variables, _context) {
          toast.error(!error)
        },
    })
  
    const {isLoading:loadingEdit , mutate:updateinvoice} = useMutation({
      mutationFn:(body) => updateinvoiceApi(invoiceId ,body),
      onSuccess(data, _variables, _context) {
        console.log(data);
        toast.success(data?.message)
              navigate(-1);
        },
        onError(error, _variables, _context) {
          toast.error(!error)
        },
    })
  
    useEffect(() => {
    console.log(data);

    if (!invoiceId) {
      setValue('code',data?.invoiceCode);
      setValue('date', new Date() )
    } else {
      console.log(invoiceId);
      console.log(invoice);
    setValue('code',invoice?.code)
    setValue('payedPatch',invoice?.payedPatch)
    setValue('date',invoice?.date)
    setValue('notes',invoice?.notes)
    setValue('items',invoice?.items)
    }
    // append({ code: 1, name: '', notes:'',price:0,date:new Date });
    console.log(fields);
    
    
    }, [data , invoice])
    const onSubmit = (data:any) => {
      console.log(data);
      const payload = {...data, client:id , apartment:apartmentId}
      if (invoiceId) {
        updateinvoice(payload);
      } else {
        addinvoice(payload);
      }
       
    }

   const onAddItem = () =>{
     append({ code: fields.length + 1, name: '', itemNotes:'',price:'',date:new Date })
    }

  const onARemoveItem = (index:any) =>{
     remove(index)
    }
  
    const onCancel = () =>{
     reset();
      navigate(-1);
    }
  
    const inputsArr = [
      {
        label: "كود الدفعة",
        name: "code",
        render: (field:any)=> <InputNumber  status={errors.code&&'error'} readOnly className=" w-full" size="large" placeholder="كود الدفعة" {...field}/>,
        xs:12,
        lg:12
      },
      {
        label: "مبلغ الدفعة",
        name: "payedPatch",
        render: (field:any)=> <InputNumber status={errors.payedPatch&&'error'}  autoFocus className=" !w-full" size="large" placeholder="مبلغ الدفعة " {...field}/>,
        xs:12,
        lg:12
      },
      {
        label: "تاريخ الدفعة",
        name: "date",
        render: (field:any)=> <DatePicker status={errors.date&&'error'}  className=" w-full" size="large" placeholder="تاريخ الدفعة " value={field.value?dayjs(field.value):null} onChange={field.onChange}/>,
        xs:12,
        lg:12
      },
      {
        label: "ملاحظات",
        name: "notes",
        render: (field:any)=> <Input.TextArea status={errors.notes&&'error'}  className=" !w-full" size="large" placeholder=" ملاحظات" {...field}/>,
        xs:12,
        lg:12
      }
      ,
      {
        label: 
        <Flex gap={6}>
         <p> اضافة المصروفات :</p> 
         <ButtonComponent type="primary" className=" rounded-full" icon={<PlusOutlined/>} onClick={onAddItem}/>
 
        </Flex>,
        name: "items",
        isArray:true,
        fields:fields,
        children:[
          {
            label: "كود الصنف",
            name: "code",
            render: (field:any , index?:any)=> <InputNumber status={errors?.items && errors?.items![index]?.code?'error':''} readOnly  className=" !w-full" size="large" placeholder="كود الصنف" {...field}/>,
            xs:12,
            lg:4
          },
          {
            label: "اسم الصنف",
            name: "name",
            render: (field:any, index?:any)=> <Input status={errors?.items && errors?.items![index]?.name?'error':''}  className=" !w-full" size="large" placeholder=" اسم الصنف" {...field}/>,
            xs:12,
            lg:5
          },
          {
            label: "سعر الصنف",
            name: "price",
            render: (field:any, index?:any)=> <InputNumber status={errors?.items && errors?.items![index]?.price?'error':''}  className=" !w-full" size="large" placeholder=" سعر الصنف" {...field}/>,
            xs:12,
            lg:4
          },
          {
            label: "ملاحظات",
            name: "itemNotes",
            render: (field:any, index?:any)=> <Input.TextArea status={errors?.items && errors?.items![index]?.itemNotes?'error':''}  className=" !w-full" size="large" placeholder=" ملاحظات" {...field}/>,
            xs:12,
            lg:4
          },
          {
            label: "التاريخ",
            name: "date",
            render: (field:any, index?:any)=> <DatePicker status={errors?.items && errors?.items![index]?.date?'error':''}  className=" !w-full" size="large" placeholder=" التاريخ" value={field.value?dayjs(field.value):null} onChange={field.onChange}/>,
            xs:12,
            lg:4
          },
        ],
        xs:24,
        lg:24
      }
    ]
    return (
      <Card title={invoiceId?'تعديل الدفعة':'اضافة دفعة'}>
        <FormComponent onCancel={onCancel} okText={invoiceId?"تعديل":"اضافة"} cancelText="الغاء" control={control} errors={errors} onSubmit={handleSubmit(onSubmit)} inputsArr={inputsArr} loading={invoiceId?loadingEdit:loadingAdd} onRemove={onARemoveItem}/>
      </Card>
    )
}

export default AddEditInvocePage