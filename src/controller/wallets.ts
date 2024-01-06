import { Request, Response } from "express";
import {
  getWalletsWithBalanceByUserId,
  updateWalletStartingBalance,
} from "../logic/helperFunctions/wallets";

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
