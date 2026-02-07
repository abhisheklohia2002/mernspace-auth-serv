import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import authenications from "../middleware/authenications.js";
import UserController from "../controllers/User.controller.js";
import { userService } from "./auth.js";
const userRouter = express.Router();
const userController = new UserController(userService);
userRouter.get(
  "/",
  authenications,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getUsers(req, res, next),
);
userRouter.get(
  "/:id",
  authenications,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getUserById(req, res, next),
);

userRouter.put(
  "/:id",
  authenications,
  (req: Request, res: Response, next: NextFunction) =>
    userController.updateUserById(req, res, next),
);

userRouter.delete(
  "/:id",
  authenications,
  (req: Request, res: Response, next: NextFunction) =>
    userController.deleteUserById(req, res, next),
);
export default userRouter;
