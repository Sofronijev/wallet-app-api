import { sign } from "jsonwebtoken";
import { configDB } from "../config";

export type UserDataType = {
  id: number;
  username: string;
  email: string;
};

export const createAccessToken = (queryResult: UserDataType) => {
  return sign(
    {
      userData: queryResult,
    },
    configDB.jwt_token,
    {
      expiresIn: "30d",
    }
  );
};

export const createRefreshToken = (queryResult: UserDataType) => {
  return sign(
    {
      userData: queryResult,
    },
    configDB.jwt_refresh,
    {
      expiresIn: "180d",
    }
  );
};

