import { AppDataSource } from "../../data-source";
import { Transaction } from "../../entities/Transaction";
import { Wallet } from "../../entities/Wallet";

const walletRepository = AppDataSource.getRepository(Wallet);
type WalletWithCurrentBalance = Wallet & { currentBalance: number };

type WalletsWithBalance = {
  wallets: WalletWithCurrentBalance[];
  count: number;
};

export const getWalletsWithBalanceByUserId = async (
  userId: number
): Promise<WalletsWithBalance> => {
  const [wallets, count] = await Promise.all([
    walletRepository
      .createQueryBuilder("wallet")
      .select([
        "walletId",
        "userId",
        "startingBalance",
        "walletName",
        "currencyCode",
        "currencySymbol",
        "type",
        "color",
        "COALESCE(SUM(transaction.amount), 0) + startingBalance AS currentBalance",
      ])
      .leftJoin(Transaction, "transaction", "walletId = transaction.walletId")
      .where("userId = :userId", { userId })
      .groupBy("walletId, userId, startingBalance, walletName, currencyCode, currencySymbol, type")
      .getRawMany(),
    walletRepository.createQueryBuilder("wallet").where("userId = :userId", { userId }).getCount(),
  ]);

  return { wallets, count };
};

export const updateWalletStartingBalance = async (
  userId: number,
  walletId: number,
  value: number
) =>
  await walletRepository
    .createQueryBuilder("wallet")
    .update(Wallet)
    .set({
      startingBalance: value,
    })
    .where("userId = :userId", { userId })
    .andWhere("walletId = :walletId", { walletId })
    .execute();

export const getBalanceDifference = async (
  userId: number,
  walletId: number,
  value: number,
) => {
  const balance = await walletRepository
    .createQueryBuilder("wallet")
    .select(["COALESCE(SUM(transaction.amount), 0) + startingBalance AS currentBalance"])
    .leftJoin(Transaction, "transaction", "walletId = transaction.walletId")
    .where("userId = :userId", { userId })
    .andWhere("walletId = :walletId", { walletId })
    .groupBy("walletId, userId, startingBalance, walletName, currencyCode, currencySymbol, type")
    .getRawOne();
  const balanceDifference = value - balance.currentBalance;

  return balanceDifference;
};
