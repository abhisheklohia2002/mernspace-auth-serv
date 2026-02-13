import type {
  NextFunction,
  Request,
  Response,
} from "express-serve-static-core";
import type { UserService } from "../services/userService.js";
import createHttpError from "http-errors";
import type {
  CreateUserRequest,
  IValidateQuery,
  UserData,
} from "../types/index.js";
import { matchedData } from "express-validator";
class UserController {
  constructor(private userService: UserService) {}

  async create(req: CreateUserRequest, res: Response, next: NextFunction) {
    const data = { ...req.body };
    try {
      const user = await this.userService.createUser(data);
      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    const validateQuery: IValidateQuery = matchedData(req, {
      onlyValidData: true,
    });
    const [data, count] = await this.userService.getUsers(validateQuery);
    if (!data) {
      next(createHttpError(401, "user table is empty"));
    }
    res
      .status(201)
      .json({
        data,
        count,
        currentPage: validateQuery.currentPage,
        perPage: validateQuery.perPage,
      });
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    if (!Number(req.params.id)) {
      next(createHttpError(404, "UserId is missing"));
    }
    const users = await this.userService.getUserById(Number(req.params.id));
    if (!users) {
      next(createHttpError(404, "User is present"));
    }
    res.status(201).json({ msg: users });
  }
  async updateUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!Number(id)) {
      next(createHttpError(404, "UserId is missing"));
    }
    const data = req.body as UserData;
    const user = await this.userService.updateUserById(Number(id), data);
    if (!user) {
      next(createHttpError(401, "user row is not"));
    }

    res.status(201).json({ msg: user });
  }

  async deleteUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!Number(id)) {
      next(createHttpError(404, "UserId is missing"));
    }
    const userId = await this.userService.deleteUserById(Number(id));
    res.status(201).json({ userId });
  }
}

export default UserController;
