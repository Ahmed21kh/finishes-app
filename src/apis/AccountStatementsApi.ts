import { Axios } from "./Apis";


export const addAccountStatementApi = async (obj: any) => {
  const { data } = await Axios.post(`/api/accountStatement/add`, obj);
  return data;
};

export const updateAccountStatementApi = async (id: any, obj: any) => {
  const { data } = await Axios.put(`/api/accountStatement/update`, obj, {
    params: { accountStatementId: id },
  });
  return data;
};

export const deleteAccountStatementApi = async (id: any) => {
  const { data } = await Axios.delete(`/api/accountStatement/delete`, {
    params: { accountStatementId: id },
  });
  return data;
};

export const getOneAccountStatementApi = async (id: any) => {
  const { data } = await Axios.get(`/api/accountStatement/get-one`, {
    params: { accountStatementId: id },
  });
  return data;
};
export const getAccountStatementCodeApi = async () => {
  const { data } = await Axios.get(`/api/accountStatement/get-code`);
  return data;
};
export const getAllAccountStatements = async (params: any) => {
  const { data } = await Axios.get("/api/accountStatement/get-all", { params: params });
  return data;
};

export const getAccountStatementsNames = async () => {
  const { data } = await Axios.get("/api/accountStatement/get-names");
  return data;
};