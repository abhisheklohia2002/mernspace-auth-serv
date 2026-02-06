 
 
import "reflect-metadata";
import express, { type NextFunction ,type Response,type Request} from "express";
import logger from "./config/logger.js";
import type { HttpError } from "http-errors";
import router from "./routes/auth.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",router)
app.use(express.static(path.join(__dirname, "../public"), { dotfiles: "allow" }));
app.get("/.well-known/jwks.json", (req, res) => {
  res.sendFile("jwks.json", { root: "public/.well-known" });
});
app.get("/", (req, res) => {
    res.send("<h1>Welcome to the Auth Service</h1>");
});

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err:HttpError,req:Request,res:Response,next:NextFunction)=>{
    logger.error(`Error occurred: ${err.message}`);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
       error:[
        {
            type:err.name,
            message:err.message,
            path:"",
            location:"",
        }
       ] 
    })
})

export default app;