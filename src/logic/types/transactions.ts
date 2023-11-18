import { Transaction } from "../../entities/Transaction";

export type TransactionType = {
  amount: number;
  description: string;
  date: string;
  userId: number;
  categoryId: number;
  typeId: number;
  walletId: number;
};

export type EditTransactionType = Omit<TransactionType, "userId"> & { id: number };

export type TransactionSumType = {
  income: number;
  expense: number;
};

export type GetTransactionsRequest = {
  userId: number;
  walletIds: number[];
  start: number;
  count: number;
  //ISO Date
  date: string;
};

export type GetUserBalanceRequest = {
  userId: number;
  walletIds: number[];
};

export type SearchTransactionsRequest = {
  userId: number;
  start?: number;
  count?: number;
  //ISO Date
  startDate?: string;
  endDate?: string;
  categories?: number[];
};

export type SearchTransactionsResponse = {
  transactions: Transaction[];
  count: number;
};
