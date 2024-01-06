import * as express from "express";
import { getUserWallets, setWalletStartingBalance } from "../controller/wallets";
const router = express.Router();

router.post("/wallets/getUserWallets", getUserWallets);
router.put("/wallets/setStartingBalance", setWalletStartingBalance);

export { router as walletsRoute };