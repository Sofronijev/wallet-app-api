import * as express from "express";
import {
  addTransaction,
  editTransaction,
  getMonthlyTransactionsForUser,
  removeTransaction,
} from "../controller/transaction";

const router = express.Router();

router.post("/transaction/addTransaction", addTransaction);
router.put("/transaction/setTransaction", editTransaction);
router.delete("/transaction/deleteTransaction", removeTransaction);
router.post("/transaction/getMonthlyUserTransactions", getMonthlyTransactionsForUser);

export { router as transactionRoute };
