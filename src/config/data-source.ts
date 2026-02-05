import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User.js";
import { Config } from "./index.js";
import { RefreshToken } from "../entity/RefreshToken.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Config.DB_HOST,
  port: (Config.DB_PORT),
  username: Config.DB_USER,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,
  synchronize:true,
  logging: false,
  entities: [User,RefreshToken],
});
