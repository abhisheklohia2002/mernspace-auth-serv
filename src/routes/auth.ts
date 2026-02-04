import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { AuthController } from "../controllers/Auth.controller.js";
import { UserService } from "../services/userService.js";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entity/User.js";
import logger from "../config/logger.js";
import register from "../validators/register.js";
import TokenService from "../services/TokenService.js";

const router = express.Router();
const tokenService = new TokenService()
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService, logger,tokenService);

router.post(
  "/register",
  register,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next)
);
export default router;
