import { AppDataSource } from "../../data-source";
import { Wallet } from "../../entities/Wallet";

const walletRepository = AppDataSource.getRepository(Wallet);

export const getWalletsByUserId = async (userId: number) =>
  await walletRepository
    .createQueryBuilder("wallet")
    .where("wallet.userId = :userId", { userId })
    .getManyAndCount();

export const getInitialWalletsBalance = async (walletIds: number[]) =>
  await walletRepository
    .createQueryBuilder("wallet")
    .select("SUM(wallet.startingBalance)", "sum")
    .where("wallet.walletId IN (:...walletIds)", { walletIds })
    .getRawOne();
