import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV ?? "development";


const envPath = path.resolve(__dirname, `../../.env.${env}`);


config({ path: envPath });
export const Config = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SECRET_KEY:process.env.REFRESH_TOKEN_SECRET,
  JWKS_URI:process.env.JWKS_URI
};
