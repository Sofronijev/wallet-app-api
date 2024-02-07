import { EntityManager } from "typeorm";
import { AddTransfer, GetTransfer } from "../../controller/transfer";
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

export const getTransfer = async ({
  userId,
  id,
  transactionIdFrom,
  transactionIdTo,
}: GetTransfer) => {
  const queryBuilder = transferRepository
    .createQueryBuilder("transfer")
    .leftJoinAndSelect("transfer.fromTransaction", "fromTransaction")
    .leftJoinAndSelect("transfer.toTransaction", "toTransaction")
    .where("transfer.userId = :userId", { userId });

  if (id) {
    queryBuilder.andWhere("transfer.id = :id", { id });
  }

  if (transactionIdFrom) {
    queryBuilder.andWhere("transfer.fromTransactionId = :transactionIdFrom", { transactionIdFrom });
  }

  if (transactionIdTo) {
    queryBuilder.andWhere("transfer.toTransactionId = :transactionIdTo", { transactionIdTo });
  }

  const transfer = await queryBuilder.getOneOrFail();

  return transfer;
};

type SetTransferProps = {
  date: string;
  id: number;
  walletIdFrom: number;
  walletIdTo: number;
};

export const setTransfer = async (data: SetTransferProps, entityManager?: EntityManager) => {
  const entity = entityManager ?? transferRepository;

  return await entity
    .createQueryBuilder()
    .update(Transfer)
    .set({
      date: data.date,
      fromWalletId: data.walletIdFrom,
      toWalletId: data.walletIdTo,
    })
    .where("id = :id", { id: data.id })
    .execute();
};

export const deleteTransfer = async (id: number, entityManager?: EntityManager) => {
  const entity = entityManager ?? transferRepository;

  await entity.createQueryBuilder().delete().from(Transfer).where("id = :id", { id }).execute();
};
