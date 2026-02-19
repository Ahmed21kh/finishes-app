/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Flex, Select } from "antd"
import InvoicesPage from "../invoices/InvoicesPage"
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import FormComponent from "../../components/FormComponent";
import { getAccountStatementsNames } from "../../apis/AccountStatementsApi";
import { getApartmentsNames } from "../../apis/ApartmentsApi";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
const PaymentsAndPatches = () => {

     const [searchParams, setSearchParams] = useSearchParams();
     const [clientId, setclientId] = useState<any>(null);
     const [apartmentId, setapartmentId] = useState<any>(null);
     const clientSchema = yup.object().shape({
        client: yup.string().notRequired(),
        apartment:yup.string().notRequired(),
      });
      const {
        handleSubmit,
        reset,
        control,
      } = useForm({
        resolver: yupResolver(clientSchema),
      });
          const fetchClientNames = () => {
              return getAccountStatementsNames();
            }

        const fetchApartmentNames = ({ queryKey }:any) => {
            console.log(queryKey);
            const [, clientId] = queryKey;
            return getApartmentsNames(clientId);
        }

      const filterOption = (input:any, option:any) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        
      
        const {data:clients , isLoading:loadingClients} = useQuery(['clientsNames'], fetchClientNames);
        const {data:apartments , isLoading:loadingApartment} = useQuery(['apartmentsNames',{clientId:clientId}], fetchApartmentNames , {enabled:!!clientId});

      const inputsArr = [
        {
          label: "",
          name: "client",
          render: (_field:any)=> <Select allowClear loading={loadingClients} options={clients?.clientsNames?.map((c:any)=>{return {value:c.id,label:c.name}})}  autoFocus showSearch={true} filterOption={filterOption} className=" !w-full" size="large" placeholder="اسم العميل " value={clientId} onChange={changeClient}/>,
          xs:12,
          lg:8
        },
        {
          value: "",
          name: "apartment",
          render: (_field:any)=> <Select allowClear loading={loadingApartment} options={apartments?.apartmentsNames?.map((c:any)=>{return {value:c.id,label:c.name}})} showSearch={true} filterOption={filterOption} className=" !w-full" size="large" placeholder=" عنوان الشقة" value={apartmentId} onChange={changeApartment}/>,
          xs:12,
          lg:8
        }
      ]

    const changeClient = (value:any) => {
      setclientId(value);
      updateSearchParams({ client: value , apartment: null });
      setapartmentId(null);
    }

    const changeApartment = (value:any) => {
      setapartmentId(value);
      updateSearchParams({ apartment: value });
    }
    const updateSearchParams = (newParams:any) => {
      setSearchParams((prevParams) => {
        const updatedParams = new URLSearchParams(prevParams);
        Object.keys(newParams).forEach((key) => {
          if (newParams[key]) {
            updatedParams.set(key, newParams[key]); // Set new param
          } else {
            updatedParams.delete(key); // Remove empty params
          }
        });
        return updatedParams;
      });
    };
  useEffect(() => { 
  if (searchParams.get('client') ) {
    setclientId(searchParams.get('client')||"");
  }
  if (searchParams.get('apartment')) {
    setapartmentId(searchParams.get('apartment')||"");
  }
  }, [clients,apartments])

      const onSubmit = (data:any) => {
        console.log(data);
         
      }
    
      const onCancel = () =>{
       reset();
      }
  return (
    <Flex vertical gap={60}>
        <FormComponent hideButtons onCancel={onCancel} control={control}  onSubmit={handleSubmit(onSubmit)} inputsArr={inputsArr} />
        <InvoicesPage clientId={clientId} apartmentId={apartmentId}/>
    </Flex>
  )
}

export default PaymentsAndPatches