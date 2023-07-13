import "reflect-metadata";
import { DataSource } from "typeorm";
import { configDB } from "./config";
import { Category } from "./entities/Category";
import { Transaction } from "./entities/Transaction";
import { Type } from "./entities/Type";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: configDB.host,
  port: 3306,
  username: configDB.user,
  password: configDB.password,
  database: configDB.database,
  charset: "utf8_general_ci",
  synchronize: true,
  logging: true,
  entities: [User, Category, Type, Transaction],
  migrations: [],
  subscribers: [],
  bigNumberStrings: false,
});
