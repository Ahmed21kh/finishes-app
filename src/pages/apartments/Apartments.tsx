/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteFilled, EditFilled, ExclamationCircleFilled, EyeOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { Flex, Input, InputNumber, Modal, Typography } from "antd"
import ButtonComponent from "../../components/ButtonComponent"
import TableComponent from "../../components/TableComponent"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { deleteapartmentApi, getAllapartments } from "../../apis/ApartmentsApi"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form"
import FilterComponent from "../../components/FilterComponent"
interface ApartmentsProps {
    clientId: string | undefined;
}
const Apartments = ({clientId}:ApartmentsProps) => {
    const {Title , Text} = Typography;
    const  navigate  = useNavigate();
    const [pageNumber, setpageNumber] = useState(1);
    const [searchParams, setsearchParams] = useState({page:1, limit:10,client:clientId})
    const queryapartment = useQueryClient()
    const [modal, contextHolder] = Modal.useModal();
  
    const searchFilter = yup.object().shape({
      name: yup.string().notRequired(),
      code: yup.string().notRequired(),
    });
    const {
      handleSubmit,
      formState: { errors: errors },
      reset,
      control,
    } = useForm({
      resolver: yupResolver(searchFilter),
    });
  
    const inputsArr = [
      {
        name: "code",
        render: (field:any)=> <InputNumber prefix={<SearchOutlined className=" text-gray-400"/>}  status={errors.code&&'error'}  className=" w-full" size="large" placeholder="بحث بكود الشقة" {...field}/>,
        xs:24,
        lg:7
      },
      {
        name: "address",
        render: (field:any)=> <Input prefix={<SearchOutlined className=" text-gray-400"/>} status={errors.name&&'error'}  className="w-full" size="large" placeholder="بحث باسم الشقة " {...field}/>,
        xs:24,
        lg:7
      },
 
    ]
    const fetchapartments = ({ queryKey }:any) => {
      console.log(queryKey);
      const [, searchParams] = queryKey;
      return getAllapartments(searchParams)
    }
  
    const {data , isLoading} = useQuery(['apartments', searchParams], fetchapartments);
  
    const {mutate:deleteapartment , isLoading:loadingDelete} = useMutation(deleteapartmentApi,{
      onSuccess: (data) => {
        console.log(data);
        toast.success(data?.message)
        queryapartment.invalidateQueries(['apartments', searchParams]);
      },
      onError: (error) => {
        console.error(error);
        toast.error(!error)
      }
    })
    useEffect(() => {
    console.log(data);
  }, [data, pageNumber,searchParams])
  
    const onDeleteapartment = (id:any) =>{
      modal.confirm({
        title: 'هل انت متأكد من حذف هذه الشقة؟',
        icon: <ExclamationCircleFilled />,
        content: '',
        className:'',
        direction:'rtl',
        okText: 'حذف',
        type:'confirm',
        okType:'danger',
        okButtonProps:{type:'primary' , loading:loadingDelete},
        cancelText: 'الغاء',
        onOk() {
          console.log('OK');
          deleteapartment(id);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
    const onShowapartmentDetails = (id:any) =>{
    navigate(`/account-statement/${clientId}/apartment/${id}`);
    };
  
    const handelFilter = (search:any) =>{
      console.log(search);
      let filter = {
        ...searchParams,
        ...search
      }
     setsearchParams(filter)
     queryapartment.invalidateQueries(['apartments',filter]);
      
    }
    const changePagination = (page:any) => {
     console.log(page);
     setpageNumber(page);
     let search = {
      ...searchParams,
      page:page
     }
     setsearchParams(search)
     queryapartment.invalidateQueries(['apartments',search]);
  
    }

    const resetFilter = () => {
      reset()
      setsearchParams({page:1, limit:10,client:clientId})
    }

    const columns = [
      {
        title: 'رقم التسلسل',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: 'عنوان الشقة',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'اسم العميل',
        dataIndex: 'clientDetails.name',
        key: 'clientDetails.name',
        render: (_:any, record:any) => (
          <Text>
            {record?.clientDetails?.name}
          </Text>
        )
      },
      {
        title: ' رقم التليفون',
        dataIndex: 'clientDetails.phoneNumber',
        key: 'clientDetails.phoneNumber',
        render: (_:any, record:any) => (
          <Text>
            {record?.clientDetails?.phoneNumber}
          </Text>
        )
      },
      {
        title: '',
        key: 'show',
        render: (_:any, record:any) => (
          <ButtonComponent type="primary" className=" bg-slate-500 hover:!bg-slate-400"  tooltipTitle="عرض الشقة" icon={<EyeOutlined />} onClick={()=>onShowapartmentDetails(record?._id)}/>
        ),
      },
      {
        title: '',
        key: 'edit',
        render: (_:any, record:any) => (
          <ButtonComponent type="primary" icon={<EditFilled />} tooltipTitle="تعديل الشقة" onClick={()=>navigate(`/account-statement/${clientId}/edit-apartment/${record?._id}`)}/>
        ),
      },
      {
        title: '',
        key: 'delete',
        render: (_:any, record:any) => (
          <ButtonComponent type="primary" danger icon={<DeleteFilled />} tooltipTitle="حذف الشقة" onClick={()=>onDeleteapartment(record?._id)}/>
        ),
      },
    ]
    return (
      <>
      {contextHolder}
      <div>
        <Flex justify={'space-between'}>
          <Title level={3}>الشقق الخاصة بالعميل</Title>
          <ButtonComponent type="primary" text="اضافة شقة" icon={<PlusOutlined/>} onClick={()=>navigate(`/account-statement/${clientId}/add-apartment`)}/>
        </Flex>
        <Flex justify={'space-between'} className=" my-4">
          <FilterComponent clear={()=>resetFilter()} control={control} errors={errors} inputsArr={inputsArr} onSubmit={handleSubmit(handelFilter)}/>
        </Flex>
        <div className=" my-3">
          <TableComponent rowKey={'code'} pageNumber={pageNumber} pageSize={searchParams.limit} columns={columns} total={data?.metaData[0]?.total} dataSource={data?.data}  loading={isLoading}  onPageChange={changePagination}/>
        </div>
      </div>
      </>
    )
}

export default Apartments