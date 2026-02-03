import { type NextFunction, type Response } from "express";
import type { RegisterRequestBody } from "../types/index.js";
import type { UserService } from "../services/userService.js";
import type { Logger } from "winston";

export class AuthController {
  constructor(
    private readonly userService: UserService,
    private logger: Logger,
  ) {}
  async register(req: RegisterRequestBody, res: Response, next: NextFunction) {
    const { firstName, lastName, email } = req.body;
    this.logger.debug("New Request to register a user", {
      firstName,
      lastName,
      email,
    });
    try {
      const user = await this.userService.createUser(req.body);
      this.logger.info(`User has been Registerd`, { user });
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      next(error);
      return;
    }
  }
}
