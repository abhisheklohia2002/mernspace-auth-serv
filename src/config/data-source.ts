import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from "./index.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Config.DB_HOST,
  port: (Config.DB_PORT),
  username: Config.DB_USER,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,
  synchronize:true,
  logging: false,
  entities: ['src/entity/*.ts'],
  migrations:['src/migration/*.ts'],
  subscribers:[]
});
