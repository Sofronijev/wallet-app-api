import * as express from "express";
import { tokenAuthorization } from "../auth/tokenAuth";
import { authRoute } from "./auth";
import { transactionRoute } from "./transaction";
import { walletsRoute } from "./wallets";
import { transferRoute } from "./transfer";

const router = express();

router.use(authRoute);
router.use(tokenAuthorization, transactionRoute);
router.use(tokenAuthorization, walletsRoute);
router.use(tokenAuthorization, transferRoute);

export default router;
