/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const { data } = await Axios.get("/api/accountStatement/get-all", {
    params: params,
  });
  return data;
};

export const toggleAccountStatementStatusApi = async (id: string) => {
  const { data } = await Axios.put(
    `/api/accountStatement/toggle-status`,
    {},
    {
      params: { accountStatementId: id },
    }
  );
  return data;
};

export const getAccountStatementsNames = async () => {
  try {
    const { data } = await Axios.get("/api/accountStatement/get-names");
    if (data?.clientsNames) {
      return data;
    }
    const { data: fallbackData } = await Axios.get(
      "/api/accountStatement/get-all",
      {
        params: { page: 1, limit: 1000, status: "active" },
      }
    );
    const items = fallbackData?.data || [];
    return {
      clientsNames: items
        .filter((c: any) => c.isActive !== false)
        .map((c: any) => ({
          id: c._id,
          name: c.clientName,
          code: c.code,
        })),
    };
  } catch (error) {
    console.error("Error fetching account statement names:", error);
    return { clientsNames: [] };
  }
};
