import { Request, Response } from "express";
import {
  getBalanceDifference,
  getWalletsWithBalanceByUserId,
  updateWalletStartingBalance,
} from "../logic/helperFunctions/wallets";
import { createTransaction } from "../logic/helperFunctions/transactions";

export const getUserWallets = async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: number };
  try {
    const response = await getWalletsWithBalanceByUserId(userId);
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ message: "Error while getting your wallets." });
  }
};

export const setWalletStartingBalance = async (req: Request, res: Response) => {
  const { userId, walletId, value } = req.body as {
    userId: number;
    walletId: number;
    value: number;
  };
  try {
    await updateWalletStartingBalance(userId, walletId, value);
    return res.status(200).send({ message: "Starting balance updated!" });
  } catch (error) {
    return res.status(500).send({ message: "Error while setting your starting balance." });
  }
};

export const setWalletBalance = async (req: Request, res: Response) => {
  const { userId, walletId, value, date } = req.body as {
    userId: number;
    walletId: number;
    value: number;
    date: string;
  };
  try {
    const balanceDifference = await getBalanceDifference(userId, walletId, value);

    // TODO - maybe add a different check when transaction doesn't need to be created
    if (balanceDifference === 0) {
      return res.status(200).send({ message: "Balance updated!" });
    }

    const transaction = await createTransaction({
      amount: balanceDifference,
      description: "",
      date,
      userId,
      categoryId: 14,
      typeId: 68,
      walletId,
    });

    return res.status(200).send({ message: "Balance updated!", transaction });
  } catch (error) {
    return res.status(500).send({ message: "Error while updating your balance." });
  }
};
