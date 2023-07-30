import { AppDataSource } from "../../data-source";
import { Transaction } from "../../entities/Transaction";
import { EditTransactionType, TransactionSumType, TransactionType } from "../types/transactions";

const INCOME_CATEGORY = 1;
const DEFAULT_TRANSACTION_TAKE = 20;

const transactionRepository = AppDataSource.getRepository(Transaction);

export const getMonthlyTransactionsSums = async (
  userId: number,
  date: string
): Promise<TransactionSumType> =>
  await transactionRepository
    .createQueryBuilder("transaction")
    .select("SUM(amount)", "expense")
    .addSelect((subQuery) => {
      return subQuery
        .select("SUM(amount)", "income")
        .from(Transaction, "t")
        .where("t.userId = :userId", { userId })
        .andWhere("t.categoryId = :income_category", { income_category: INCOME_CATEGORY })
        .andWhere("YEAR(t.date) = YEAR(:date)", { date })
        .andWhere("MONTH(t.date) = MONTH(:date)", { date });
    }, "income")
    .where("transaction.userId = :userId", { userId })
    .andWhere("transaction.categoryId <> :income_category", { income_category: INCOME_CATEGORY })
    .andWhere("YEAR(transaction.date) = YEAR(:date)", { date })
    .andWhere("MONTH(transaction.date) = MONTH(:date)", { date })
    .getRawOne();

export const getMonthlyTransactionData = async (
  userId: number,
  date: string,
  take = DEFAULT_TRANSACTION_TAKE,
  skip = 0
) =>
  await transactionRepository
    .createQueryBuilder("transaction")
    .where("transaction.userId = :userId", { userId })
    .andWhere("YEAR(transaction.date) = YEAR(:date)", { date })
    .andWhere("MONTH(transaction.date) = MONTH(:date)", { date })
    .skip(skip)
    .take(take)
    .orderBy("date", "DESC")
    .addOrderBy("id", "DESC")
    .getManyAndCount();

export const createTransaction = async (data: TransactionType) => {
  const transaction = new Transaction();
  transaction.amount = data.amount;
  transaction.description = data.description;
  transaction.date = data.date;
  transaction.userId = data.userId;
  transaction.categoryId = data.categoryId;
  transaction.typeId = data.typeId;

  return await transactionRepository.save(transaction);
};

export const setTransaction = async (data: EditTransactionType) =>
  await transactionRepository
    .createQueryBuilder()
    .update(Transaction)
    .set({
      amount: data.amount,
      description: data.description,
      date: data.date,
      categoryId: data.categoryId,
      typeId: data.typeId,
    })
    .where("id = :id", { id: data.id })
    .execute();

export const deleteTransaction = async (id: number) =>
  await transactionRepository
    .createQueryBuilder()
    .delete()
    .from(Transaction)
    .where("id = :id", { id })
    .execute();

export const getUserTotalBalance = async (userId: number) => {
  const result = await transactionRepository
    .createQueryBuilder("transaction")
    .select("SUM(amount)", "expense")
    .addSelect((subQuery) => {
      return subQuery
        .select("SUM(amount)", "income")
        .from(Transaction, "t")
        .where("t.userId = :userId", { userId })
        .andWhere("t.categoryId = :income_category", { income_category: INCOME_CATEGORY });
    }, "income")
    .where("transaction.userId = :userId", { userId })
    .andWhere("transaction.categoryId <> :income_category", { income_category: INCOME_CATEGORY })
    .getRawOne();

  const totalBalance = (result.income || 0) - (result.expense || 0);
  return totalBalance.toFixed(2);
};

export const getUserAllTransactions = async (
  userId: number,
  take = DEFAULT_TRANSACTION_TAKE,
  skip = 0
) =>
  await transactionRepository
    .createQueryBuilder("transaction")
    .where("transaction.userId = :userId", { userId })
    .skip(skip)
    .take(take)
    .orderBy("date", "DESC")
    .addOrderBy("id", "DESC")
    .getMany();
