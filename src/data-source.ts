import "reflect-metadata";
import { DataSource } from "typeorm";
import { configDB } from "./config";

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
  entities: [__dirname + "/entities/*.ts"],
  migrations: [],
  subscribers: [],
  bigNumberStrings: false,
});
