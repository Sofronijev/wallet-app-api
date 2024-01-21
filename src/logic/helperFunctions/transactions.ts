import { EntityManager } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Transaction } from "../../entities/Transaction";
import {
  EditTransactionType,
  SearchTransactionsResponse,
  TransactionSumType,
  TransactionType,
} from "../types/transactions";

const DEFAULT_TRANSACTION_TAKE = 20;

const transactionRepository = AppDataSource.getRepository(Transaction);

export const getMonthlyTransactionsSums = async (
  userId: number,
  walletIds: number[],
  date: string
): Promise<TransactionSumType> =>
  await transactionRepository
    .createQueryBuilder("transaction")
    .select([
      "SUM(CASE WHEN transaction.amount < 0 THEN transaction.amount ELSE 0 END) AS expense",
      "SUM(CASE WHEN transaction.amount >= 0 THEN transaction.amount ELSE 0 END) AS income",
    ])
    .where("transaction.userId = :userId", { userId })
    .andWhere("transaction.walletId IN (:...walletIds)", {
      walletIds,
    })
    .andWhere("YEAR(transaction.date) = YEAR(:date)", { date })
    .andWhere("MONTH(transaction.date) = MONTH(:date)", { date })
    .getRawOne();

export const getMonthlyTransactionData = async (
  userId: number,
  walletIds: number[],
  date: string,
  take = DEFAULT_TRANSACTION_TAKE,
  skip = 0
) =>
  await transactionRepository
    .createQueryBuilder("transaction")
    .where("transaction.userId = :userId", { userId })
    .andWhere("transaction.walletId IN (:...walletIds)", {
      walletIds,
    })
    .andWhere("YEAR(transaction.date) = YEAR(:date)", { date })
    .andWhere("MONTH(transaction.date) = MONTH(:date)", { date })
    .skip(skip)
    .take(take)
    .orderBy("date", "DESC")
    .addOrderBy("id", "DESC")
    .getManyAndCount();

export const createTransaction = async (data: TransactionType, entityManager?: EntityManager) => {
  const transaction = new Transaction();
  transaction.amount = data.amount;
  transaction.description = data.description;
  transaction.date = data.date;
  transaction.userId = data.userId;
  transaction.categoryId = data.categoryId;
  transaction.typeId = data.typeId;
  transaction.walletId = data.walletId;

  if (entityManager) {
    return await entityManager.save(transaction);
  }

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
      walletId: data.walletId,
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

export const getSearchedTransactionData = async ({
  userId,
  walletIds,
  take = DEFAULT_TRANSACTION_TAKE,
  skip = 0,
  startDate,
  endDate,
  categories,
}: {
  userId: number;
  walletIds: number[];
  take?: number;
  skip?: number;
  startDate?: string;
  endDate?: string;
  categories?: number[];
}): Promise<SearchTransactionsResponse> => {
  const queryBuilder = transactionRepository
    .createQueryBuilder("transaction")
    .where("transaction.userId = :userId", { userId })
    .andWhere("transaction.walletId IN (:...walletIds)", {
      walletIds,
    });

  if (startDate && endDate) {
    queryBuilder.andWhere("transaction.date BETWEEN :startDate AND :endDate", {
      startDate,
      endDate,
    });
  } else if (startDate) {
    queryBuilder.andWhere("transaction.date >= :startDate", { startDate });
  } else if (endDate) {
    queryBuilder.andWhere("transaction.date <= :endDate", { endDate });
  }

  if (categories && categories.length > 0) {
    queryBuilder.andWhere("transaction.category IN (:...categories)", {
      categories,
    });
  }

  const [transactions, count] = await queryBuilder
    .skip(skip)
    .take(take)
    .orderBy("transaction.date", "DESC")
    .addOrderBy("transaction.id", "DESC")
    .getManyAndCount();

  return { transactions, count };
};
