/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm, useFieldArray } from "react-hook-form"
import { Card, Input, InputNumber, DatePicker, Flex } from "antd"
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormComponent from "../../components/FormComponent";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { addAccountStatementApi, getAccountStatementCodeApi, getOneAccountStatementApi, updateAccountStatementApi } from "../../apis/AccountStatementsApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import ButtonComponent from "../../components/ButtonComponent";
import { PlusOutlined } from "@ant-design/icons";

const AddAccountStatement = () => {
  const navigate = useNavigate();
  const accountStatementSchema = yup.object().shape({
    code: yup.number().required("كود العميل مطلوب"),
    clientName: yup.string().required("اسم العميل مطلوب"),
    phoneNumber: yup.string(),
    address: yup.string().required('العنوان مطلوب'),
    date: yup.date().required('التاريخ مطلوب'),
    notes: yup.string(),
    patches: yup.array().of(
      yup.object().shape({
        amount: yup.string().required('مبلغ الدفعة مطلوب'),
        date: yup.date().required('تاريخ الدفعة مطلوب'),
        notes: yup.string()
      })
    ),
    payments: yup.array().of(
      yup.object().shape({
        name: yup.string().required('اسم الصنف مطلوب'),
        price: yup.string().required('سعر الصنف مطلوب'),
        date: yup.date().required('تاريخ الصنف مطلوب'),
        notes: yup.string()
      })
    )
  });

  const {
    handleSubmit,
    formState: { errors: errors },
    setValue,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(accountStatementSchema)
  });

  const { fields: patchesFields, append: appendPatch, remove: removePatch } = useFieldArray({
    control,
    name: "patches",
  });

  const { fields: paymentsFields, append: appendPayment, remove: removePayment } = useFieldArray({
    control,
    name: "payments",
  });

  const params = useParams()
  const {data} = useQuery('clientCode',  { queryFn:getAccountStatementCodeApi , enabled: !params?.id});
  const {data:client} = useQuery('client',  { queryFn:()=>getOneAccountStatementApi(params?.id), enabled:!!params?.id});
   
  const {isLoading:loadingAdd , mutate:addAccountStatement} = useMutation(addAccountStatementApi,{
    onSuccess(data, _variables, _context) {
      console.log(data);
      toast.success(data?.message)
      navigate("/account-statement");
    },
    onError(error, _variables, _context) {
      toast.error(!error)
    },
  })

  const {isLoading:loadingEdit , mutate:updateAccountStatement} = useMutation({
    mutationFn:(body) => updateAccountStatementApi(params?.id ,body),
    onSuccess(data, _variables, _context) {
      console.log(data);
      toast.success(data?.message)
      navigate("/account-statement");
    },
    onError(error, _variables, _context) {
      toast.error(!error)
    },
  })

  useEffect(() => {
    console.log(data);
    if (!params?.id) {
      setValue('code', data?.code);
      setValue('date', new Date());
    } else {
      console.log(params);
      console.log(client);
      setValue('code', client?.code);
      setValue('clientName', client?.clientName);
      setValue('phoneNumber', client?.phoneNumber);
      setValue('address', client?.address);
      setValue('date', client?.date);
      setValue('notes', client?.notes);
      setValue('patches', client?.patches  ? client?.patches : []);
      setValue('payments', client?.payments ? client?.payments : []);
    }
  }, [data, client]);

  const onSubmit = (data:any) => {
    console.log(data);
    if (params?.id) {
      updateAccountStatement(data);
    } else {
      addAccountStatement(data);
    }
  }

  const onCancel = () =>{
    reset();
    navigate(-1);
  }

  const onAddPatch = () => {
    appendPatch({ amount: '', date: new Date(), notes: '' });
  }

  const onRemovePatch = (index: number) => {
    removePatch(index);
  }

  const onAddPayment = () => {
    appendPayment({ name: '', price: '', date: new Date(), notes: '' });
  }

  const onRemovePayment = (index: number) => {
    removePayment(index);
  }

  const inputsArr = [
    {
      label: "كود العميل",
      name: "code",
      render: (field:any)=> <InputNumber status={errors.code&&'error'} readOnly className=" w-full" size="large" placeholder="كود العميل" {...field}/>,
      xs:12,
      lg:12
    },
    {
      label: "اسم العميل",
      name: "clientName",
      render: (field:any)=> <Input status={errors.clientName&&'error'} autoFocus className="" size="large" placeholder="اسم العميل " {...field}/>,
      xs:12,
      lg:12
    },
    {
      label: "رقم الهاتف",
      name: "phoneNumber",
      render: (field:any)=><Input status={errors.phoneNumber&&'error'}  className="" size="large" placeholder="رقم الهاتف" {...field}/>,
      xs:12,
      lg:12
    },
    {
      label: "العنوان",
      name: "address",
      render: (field:any)=> <Input status={errors.address&&'error'} className="" size="large" placeholder="العنوان" {...field}/>,
      xs:12,
      lg:12
    },
    {
      label: "التاريخ",
      name: "date",
      render: (field:any)=> <DatePicker status={errors.date&&'error'} className="w-full" size="large" placeholder="التاريخ" value={field.value?dayjs(field.value):null} onChange={field.onChange}/>,
      xs:12,
      lg:12
    },
    {
      label: "ملاحظات",
      name: "notes",
      render: (field:any)=> <Input.TextArea status={errors.notes&&'error'} className="" size="large" placeholder="ملاحظات" {...field}/>,
      xs:24,
      lg:12
    },
    {
      label: 
      <Flex className="w-full" gap={8} align="center" justify="space-between">
        <p>الدفعات :</p> 
        <ButtonComponent type="primary" className="rounded-full" icon={<PlusOutlined/>} text="اضافة دفعة"  onClick={onAddPatch}/>
      </Flex>,
      name: "patches",
      isArray: true,
      fields: patchesFields,
      onRemove:onRemovePatch,
      children: [
        {
          label: "المبلغ",
          name: "amount",
          render: (field:any, index?:any)=> <InputNumber status={errors?.patches && errors?.patches![index]?.amount?'error':''} className="!w-full" size="large" placeholder="المبلغ" {...field}/>,
          xs:12,
          lg:8
        },
        {
          label: "التاريخ",
          name: "date",
          render: (field:any, index?:any)=> <DatePicker status={errors?.patches && errors?.patches![index]?.date?'error':''} className="!w-full" size="large" placeholder="التاريخ" value={field.value?dayjs(field.value):null} onChange={field.onChange}/>,
          xs:12,
          lg:8
        },
        {
          label: "ملاحظات",
          name: "notes",
          render: (field:any, index?:any)=> <Input.TextArea status={errors?.patches && errors?.patches![index]?.notes?'error':''} className="!w-full" size="large" placeholder="ملاحظات" {...field}/>,
          xs:12,
          lg:6
        }
      ],
      xs:24,
      lg:24
    },
    {
      label: 
      <Flex gap={8} align="center" justify="space-between">
        <p>المصروفات :</p> 
        <ButtonComponent type="primary" className="rounded-full" icon={<PlusOutlined/>} text="اضافة مصروف"  onClick={onAddPayment}/>
      </Flex>,
      name: "payments",
      isArray: true,
      fields: paymentsFields,
      onRemove:onRemovePayment,
      children: [
        {
          label: "الاسم",
          name: "name",
          render: (field:any, index?:any)=> <Input status={errors?.payments && errors?.payments![index]?.name?'error':''} className="!w-full" size="large" placeholder="الاسم" {...field}/>,
          xs:12,
          lg:6
        },
        {
          label: "السعر",
          name: "price",
          render: (field:any, index?:any)=> <InputNumber status={errors?.payments && errors?.payments![index]?.price?'error':''} className="!w-full" size="large" placeholder="السعر" {...field}/>,
          xs:12,
          lg:5
        },
        {
          label: "التاريخ",
          name: "date",
          render: (field:any, index?:any)=> <DatePicker status={errors?.payments && errors?.payments![index]?.date?'error':''} className="!w-full" size="large" placeholder="التاريخ" value={field.value?dayjs(field.value):null} onChange={field.onChange}/>,
          xs:12,
          lg:5
        },
        {
          label: "ملاحظات",
          name: "notes",
          render: (field:any, index?:any)=> <Input.TextArea status={errors?.payments && errors?.payments![index]?.notes?'error':''} className="!w-full" size="large" placeholder="ملاحظات" {...field}/>,
          xs:12,
          lg:6
        }
      ],
      xs:24,
      lg:24
    }
  ]

  return (
    <Card title={params?.id?'تعديل كشف الحساب':'فتح كشف حساب'}>
      <FormComponent 
        onCancel={onCancel} 
        okText={params?.id?"تعديل":"اضافة"} 
        cancelText="الغاء" 
        control={control} 
        errors={errors} 
        onSubmit={handleSubmit(onSubmit)} 
        inputsArr={inputsArr} 
        loading={params?.id?loadingEdit:loadingAdd}
      />
    </Card>
  )
}

export default AddAccountStatement