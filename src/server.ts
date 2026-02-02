import app from "./app.js";
import { Config } from "./config/index.js";
import logger from "./config/logger.js";


const startServer = ()=>{
    const PORT = Config.PORT
    try {
        app.listen(PORT,()=>{
            logger.error(`Server is running on port ${PORT}`);
            logger.info(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();