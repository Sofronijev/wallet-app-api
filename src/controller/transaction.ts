import { Request, Response } from "express";
import {
  createTransaction,
  deleteTransaction,
  getMonthlyTransactionData,
  getMonthlyTransactionsSums,
  setTransaction,
} from "../logic/helperFunctions/transactions";
import {
  getTransactionsRequest,
  TransactionType,
  EditTransactionType,
} from "../logic/types/transactions";

export const addTransaction = async (req: Request, res: Response) => {
  try {
    const savedTransaction = await createTransaction(req.body as TransactionType);
    return res.status(200).send(savedTransaction);
  } catch (error) {
    return res.status(500).send({ message: "Error adding transaction" });
  }
};

export const editTransaction = async (req: Request, res: Response) => {
  try {
    const response = await setTransaction(req.body as EditTransactionType);
    // returns number of rows affected
    if (response.affected) {
      return res.status(200).send({ message: "Transaction updated" });
    }
    return res.status(422).send({ message: "Failed to edit transaction" });
  } catch (error) {
    return res.status(500).send({ message: "Error while editing transaction" });
  }
};

export const removeTransaction = async (req: Request, res: Response) => {
  try {
    const response = await deleteTransaction(req.body.id as number);
    if (response.affected) {
      return res.status(200).send({ message: "Transaction deleted" });
    }
    return res.status(422).send({ message: "Failed to delete transaction" });
  } catch (error) {
    return res.status(500).send({ message: "Error while editing transaction" });
  }
};

export const getMonthlyTransactionsForUser = async (req: Request, res: Response) => {
  const { userId, start, count, date } = req.body as getTransactionsRequest;
  try {
    const transactionSums = await getMonthlyTransactionsSums(userId, date);
    const transactions = await getMonthlyTransactionData(userId, date, count, start);
    return res
      .status(200)
      .send({ transactions: transactions[0], count: transactions[1], ...transactionSums });
  } catch (error) {
    return res.status(500).send({ message: "Error getting transactions" });
  }
};
