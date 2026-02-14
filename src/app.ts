import "reflect-metadata";
import express from "express";

import router from "./routes/auth.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import tenantRouter from "./routes/tenants.js";
import userRouter from "./routes/user.js";
import cors from "cors";
import { Config } from "./config/index.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [Config.FRONTEND_ADMIN_DOMAIN],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api/auth", router);
app.use("/api/tenant", tenantRouter);
app.use("/api/user", userRouter);

app.use(
  express.static(path.join(__dirname, "../public"), { dotfiles: "allow" }),
);
app.get("/.well-known/jwks.json", (req, res) => {
  res.sendFile("jwks.json", { root: "public/.well-known" });
});
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Auth Service</h1>");
});

app.use(globalErrorHandler)

export default app;
