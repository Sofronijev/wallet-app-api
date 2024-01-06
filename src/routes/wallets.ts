import * as express from "express";
import { getUserWallets, setWalletBalance, setWalletStartingBalance } from "../controller/wallets";
const router = express.Router();

router.post("/wallets/getUserWallets", getUserWallets);
router.put("/wallets/setStartingBalance", setWalletStartingBalance);
router.post("/wallets/adjustBalance", setWalletBalance);

export { router as walletsRoute };