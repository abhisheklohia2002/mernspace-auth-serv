
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { AuthController } from "../controllers/Auth.controller.js";
import { UserService } from "../services/userService.js";
import  {AppDataSource}  from "../config/data-source.js";
import { User } from "../entity/User.js";
import logger from "../config/logger.js";
import { registerValidator } from "../validators/register.js";
import TokenService from "../services/TokenService.js";
import { RefreshToken } from "../entity/RefreshToken.js";
import { loginValidator } from "../validators/login.js";
import type { AuthRequest, RefreshTokenRequest } from "../types/index.js";
import validateRefreshToken from "../middleware/validateRefreshToken.js";
import parseRefreshToken from "../middleware/parseRefreshToken.js";

const router = express.Router();
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository)
const userRepository = AppDataSource.getRepository(User);
export const userService = new UserService(userRepository);
const authController = new AuthController(userService, logger,tokenService);

router.post(
  "/register",
  registerValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next)
);
router.post(
  "/login",
  loginValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next)
);
router.get(
  "/self",parseRefreshToken,
  (req: Request, res: Response, next: NextFunction) =>
    authController.self(req as AuthRequest, res, next)
);

router.post(
  "/refreshToken",validateRefreshToken,
  (req: Request, res: Response,next:NextFunction) =>
    authController.refreshToken(req as RefreshTokenRequest, res,next)
);

router.post(
  "/logout",parseRefreshToken,
  (req: Request, res: Response,next:NextFunction) =>
    authController.logout(req as RefreshTokenRequest, res,next)
);
export default router;
