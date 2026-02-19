/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "./Apis";


export const addapartmentApi = async (obj: any) => {
  const { data } = await Axios.post(`/api/apartment/add`, obj);
  return data;
};

export const updateapartmentApi = async (id: any, obj: any) => {
  const { data } = await Axios.put(`/api/apartment/update`, obj, {
    params: { apartmentId: id },
  });
  return data;
};

export const deleteapartmentApi = async (id: any) => {
  const { data } = await Axios.delete(`/api/apartment/delete`, {
    params: { apartmentId: id },
  });
  return data;
};

export const getOneapartmentApi = async (id: any) => {
  const { data } = await Axios.get(`/api/apartment/get-one`, {
    params: { apartmentId: id },
  });
  return data;
};
export const getapartmentCodeApi = async (params: any) => {
  const { data } = await Axios.get(`/api/apartment/get-code`,{ params: params });
  return data;
};
export const getAllapartments = async (params: any) => {
  const { data } = await Axios.get("/api/apartment/get-all", { params: params });
  return data;
};

export const getApartmentsNames = async (params: any) => {
  const { data } = await Axios.get("/api/apartment/get-names", { params: params });
  return data;
};