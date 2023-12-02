import { AppDataSource } from "../../data-source";
import { Transaction } from "../../entities/Transaction";
import { Wallet } from "../../entities/Wallet";

const walletRepository = AppDataSource.getRepository(Wallet);
type WalletWithCurrentBalance = Wallet & { currentBalance: number };

type WalletsWithBalance = {
  wallets: WalletWithCurrentBalance[],
  count: number;
}

export const getWalletsWithBalanceByUserId = async (userId: number): Promise<WalletsWithBalance> => {
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
        "COALESCE(SUM(transaction.amount), 0) + startingBalance AS currentBalance"
      ])
      .leftJoin(Transaction, "transaction", "walletId = transaction.walletId")
      .where("userId = :userId", { userId })
      .groupBy("walletId, userId, startingBalance, walletName, currencyCode, currencySymbol, type")
      .getRawMany(),
    walletRepository.createQueryBuilder("wallet").where("userId = :userId", { userId }).getCount(),
  ]);

  return { wallets, count };
};
