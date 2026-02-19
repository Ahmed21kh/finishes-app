/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { DeleteFilled, EditFilled, ExclamationCircleFilled, PlusOutlined, SearchOutlined } from "@ant-design/icons"
// import { Flex, Input, InputNumber, Modal, Typography } from "antd"
// import ButtonComponent from "../../components/ButtonComponent"
// import TableComponent from "../../components/TableComponent"
// import { useNavigate } from "react-router-dom"
// import { useMutation, useQuery, useQueryClient } from "react-query"
// import { deleteClientApi, getAllClients } from "../../apis/AccountStatementsApi"
// import { useEffect, useState } from "react"
// import { toast } from "react-toastify"
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useForm } from "react-hook-form"
// import FilterComponent from "../../components/FilterComponent"
const CustomersPage = () => {
//   const {Title} = Typography;
//   const  navigate  = useNavigate();
//   const [pageNumber, setpageNumber] = useState(1);
//   const [searchParams, setsearchParams] = useState({page:1, limit:10})
//   const queryClient = useQueryClient()
//   const [modal, contextHolder] = Modal.useModal();

//   const searchFilter = yup.object().shape({
//     name: yup.string().notRequired(),
//     code: yup.string().notRequired(),
//     phoneNumber:yup.number().notRequired(),
//   });
//   const {
//     handleSubmit,
//     formState: { errors: errors },
//     reset,
//     control,
//   } = useForm({
//     resolver: yupResolver(searchFilter),
//   });

//   const inputsArr = [
//     {
//       name: "code",
//       render: (field:any)=> <InputNumber prefix={<SearchOutlined className=" text-gray-400"/>}  status={errors.code&&'error'}  className=" w-full" size="large" placeholder="بحث بكود العميل" {...field}/>,
//       xs:24,
//       lg:7
//     },
//     {
//       name: "name",
//       render: (field:any)=> <Input prefix={<SearchOutlined className=" text-gray-400"/>} status={errors.name&&'error'}  className="w-full" size="large" placeholder="بحث باسم العميل " {...field}/>,
//       xs:24,
//       lg:7
//     },
//     {
//       name: "phoneNumber",
//       render: (field:any)=> <Input prefix={<SearchOutlined className=" text-gray-400"/>} status={errors.name&&'error'}  className="w-full" size="large" placeholder="بحث برقم الهاتف" {...field}/>,
//       xs:24,
//       lg:7
//     }
//   ]
//   const fetchClients = ({ queryKey }:any) => {
//     console.log(queryKey);
//     const [, searchParams] = queryKey;
//     return getAllClients(searchParams)
//   }

//   const {data , isLoading} = useQuery(['clients', searchParams], fetchClients);

//   const {mutate:deleteClient, isLoading:loadingDelete} = useMutation(deleteClientApi,{
//     onSuccess: (data) => {
//       console.log(data);
//       toast.success(data?.message)
//       queryClient.invalidateQueries(['clients', searchParams]);
//     },
//     onError: (error) => {
//       console.error(error);
//       toast.error(!error)
//     }
//   })
//   useEffect(() => {
//   console.log(data);
// }, [data, pageNumber,searchParams])

//   const onDeleteClient = (id:any) =>{
//     modal.confirm({
//       title: 'هل انت متأكد من حذف هذا العميل؟',
//       icon: <ExclamationCircleFilled />,
//       content: '',
//       className:'',
//       direction:'rtl',
//       okText: 'حذف',
//       type:'confirm',
//       okType:'danger',
//       okButtonProps:{type:'primary', loading:loadingDelete},
//       cancelText: 'الغاء',
//       onOk() {
//         console.log('OK');
//         deleteClient(id);
//       },
//       onCancel() {
//         console.log('Cancel');
//       },
//     });
//   }

//   const handelFilter = (search:any) =>{
//     console.log(search);
//     let filter = {
//       ...searchParams,
//       ...search
//     }
//    setsearchParams(filter)
//    queryClient.invalidateQueries(['clients',filter]);
    
//   }

//   const resetFilter = () =>{
//     reset()
//     setsearchParams({page:1, limit:10})
//   }

//   const changePagination = (page:any) => {
//    console.log(page);
//    setpageNumber(page);
//    let search = {
//     ...searchParams,
//     page:page
//    }
//    setsearchParams(search)
//    queryClient.invalidateQueries(['clients',search]);

//   }
//   const columns = [
//     {
//       title: 'رقم التسلسل',
//       dataIndex: 'code',
//       key: 'code',
//     },
//     {
//       title: 'اسم العميل',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'رقم الهاتف',
//       dataIndex: 'phoneNumber',
//       key: 'phoneNumber',
//     },
//     {
//       title: '',
//       key: 'edit',
//       render: (_:any, record:any) => (
//         <ButtonComponent type="primary" icon={<EditFilled />} onClick={()=>navigate(`/customers/edit-customer/${record?._id}`)}/>
//       ),
//     },
//     {
//       title: '',
//       key: 'delete',
//       render: (_:any, record:any) => (
//         <ButtonComponent type="primary" danger icon={<DeleteFilled />} onClick={()=>onDeleteClient(record?._id)}/>
//       ),
//     }
//   ]
  return (
    <>
    {/* {contextHolder}
    <div>
      <Flex justify={'space-between'}>
        <Title level={3}>العملاء</Title>
        <ButtonComponent type="primary" text="اضافة عميل" icon={<PlusOutlined/>} onClick={()=>navigate('/customers/add-customer')}/>
      </Flex>
      <Flex justify={'space-between'} className=" my-2">
        <FilterComponent clear={()=>resetFilter()} control={control} errors={errors} inputsArr={inputsArr} onSubmit={handleSubmit(handelFilter)}/>
      </Flex>
      <div className=" my-3">
        <TableComponent rowKey={'code'}  pageNumber={pageNumber} pageSize={searchParams.limit} columns={columns} total={data?.metaData[0]?.total} dataSource={data?.data}  loading={isLoading}  onPageChange={changePagination}/>
      </div>
    </div> */}
    </>
  )
}

export default CustomersPage