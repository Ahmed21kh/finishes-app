/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PaginationParams {
  page: number;
  limit: number;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  metaData?: { total: number }[];
}

export interface Patch {
  _id?: string;
  amount: string | number;
  date: Date | string;
  notes?: string;
}

export interface Payment {
  _id?: string;
  name: string;
  price: string | number;
  date: Date | string;
  notes?: string;
}

export interface AccountStatement {
  _id?: string;
  code: number;
  clientName: string;
  phoneNumber?: string;
  address: string;
  date: Date | string;
  notes?: string;
  isActive?: boolean;
  patches?: Patch[];
  payments?: Payment[];
  totalPatches?: number;
  totalPayments?: number;
  creditor?: number;
  debtor?: number;
}

export interface Apartment {
  _id?: string;
  code: number;
  address: string;
  client?: string;
  clientDetails?: {
    name: string;
    phoneNumber: string;
  };
}

export interface InvoiceItem {
  _id?: string;
  code: number;
  name: string;
  price: string | number;
  date: Date | string;
  itemNotes?: string;
}

export interface Invoice {
  _id?: string;
  code: number;
  payedPatch: string | number;
  date: Date | string;
  notes?: string;
  items?: InvoiceItem[];
  totalPrice?: number;
  remainingAmount?: number;
  client?: string;
  apartment?: string;
}

export interface Transaction {
  _id?: string;
  accountStatement: string | any;
  code: number;
  title: string;
  date: Date | string;
  notes?: string;
  status?: string;
  patches: Patch[];
  payments: Payment[];
  totalPatches?: number;
  totalPayments?: number;
  balance?: number;
  creditor?: number;
  debtor?: number;
  createdAt?: string;
  updatedAt?: string;
  clientDetails?: AccountStatement;
}

export interface ClientTransactionsSummary {
  totalTransactions: number;
  grandTotalPatches: number;
  grandTotalPayments: number;
  grandBalance: number;
  isCreditor: boolean;
}


