import { EntityManager } from "typeorm";
import { AddTransfer } from "../../controller/transfer";
import { AppDataSource } from "../../data-source";
import { Transfer } from "../../entities/Transfer";

const transferRepository = AppDataSource.getRepository(Transfer);

type CreateTransferProps = Omit<AddTransfer, "amountTo" | "amountFrom"> & {
  transactionFromId: number;
  transactionToId: number;
};

export const createTransfer = async (data: CreateTransferProps, entityManager?: EntityManager) => {
  const transfer = new Transfer();

  transfer.userId = data.userId;
  transfer.date = data.date;
  transfer.fromWalletId = data.walletIdFrom;
  transfer.toWalletId = data.walletIdTo;
  transfer.fromTransactionId = data.transactionFromId;
  transfer.toTransactionId = data.transactionToId;

  if (entityManager) {
    return await entityManager.save(transfer);
  }

  return await transferRepository.save(transfer);
};
