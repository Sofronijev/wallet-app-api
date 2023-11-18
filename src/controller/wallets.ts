import { Request, Response } from "express";
import { getWalletsByUserId } from "../logic/helperFunctions/wallets";

export const getUserWallets = async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: number };
  try {
    const response = await getWalletsByUserId(userId);
    return res.status(200).send({
      wallets: response[0],
      count: response[1],
    });
  } catch (error) {
    return res.status(500).send({ message: "Error while getting your wallets." });
  }
};
