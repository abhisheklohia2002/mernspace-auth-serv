import { type Response } from "express";
import type { RegisterRequestBody } from "../types/index.js";
import type { UserService } from "../services/userService.js";

export class AuthController {
  constructor(private readonly userService: UserService) {
  }
  async register(req: RegisterRequestBody, res: Response) {
    await this.userService.createUser(req.body)
    res.status(201).json({ message: "User registered successfully" });
  }
}
