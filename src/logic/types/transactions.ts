export type TransactionType = {
  amount: number;
  description: string;
  date: string;
  userId: number;
  categoryId: number;
  typeId: number;
};

export type EditTransactionType =  Omit<TransactionType, 'userId'> & {id: number};

export type TransactionSumType = {
  income: number;
  expense: number;
};

export type getTransactionsRequest = {
    userId: number;
    start: number;
    count: number;
    date: string;
}
