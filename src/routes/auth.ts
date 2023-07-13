import * as express from "express";
import { deleteUser, getUserData, refreshAccessToken, registerUser } from "../controller/auth";

const router = express.Router();

router.post("/users/login", getUserData);
router.post("/users/register", registerUser);
router.post("/users/delete", deleteUser);
router.post("/refreshToken", refreshAccessToken);

export { router as authRoute };
