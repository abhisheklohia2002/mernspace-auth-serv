import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import authenications from "../middleware/authenications.js";
import UserController from "../controllers/User.controller.js";
import { canAccess } from "../middleware/canAccess.js";
import { UserRole } from "../constants/index.js";
import { UserService } from "../services/userService.js";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entity/User.js";
import listUserValidator from "../validators/list-user-validator.js";
const userRouter = express.Router();
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const userController = new UserController(userService);
userRouter.get(
  "/",
  authenications,
  canAccess([UserRole.ADMIN]),
  listUserValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getUsers(req, res, next),
);
userRouter.get(
  "/:id",
  authenications,
  canAccess([UserRole.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    userController.getUserById(req, res, next),
);

userRouter.put(
  "/:id",
  authenications,
  canAccess([UserRole.ADMIN]),

  (req: Request, res: Response, next: NextFunction) =>
    userController.updateUserById(req, res, next),
);

userRouter.delete(
  "/:id",
  authenications,
  canAccess([UserRole.ADMIN]),

  (req: Request, res: Response, next: NextFunction) =>
    userController.deleteUserById(req, res, next),
);



userRouter.post(
  "/",
  authenications,
  canAccess([UserRole.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    userController.create(req, res, next),
);
export default userRouter;
