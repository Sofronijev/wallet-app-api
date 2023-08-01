import { Request, Response } from "express";
import {
  createTransaction,
  deleteTransaction,
  getMonthlyTransactionData,
  getMonthlyTransactionsSums,
  getUserTotalBalance,
  setTransaction,
  getUserAllTransactions,
} from "../logic/helperFunctions/transactions";
import {
  GetTransactionsRequest,
  TransactionType,
  EditTransactionType,
  GetUserBalanceRequest,
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
  const { userId, start, count, date } = req.body as GetTransactionsRequest;
  try {
    const transactionSums = await getMonthlyTransactionsSums(userId, date);
    const transactions = await getMonthlyTransactionData(userId, date, count, start);
    const income = transactionSums.income ?? 0;
    const expense = transactionSums.expense ?? 0;
    const balance = income - expense;
    return res
      .status(200)
      .send({ transactions: transactions[0], count: transactions[1], income, expense, balance });
  } catch (error) {
    return res.status(500).send({ message: "Error while fetching monthly transactions." });
  }
};

export const getUserBalance = async (req: Request, res: Response) => {
  const { userId } = req.body as GetUserBalanceRequest;
  try {
    const userBalance = await getUserTotalBalance(userId);
    // Get only latest 10 transactions
    const transactions = await getUserAllTransactions(userId, 10);

    return res.status(200).send({
      balance: userBalance,
      recentTransactions: transactions,
    });
  } catch (error) {
    return res.status(500).send({ message: "Error while fetching total balance." });
  }
};
