import { Request, Response } from "express";
import { getWalletsWithBalanceByUserId } from "../logic/helperFunctions/wallets";

export const getUserWallets = async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: number };
  try {
    const response = await getWalletsWithBalanceByUserId(userId);
  
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ message: "Error while getting your wallets." });
  }
};
