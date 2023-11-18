import * as express from "express";
import { getUserWallets } from "../controller/wallets";
const router = express.Router();

router.post("/wallets/getUserWallets", getUserWallets);

export { router as walletsRoute };