import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { createAccessToken, createRefreshToken, UserDataType } from "../auth/signToken";
import { verify } from "jsonwebtoken";
import { configDB } from "../config";

const userRepository = AppDataSource.getRepository(User);

type AuthUserData = {
  email: string;
  password: string;
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as AuthUserData;
    const user = await userRepository.findOneBy({
      email,
    });

    if (!user) {
      return res.status(403).send({ message: "Wrong email or password" });
    }

    const passwordMatched = await compare(password, user.password);

    if (passwordMatched) {
      const data = { id: user.id, username: user.username, email: user.email };
      const refreshToken = createRefreshToken(data);
      const accessToken = createAccessToken(data);

      return res.status(200).send({ data, token: { refreshToken, accessToken } });
    }
    return res.status(403).send({ message: "Wrong email or password" });
  } catch (error) {
    return res.status(500).send({ message: "Error getting user data" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as AuthUserData;
    const user = await userRepository.findOneBy({
      email,
    });

    if (user) {
      return res.status(403).send({ message: "Account already exists" });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPassword;

    const createdUser = await userRepository.save(newUser);

    const data = { id: createdUser.id, username: createdUser.username, email: createdUser.email };
    const refreshToken = createRefreshToken(data);
    const accessToken = createAccessToken(data);

    return res
      .status(200)
      .send({ message: "Account created", data, token: { refreshToken, accessToken } });
  } catch (error) {
    return res.status(500).send({ message: "Error creating account" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id }: { id: number } = req.body;
    const user = await userRepository.findOneBy({
      id,
    });
    if (!user) {
      return res.status(403).send({ message: "Account does't exists" });
    }
    await userRepository.delete(user);
    return res.status(200).send({ message: "Account deleted" });
  } catch (error) {
    return res.status(500).send({ message: "Error deleting account" });
  }
};

type TokenType = {
  userData: UserDataType;
  iat: number;
  exp: number;
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const decoded = verify(req.body.refreshToken, configDB.jwt_refresh) as TokenType;
    const user = await userRepository.findOneBy({
      email: decoded.userData.email,
    });
    if (!user) {
      return res.status(403).send({ message: "Access not allowed!" });
    }
    const { password, ...restData } = user;
    const accessToken = createAccessToken(restData);
    return res.status(200).send({ accessToken });
  } catch (error) {
    return res.status(403).send({ message: "Access not allowed!" });
  }
};
