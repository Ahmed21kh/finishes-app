/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "./Apis";
import { Transaction, ClientTransactionsSummary, AccountStatement } from "../types";

export interface GetClientTransactionsResponse {
  client: AccountStatement;
  transactions: Transaction[];
  summary: ClientTransactionsSummary;
}

export const addTransactionApi = async (obj: any) => {
  const { data } = await Axios.post(`/api/transaction/add`, obj);
  return data;
};

export const updateTransactionApi = async (id: string, obj: any) => {
  const { data } = await Axios.put(`/api/transaction/update`, obj, {
    params: { transactionId: id },
  });
  return data;
};

export const deleteTransactionApi = async (id: string) => {
  const { data } = await Axios.delete(`/api/transaction/delete`, {
    params: { transactionId: id },
  });
  return data;
};

export const getTransactionsByClientApi = async (
  accountStatementId: string
): Promise<GetClientTransactionsResponse> => {
  const { data } = await Axios.get(`/api/transaction/get-by-client`, {
    params: { accountStatementId },
  });
  return data;
};

export const getOneTransactionApi = async (transactionId: string) => {
  const { data } = await Axios.get(`/api/transaction/get-one`, {
    params: { transactionId },
  });
  return data;
};

export const getTransactionNextCodeApi = async (accountStatementId: string) => {
  const { data } = await Axios.get(`/api/transaction/get-code`, {
    params: { accountStatementId },
  });
  return data;
};

