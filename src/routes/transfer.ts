import * as express from "express";
import { addTransfer } from "../controller/transfer";

const router = express.Router();

router.post("/transfer/addTransfer", addTransfer);
router.put("/transfer/setTransfer", () => undefined);
router.delete("/transfer/deleteTransfer", () => undefined);

export { router as transferRoute };
