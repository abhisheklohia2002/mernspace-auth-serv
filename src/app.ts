import express, { type NextFunction ,type Response,type Request} from "express";
import logger from "./config/logger.js";
import type { HttpError } from "http-errors";
const app = express();
app.get("/", (req, res) => {
    res.send("Welcome to the Auth Service");
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