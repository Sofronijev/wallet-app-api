import * as express from "express";
import {
  addTransfer,
  removeTransfer,
  fetchTransfer,
} from "../controller/transfer";

const router = express.Router();

router.post("/transfer/addTransfer", addTransfer);
router.post("/transfer/getTransfer", fetchTransfer);
router.put("/transfer/setTransfer", removeTransfer);
router.delete("/transfer/deleteTransfer", removeTransfer);

export { router as transferRoute };
