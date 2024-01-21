import { Request, Response } from "express";
import { createTransfer } from "../logic/helperFunctions/transfers";
import { createTransaction } from "../logic/helperFunctions/transactions";
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
        amount: -Number(amountFrom),
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
        amount: amountTo,
        description: `Transfer from ${walletFrom.walletName}`,
        date,
        userId,
        categoryId: categories.transfer.id,
        typeId: categoryTypes.transfer_received.id,
        walletId: walletIdTo,
      },
      queryRunner.manager
    );

    const transfer = await createTransfer(
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

    return res.status(200).send(transfer);
  } catch (error) {
    // Rollback the transaction if an error occurs
    await queryRunner.rollbackTransaction();

    return res.status(500).send({ message: "Failed to create a transfer." });
  } finally {
    // need to release query runner which is manually created:
    await queryRunner.release();
  }
};
