import { Request, Response } from "express";
import {
  createTransaction,
  deleteTransaction,
  getMonthlyTransactionData,
  getMonthlyTransactionsSums,
  setTransaction,
  getSearchedTransactionData,
} from "../logic/helperFunctions/transactions";
import {
  GetTransactionsRequest,
  TransactionType,
  EditTransactionType,
  SearchTransactionsRequest,
} from "../logic/types/transactions";

export const addTransaction = async (req: Request, res: Response) => {
  try {
    const savedTransaction = await createTransaction(req.body as TransactionType);
    return res.status(200).send(savedTransaction);
  } catch (error) {
    return res.status(500).send({ message: "Failed to add transaction." });
  }
};

export const editTransaction = async (req: Request, res: Response) => {
  try {
    const response = await setTransaction(req.body as EditTransactionType);
    // returns number of rows affected
    if (response.affected) {
      return res.status(200).send({ message: "Transaction updated successfully." });
    }
    return res.status(422).send({ message: "Failed to edit transaction." });
  } catch (error) {
    return res.status(500).send({ message: "Error while editing transaction." });
  }
};

export const removeTransaction = async (req: Request, res: Response) => {
  try {
    const response = await deleteTransaction(req.body.id as number);
    if (response.affected) {
      return res.status(200).send({ message: "Transaction deleted successfully." });
    }
    return res.status(422).send({ message: "Failed to delete transaction." });
  } catch (error) {
    return res.status(500).send({ message: "Error while editing transaction." });
  }
};

export const getMonthlyTransactionsForUser = async (req: Request, res: Response) => {
  const { userId, walletIds, start, count, date } = req.body as GetTransactionsRequest;
  try {
    const transactionSums = await getMonthlyTransactionsSums(userId, walletIds, date);
    const transactions = await getMonthlyTransactionData(userId, walletIds, date, count, start);
    const income = transactionSums.income ?? 0;
    const expense = transactionSums.expense ?? 0;
    // Expense will be negative number
    const balance = income + expense;
    return res
      .status(200)
      .send({ transactions: transactions[0], count: transactions[1], income, expense, balance });
  } catch (error) {
    return res.status(500).send({ message: "Error while fetching monthly transactions." });
  }
};

export const searchTransactions = async (
  req: Request<unknown, unknown, SearchTransactionsRequest>,
  res: Response
) => {
  try {
    const { userId, walletIds, categories, start, count, endDate, startDate } = req.body;
    const data = await getSearchedTransactionData({
      userId,
      walletIds,
      categories,
      skip: start,
      take: count,
      endDate,
      startDate,
    });

    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({ message: "Error while searching for transactions." });
  }
};
