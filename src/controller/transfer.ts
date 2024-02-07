import { Request, Response } from "express";
import {
  createTransfer,
  deleteTransfer,
  getTransfer,
  setTransfer,
} from "../logic/helperFunctions/transfers";
import {
  createTransaction,
  deleteTransaction,
  setTransaction,
} from "../logic/helperFunctions/transactions";
import { getWallet } from "../logic/helperFunctions/wallets";
import { categories, categoryTypes } from "../modules/categories";
import { AppDataSource } from "../data-source";

export type AddTransfer = {
  userId: number;
  amountFrom: number;
  amountTo: number;
  walletIdFrom: number;
  walletIdTo: number;
  date: string;
};

export type EditTransfer = AddTransfer & {
  id: number;
  transactionIdTo: number;
  transactionIdFrom: number;
};

export type GetTransfer = {
  userId: number;
  id?: number;
  transactionIdFrom?: number;
  transactionIdTo?: number;
};

export const addTransfer = async (req: Request, res: Response) => {
  const { userId, amountFrom, amountTo, walletIdFrom, walletIdTo, date } = req.body as AddTransfer;

  const queryRunner = AppDataSource.createQueryRunner();

  // establish database connection
  await queryRunner.connect();

  // open a new transaction:
  await queryRunner.startTransaction();

  try {
    const walletFrom = await getWallet(userId, walletIdFrom);
    const walletTo = await getWallet(userId, walletIdTo);

    const transactionFrom = await createTransaction(
      {
        // Make number negative for From
        amount: -Math.abs(amountFrom),
        description: `Transfer to ${walletTo.walletName}`,
        date,
        userId,
        categoryId: categories.transfer.id,
        typeId: categoryTypes.transfer_send.id,
        walletId: walletIdFrom,
      },
      queryRunner.manager
    );

    const transactionTo = await createTransaction(
      {
        amount: Math.abs(amountTo),
        description: `Transfer from ${walletFrom.walletName}`,
        date,
        userId,
        categoryId: categories.transfer.id,
        typeId: categoryTypes.transfer_received.id,
        walletId: walletIdTo,
      },
      queryRunner.manager
    );

    await createTransfer(
      {
        userId,
        walletIdFrom,
        walletIdTo,
        date,
        transactionFromId: transactionFrom.id,
        transactionToId: transactionTo.id,
      },
      queryRunner.manager
    );
    // commit transactions
    await queryRunner.commitTransaction();

    return res.status(200).send({ message: "Transfer created." });
  } catch (error) {
    // Rollback the transaction if an error occurs
    await queryRunner.rollbackTransaction();

    return res.status(500).send({ message: "Failed to create a transfer." });
  } finally {
    // need to release query runner which is manually created:
    await queryRunner.release();
  }
};

export const fetchTransfer = async (req: Request, res: Response) => {
  try {
    const transfer = await getTransfer(req.body as GetTransfer);
    // remove unneeded props before sending
    const { userId, fromTransactionId, toTransactionId, ...data } = transfer;
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({ message: "Transfer does not exist" });
  }
};

export const editTransfer = async (req: Request, res: Response) => {
  const {
    userId,
    amountFrom,
    amountTo,
    date,
    id,
    walletIdFrom,
    walletIdTo,
    transactionIdFrom,
    transactionIdTo,
  } = req.body as EditTransfer;

  const queryRunner = AppDataSource.createQueryRunner();

  // establish database connection
  await queryRunner.connect();

  // open a new transaction:
  await queryRunner.startTransaction();
  try {
    const walletFrom = await getWallet(userId, walletIdFrom);
    const walletTo = await getWallet(userId, walletIdTo);
    // Edit Transfer
    await setTransfer({ date, id, walletIdFrom, walletIdTo }, queryRunner.manager);
    // Edit from transaction
    await setTransaction(
      {
        id: transactionIdFrom,
        amount: -Math.abs(amountFrom),
        description: `Transfer to ${walletTo.walletName}`,
        date,
        categoryId: categories.transfer.id,
        typeId: categoryTypes.transfer_send.id,
        walletId: walletIdFrom,
      },
      queryRunner.manager
    );
    // Edit to transaction
    await setTransaction(
      {
        id: transactionIdTo,
        amount: Math.abs(amountTo),
        description: `Transfer from ${walletFrom.walletName}`,
        date,
        categoryId: categories.transfer.id,
        typeId: categoryTypes.transfer_received.id,
        walletId: walletIdTo,
      },
      queryRunner.manager
    );

    // commit transactions
    await queryRunner.commitTransaction();

    return res.status(200).send({ message: "Transfer successfully changed" });
  } catch (error) {
    await queryRunner.rollbackTransaction();

    return res.status(500).send({ message: "Transfer does not exist" });
  } finally {
    // need to release query runner which is manually created:
    await queryRunner.release();
  }
};

export const removeTransfer = async (req: Request, res: Response) => {
  const { id, userId }: { id: number; userId: number } = req.body;

  const queryRunner = AppDataSource.createQueryRunner();

  // establish database connection
  await queryRunner.connect();

  // open a new transaction:
  await queryRunner.startTransaction();
  try {
    const transfer = await getTransfer({ userId, id });

    await deleteTransfer(id, queryRunner.manager);
    await deleteTransaction(transfer.fromTransactionId, queryRunner.manager);
    await deleteTransaction(transfer.toTransactionId, queryRunner.manager);

    // commit transactions
    await queryRunner.commitTransaction();

    return res.status(200).send({ message: "Transfer successfully deleted" });
  } catch (error) {
    await queryRunner.rollbackTransaction();

    return res.status(500).send({ message: "Transfer does not exist" });
  } finally {
    // need to release query runner which is manually created:
    await queryRunner.release();
  }
};
