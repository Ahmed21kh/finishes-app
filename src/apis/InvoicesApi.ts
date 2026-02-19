/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "./Apis";


export const addinvoiceApi = async (obj: any) => {
  const { data } = await Axios.post(`/api/invoice/add`, obj);
  return data;
};

export const updateinvoiceApi = async (id: any, obj: any) => {
  const { data } = await Axios.put(`/api/invoice/update`, obj, {
    params: { invoiceId: id },
  });
  return data;
};

export const deleteinvoiceApi = async (id: any) => {
  const { data } = await Axios.delete(`/api/invoice/delete`, {
    params: { invoiceId: id },
  });
  return data;
};

export const getOneinvoiceApi = async (id: any) => {
  const { data } = await Axios.get(`/api/invoice/get-one`, {
    params: { invoiceId: id },
  });
  return data;
};
export const getinvoiceCodeApi = async (params:any) => {
  const { data } = await Axios.get(`/api/invoice/get-code`, { params: params });
  return data;
};
export const getAllinvoices = async (params: any) => {
  const { data } = await Axios.get("/api/invoice/get-all", { params: params });
  return data;
};
